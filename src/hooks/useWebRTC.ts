import { Participants } from "@/app/(full_page)/call/[callId]/page";
import { apolloClient } from "@/clients/api";
import { ConversationSkeleton } from "@/components/global/Skeleton/ConversationSkel";
import {
  sendAnswerMutation,
  sendIceCandidateMutation,
  sendOfferMutation,
} from "@/graphql/mutation/user";
import { useEffect, useRef, useState } from "react";

export function useWebRTCPeer(
  localUserId: string,
  participants: Participants[],
  callId: string,
  callEnded: boolean,
  video: boolean,
  setAudioPermissionGranted: (granted: boolean) => void,
  setVideoPermissionGranted?: (granted: boolean) => void
) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<
    Record<string, MediaStream>
  >({});
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const currentUserParticipant = participants.find(
    (p) => p.userId === localUserId
  );

  useEffect(() => {
    (async () => {
      try {
        if (!callEnded) {
          if (localStream) return;
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: currentUserParticipant?.audio !== false,
            video:
              currentUserParticipant?.video !== false && video
                ? {
                    width: { min: 640, ideal: 1920, max: 1920 },
                    height: { min: 480, ideal: 1080, max: 1080 },
                  }
                : false,
          });
          setLocalStream(stream);

          setAudioPermissionGranted(true);
          setVideoPermissionGranted?.(video);
        }
      } catch (error) {
        try {
          const fallbackConstraints: MediaStreamConstraints = {
            audio: true,
            video: video
              ? {
                  width: { min: 640, ideal: 1920, max: 1920 },
                  height: { min: 480, ideal: 1080, max: 1080 },
                }
              : false,
          };

          const fallbackStream = await navigator.mediaDevices.getUserMedia(
            fallbackConstraints
          );
          setLocalStream(fallbackStream);

          setAudioPermissionGranted(true);
          setVideoPermissionGranted?.(video);
        } catch (fallbackError) {
          console.log("Completely failed to get any media:", fallbackError);
          setLocalStream(null);
          setAudioPermissionGranted(false);
        }
      }
    })();
  }, [video, callEnded, currentUserParticipant]);

  useEffect(() => {
    if (!localStream) return;

    setTimeout(() => {
      participants.forEach((p) => {
        if (
          p.userId !== localUserId &&
          !peerConnections.current[p.userId] &&
          p.userId > localUserId
        ) {
          createOffer(p.userId);
        }
      });
    }, 500);
  }, [participants]);

  useEffect(() => {
    if (!currentUserParticipant || !localStream) return;

    let videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack) {
      if (currentUserParticipant.video) {
        videoTrack.enabled = true;
      } else {
        console.log("Disabling video track for user:", localUserId);
        videoTrack.enabled = false;
      }
    }

    let audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");
    if (audioTrack) {
      if (currentUserParticipant.audio) {
        audioTrack.enabled = true;
      } else {
        console.log("Disabling audio track for user:", localUserId);
        audioTrack.enabled = false;
      }
    }
  }, [currentUserParticipant?.audio, currentUserParticipant?.video, currentUserParticipant, localStream]);

  const createConnection = async (remoteUserId: string) => {
    if (peerConnections.current[remoteUserId])
      return peerConnections.current[remoteUserId];

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnections.current[remoteUserId] = pc;
    let stream;
    if (!localStream) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setLocalStream(stream);
    }
    const Stream = (localStream || stream)!;
    Stream.getTracks().forEach((track) => pc.addTrack(track, Stream));

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => {
        const existingStream = prev[remoteUserId] ?? new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          if (!existingStream.getTracks().find((t) => t.id === track.id)) {
            existingStream.addTrack(track);
          }
        });

        return {
          ...prev,
          [remoteUserId]: existingStream,
        };
      });
    };

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await apolloClient.mutate({
          mutation: sendIceCandidateMutation,
          variables: {
            targetUserId: remoteUserId,
            candidate: JSON.stringify(event.candidate.toJSON()),
            callId,
          },
        });
      }
    };

    return pc;
  };

  const createOffer = async (remoteUserId: string) => {
    if (peerConnections.current[remoteUserId]) {
      return;
    }
    if (!localStream) {
      console.warn("Local stream is not available, cannot create offer.");
      return;
    }

    const pc = await createConnection(remoteUserId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    // console.log("Creating offer for remote user:", remoteUserId, offer);

    await apolloClient.mutate({
      mutation: sendOfferMutation,
      variables: {
        targetUserId: remoteUserId,
        sdp: String(offer.sdp),
        callId: callId,
      },
    });
  };

  const createAnswer = async (remoteUserId: string, sdp: string) => {
    if (peerConnections.current[remoteUserId]) {
      console.warn(`Peer connection already exists for user: ${remoteUserId}`);
      return;
    }
    const pc = await createConnection(remoteUserId);
    await pc.setRemoteDescription(
      new RTCSessionDescription({ type: "offer", sdp: sdp })
    );
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    await apolloClient.mutate({
      mutation: sendAnswerMutation,
      variables: {
        targetUserId: remoteUserId,
        sdp: String(answer.sdp),
        callId: callId,
      },
    });
  };

  const setRemoteDescription = (remoteUserId: string, desc: string) => {
    // console.log("Setting remote description for user:", remoteUserId);
    peerConnections.current[remoteUserId]?.setRemoteDescription(
      new RTCSessionDescription({ type: "answer", sdp: desc })
    );
  };

  const addIceCandidate = (remoteUserId: string, candidate: string) => {
    const parsedCandidate = JSON.parse(candidate) as RTCIceCandidateInit;
    if (!peerConnections.current[remoteUserId]) {
      console.warn(`No peer connection found for user: ${remoteUserId}`);
      return;
    }
    // console.log(
    //   "Adding ICE candidate for remote user:",
    //   remoteUserId,
    //   parsedCandidate
    // );

    peerConnections.current[remoteUserId]?.addIceCandidate(
      new RTCIceCandidate(parsedCandidate)
    );
  };

  const closeAllConnections = () => {
    Object.values(peerConnections.current).forEach((pc) => pc.close());
    Object.keys(peerConnections.current).forEach(
      (key) => delete peerConnections.current[key]
    );
    if (localStream) {
      for (const track of localStream.getTracks()) {
        track.stop();
      }
      setLocalStream(null);
    }

    setRemoteStreams({});
  };

  return {
    localStream,
    remoteStreams,
    peerConnections: peerConnections.current,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
    closeAllConnections,
  };
}
