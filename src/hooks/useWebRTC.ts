import { useEffect, useRef, useState } from "react";
import {
  sendOfferMutation,
  sendAnswerMutation,
  sendIceCandidateMutation,
} from "@/graphql/mutation/user";
import { apolloClient } from "@/clients/api";
import { Participants } from "@/app/(full_page)/call/[callId]/page";
import { Call } from "@/gql/graphql";
import { px } from "framer-motion";

export function useWebRTCPeer(
  localUserId: string,
  participants: Participants[],
  callId: string,
  callEnded: boolean,
  video: boolean,
  setIsMuted: (muted: boolean) => void,
  setIsVideoOn: (videoOn: boolean) => void
) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<
    Record<string, MediaStream>
  >({});
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const senders = useRef<
    Record<string, { audio?: RTCRtpSender; video?: RTCRtpSender }>
  >({});
  const localTracks = useRef<{
    audio?: MediaStreamTrack;
    video?: MediaStreamTrack;
  }>({});

  const currentUser = participants.find((p) => p.userId === localUserId);

  const createConnection = async (remoteUserId: string) => {
    if (peerConnections.current[remoteUserId])
      return peerConnections.current[remoteUserId];

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnections.current[remoteUserId] = pc;

    // Add transceivers
    const audioTransceiver = pc.addTransceiver("audio", {
      direction: "sendrecv",
    });
    const videoTransceiver = pc.addTransceiver("video", {
      direction: "sendrecv",
    });
    senders.current[remoteUserId] = {
      audio: audioTransceiver.sender,
      video: videoTransceiver.sender,
    };

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await apolloClient.mutate({
          mutation: sendIceCandidateMutation,
          variables: {
            callId,
            targetUserId: remoteUserId,
            candidate: JSON.stringify(event.candidate.toJSON()),
          },
        });
      }
    };

    pc.ontrack = (event) => {
      const track = event.track;
      setRemoteStreams((prev) => {
        const existing = prev[remoteUserId] ?? new MediaStream();
        if (!existing.getTracks().some((t) => t.id === track.id)) {
          existing.addTrack(track);
        }
        return { ...prev, [remoteUserId]: existing };
      });
    };

    return pc;
  };

  const createOffer = async (remoteUserId: string) => {
    const pc = await createConnection(remoteUserId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await apolloClient.mutate({
      mutation: sendOfferMutation,
      variables: { callId, targetUserId: remoteUserId, sdp: String(offer.sdp) },
    });
  };

  const createAnswer = async (remoteUserId: string, sdp: string) => {
    const pc = await createConnection(remoteUserId);
    await pc.setRemoteDescription(
      new RTCSessionDescription({ type: "offer", sdp })
    );
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await apolloClient.mutate({
      mutation: sendAnswerMutation,
      variables: {
        callId,
        targetUserId: remoteUserId,
        sdp: String(answer.sdp),
      },
    });
  };

  const setRemoteDescription = (remoteUserId: string, sdp: string) => {
    const pc = peerConnections.current[remoteUserId];
    if (pc) {
      pc.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp })
      );
    }
  };

  const addIceCandidate = (remoteUserId: string, candidate: string) => {
    const pc = peerConnections.current[remoteUserId];
    if (pc) {
      pc.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
    }
  };

  const setupInitialMedia = async () => {
    if (localStream) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: video,
      });
      setLocalStream(stream);

      stream.getTracks().forEach((track) => {
        if (track.kind === "audio") localTracks.current.audio = track;
        if (track.kind === "video") localTracks.current.video = track;
      });

      // Add local tracks to all peer connections
      for (const remoteUserId of Object.keys(senders.current)) {
        const sender = senders.current[remoteUserId];
        if (sender.audio && localTracks.current.audio) {
          await sender.audio.replaceTrack(localTracks.current.audio);
        }
        if (sender.video && localTracks.current.video) {
          await sender.video.replaceTrack(localTracks.current.video);
        }
      }

      setIsMuted(false);
      setIsVideoOn(true);
    } catch (err) {
      console.error("Media error:", err);
      setIsMuted(true);
      setIsVideoOn(false);
    }
  };

  const toggleTrack = async (kind: "audio" | "video", enable: boolean) => {
    if (enable) {
      const stream = await navigator.mediaDevices.getUserMedia({
        [kind]: true,
      });
      const track = stream.getTracks()[0];
      localTracks.current[kind] = track;

      if (localStream) {
        console.log("Adding track:", track.id);
        localStream.addTrack(track); 
      }

      // Update all peer connections
      for (const remoteUserId of Object.keys(peerConnections.current)) {
        const sender = senders.current[remoteUserId];
        if (sender) {
          await sender[kind]?.replaceTrack(track);
        }
      }

      if (kind === "audio") setIsMuted(false);
      if (kind === "video") setIsVideoOn(true);
    } else {
      const oldTrack = localTracks.current[kind];
      for (const remoteUserId of Object.keys(peerConnections.current)) {
        const sender = senders.current[remoteUserId];
        if (sender) {
          await sender[kind]?.replaceTrack(null);
        }
      }

      console.log(oldTrack, "oldTrack");
      if (oldTrack instanceof MediaStreamTrack) {
        // Stop the track and remove it from the local stream
        console.log("Stopping track:", oldTrack.id);
        oldTrack.stop();
        if (
          localStream &&
          localStream.getTracks().some((t) => t.id === oldTrack.id)
        ) {
          localStream.removeTrack(oldTrack);
        }
      }
      localTracks.current[kind] = undefined;

      if (kind === "audio") setIsMuted(true);
      if (kind === "video") setIsVideoOn(false);
    }
  };

  useEffect(() => {
    if (!localStream) return;
    participants.forEach((p) => {
      if (
        p.userId !== localUserId &&
        !peerConnections.current[p.userId] &&
        p.userId > localUserId
      ) {
        createOffer(p.userId);
      }
    });
  }, [participants, localStream]);

  useEffect(() => {
    (async () => {
      await setupInitialMedia();
      await toggleTrack("audio", !!currentUser?.audio);
      await toggleTrack("video", !!currentUser?.video);
    })();
  }, [currentUser?.audio, currentUser?.video]);

  const closeAllConnections = () => {
    Promise.all([
      ...Object.values(peerConnections.current).map((pc) => pc.close()),
      ...Object.values(localTracks.current).map((track) => track?.stop()),
      localStream?.getTracks().forEach((track) => track.stop()),
    ]).then(() => {
      setLocalStream(null);
      setRemoteStreams({});
      peerConnections.current = {};
      senders.current = {};
      localTracks.current = {};
    });
  };

  return {
    localStream,
    remoteStreams,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
    toggleTrack,
    closeAllConnections,
  };
}
