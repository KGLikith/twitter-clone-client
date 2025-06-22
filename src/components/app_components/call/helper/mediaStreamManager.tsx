"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import type { Participants } from "@/app/(full_page)/call/[callId]/page"
import type { Call, User } from "@/gql/graphql"
import {
  useOnAnswerSubscription,
  useOnCallEndedSubscription,
  useOnIceCandidateSubscription,
  useOnOfferSubscription,
} from "@/hooks/subscriptions"
import { usePathname, useRouter } from "next/navigation"
import CallGrid from "./call-grid"
import { getVolumeFromStream } from "@/actions/call"
import { useWebRTCPeer } from "@/hooks/useWebRTC"
// import { useWebRTCPeer } from "@/hooks/useWebRTC(Init)"


type Props = {
  participants: Participants[]
  call: Call
  currentUser: User
  video: boolean
  setAudioPermissionGranted: React.Dispatch<React.SetStateAction<boolean>>
  setVideoPermissionGranted?: React.Dispatch<React.SetStateAction<boolean>>
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>
  setIsVideoOn: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MediaStreamManager({
  participants,
  call,
  currentUser,
  video,
  setIsMuted,
  setIsVideoOn,
  setAudioPermissionGranted,
  setVideoPermissionGranted,
}: Props) {
  const [callEnded, setCallEnded] = useState(false)
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  const router = useRouter();

  const {
    localStream,
    remoteStreams,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
    closeAllConnections,
  } = useWebRTCPeer(
    currentUser.id,
    participants,
    call.id,
    callEnded,
    video,
    setIsMuted,
    setIsVideoOn,
  )

  const { data: callEndedData } = useOnCallEndedSubscription(call.id)
  const { data: offerData } = useOnOfferSubscription(currentUser.id)
  const { data: answerData } = useOnAnswerSubscription(currentUser.id)
  const { data: candidateData } = useOnIceCandidateSubscription(currentUser.id)

  const pathname = usePathname()
  const prevPathRef = useRef(pathname)

  const analyzersRef = useRef<Record<string, ReturnType<typeof getVolumeFromStream>>>({});

  useEffect(() => {
    participants.forEach(p => {
      const stream = remoteStreams[p.userId];
      if (stream && !analyzersRef.current[p.userId]) {
        analyzersRef.current[p.userId] = getVolumeFromStream(stream);
      }
    });

    const interval = setInterval(() => {
      const volumes = participants.map(p => {
        const analyzer = analyzersRef.current[p.userId];
        if (!analyzer) return { id: p.userId, volume: 0 };
        return { id: p.userId, volume: analyzer.getVolume() };
      });

      const loudest = volumes.reduce((max, cur) =>
        cur.volume > max.volume ? cur : max,
        { id: "", volume: 0 }
      );

      if (loudest.volume > 10) {
        setActiveSpeaker(loudest.id);
      } else {
        setActiveSpeaker(null);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [participants, remoteStreams]);

  useEffect(() => {
    if (!call) return

    const handleUnload = () => {
      closeAllConnections();
      router.refresh();
    }

    window.addEventListener("beforeunload", handleUnload)

    if (prevPathRef.current !== pathname) {
      closeAllConnections()
      router.refresh();
    }

    prevPathRef.current = pathname

    return () => {
      window.removeEventListener("beforeunload", handleUnload)
    }
  }, [call?.id, call?.callerId, call, pathname])

  useEffect(() => {
    if (offerData?.onOffer) {
      const offerDetails = offerData.onOffer
      if (offerDetails.callId === call.id && offerDetails.fromUserId !== currentUser.id) {
        console.log("Received offer from:", offerDetails.fromUserId)
        setTimeout(() => {
          createAnswer(offerDetails.fromUserId, offerDetails.sdp)
        }, 10)
      }
    }
  }, [offerData])

  useEffect(() => {
    if (answerData?.onAnswer) {
      const answerDetails = answerData.onAnswer
      if (answerDetails.callId === call.id && answerDetails.fromUserId !== currentUser.id) {
        setRemoteDescription(answerDetails.fromUserId, answerDetails.sdp)
      }
    }
  }, [answerData])


  useEffect(() => {
    if (candidateData?.onIceCandidate) {
      const candidateDetails = candidateData.onIceCandidate

      if (candidateDetails.callId === call.id && candidateDetails.fromUserId !== currentUser.id) {
        addIceCandidate(candidateDetails.fromUserId, candidateDetails.candidate)
      }
    }
  }, [candidateData])

  useEffect(() => {
    if (callEndedData?.onCallEnded) {
      const endedCallDetails = callEndedData.onCallEnded
      if (endedCallDetails.callId === call.id) {
        setCallEnded(true)
        closeAllConnections()
        router.refresh();
      }
    }
  }, [callEndedData])

  useEffect(() => {
    if (!video) {
      // Simple active speaker detection based on audio state
      const speakingParticipants = participants.filter((p) => p.audio)
      if (speakingParticipants.length > 0) {
        // Rotate active speaker every few seconds for demo
        const interval = setInterval(() => {
          const randomSpeaker = speakingParticipants[Math.floor(Math.random() * speakingParticipants.length)]
          setActiveSpeaker(randomSpeaker.userId)
        }, 3000)

        return () => clearInterval(interval)
      }
    }
  }, [participants, video])

  return (
    <CallGrid
      participants={participants}
      currentUser={currentUser}
      video={video}
      localStream={localStream}
      remoteStreams={remoteStreams}
      activeSpeaker={activeSpeaker}
    />
  )
}
