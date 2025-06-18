"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, Phone, Users } from "lucide-react"
import type { Call, User } from "@/gql/graphql"
import type { Participants as ParticipantsType } from "@/app/(full_page)/call/[callId]/page"
import {
  endCallMutation,
  hideVideoMutation,
  muteAudioMutation,
  showVideoMutation,
  unmuteAudioMutation,
} from "@/graphql/mutation/user"
import { apolloClient } from "@/clients/api"
import { toast } from "sonner"
import { useOnCallMediaUpdateSubscription } from "@/hooks/subscriptions"

interface VideoCallComponentProps {
  call: Call
  currentUser: User
  participants: ParticipantsType
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantsType>>
}

interface UserInfo {
  id: string
  name: string
  profileImageUrl?: string
}

export default function VideoCallComponent({
  call,
  currentUser,
  participants,
  setParticipants,
}: VideoCallComponentProps) {
  const router = useRouter()
  const [activeParticipant, setActiveParticipant] = useState<string | null>(null)
  const currentUserParticipant = participants.find((p) => p.userId === currentUser.id)
  const [isMuted, setIsMuted] = useState(!currentUserParticipant?.audio)
  const [isVideoOn, setIsVideoOn] = useState(currentUserParticipant?.video || false)
  const { data: mediaData } = useOnCallMediaUpdateSubscription(call.id)
  const isSelf = (id: string) => id === currentUser.id
  const isHost = currentUserParticipant?.userId === call.callerId

  const activeParticipantData = participants.find((p) => p.userId === activeParticipant)

  const [callDuration, setCallDuration] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const animationFrameRef = useRef<number | null>(null)
  const callStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const otherParticipants = participants.filter((p) => p.userId !== currentUser.id)
    const startTime = otherParticipants.length > 0 || call.callPickedAt

    if (startTime && !timerStarted) {
      const baseTime = new Date(isHost ? call.callPickedAt : currentUserParticipant?.joinedAt).getTime()
      callStartTimeRef.current = baseTime + callDuration * 1000
      setTimerStarted(true)
    } else if (!startTime && timerStarted) {
      setTimerStarted(false)
      callStartTimeRef.current = null
      setCallDuration(0)
    }
  }, [participants, currentUser.id])

  useEffect(() => {
    if (!timerStarted || !callStartTimeRef.current) return

    const updateDuration = () => {
      const now = Date.now()
      if (callStartTimeRef.current !== null) {
        const durationInSeconds = Math.floor((now - callStartTimeRef.current) / 1000)
        setCallDuration(durationInSeconds)
      }
      animationFrameRef.current = requestAnimationFrame(updateDuration)
    }
    animationFrameRef.current = requestAnimationFrame(updateDuration)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [timerStarted])

  useEffect(() => {
    if (mediaData?.onMediaUpdate) {
      const audioState = mediaData.onMediaUpdate.audioEnabled
      const participantId = mediaData.onMediaUpdate.userId
      const videoState = mediaData.onMediaUpdate.videoEnabled

      setParticipants((prev) =>
        prev.map((participant) => {
          if (participant.userId === participantId) {
            return {
              ...participant,
              audio: typeof audioState === "boolean" ? audioState : participant.audio,
              video: typeof videoState === "boolean" ? videoState : participant.video,
            }
          }
          return participant
        }),
      )
    }
  }, [mediaData, setParticipants])

  useEffect(() => {
    if (!activeParticipant && participants.length > 0) {
      setActiveParticipant(participants[0].userId)
    }
  }, [activeParticipant, participants])

  const handleEndCall = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: endCallMutation,
        variables: {
          callId: call.id,
        },
      })

      if (!data?.endCall) {
        toast.error("Failed to end the call. Please try again. Sorry for the inconvenience.")
      }
    } catch (err) {
      toast.error("An error occurred while ending the call. Please try again later.")
    }
  }

  const toggleMute = async () => {
    try {
      await apolloClient.mutate({
        mutation: isMuted ? unmuteAudioMutation : muteAudioMutation,
        variables: { callId: call.id },
      })
      setIsMuted(!isMuted)
    } catch (err) {
      console.error("Error toggling mute:", err)
      toast.error("Failed to toggle mute. Please try again.")
    }
  }

  const toggleVideo = async () => {
    try {
      console.log("Toggling video for call:", call.id, "Current user:", currentUser.id, "Is video on:", isVideoOn)
      await apolloClient.mutate({
        mutation: isVideoOn ? hideVideoMutation : showVideoMutation,
        variables: { callId: call.id },
      })
      setIsVideoOn(!isVideoOn)
    } catch (err) {
      console.error("Error toggling video:", err)
      toast.error("Failed to toggle video. Please try again.")
    }
  }

  const setAsActive = (participantId: string) => {
    setActiveParticipant(participantId)
  }

  const renderParticipantVideo = (participant: any, isMainView = false) => {
    const size = isMainView ? "h-32 w-32" : "h-12 w-12"

    if (participant.video) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
          <span className="text-white text-lg">Video Stream</span>
          {!participant.audio && (
            <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
              <MicOff className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
      )
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center bg-muted relative">
          <Avatar className={size}>
            <AvatarImage src={participant.user.profileImageUrl || "/placeholder.svg"} alt={participant.user.name} />
            <AvatarFallback>{participant.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {!participant.audio && (
            <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
              <MicOff className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
      )
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/messages/${call?.conversationId}`)}>
            Back
          </Button>
          <h2 className="font-semibold">Video Call</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{timerStarted ? formatDuration(callDuration) : "00:00"}</span>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{participants.length}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black/95 p-4 relative">
        <div className="w-full h-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {activeParticipantData ? (
            <div className="relative w-full h-full">
              {renderParticipantVideo(activeParticipantData, true)}
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-md text-white flex items-center gap-2">
                <span>{activeParticipantData.user.name}</span>
                {!activeParticipantData.audio && <MicOff className="h-4 w-4 text-red-400" />}
                {!activeParticipantData.video && <VideoOff className="h-4 w-4 text-red-400" />}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">No active participant</div>
          )}
        </div>

        <div className="absolute bottom-20 right-4 flex gap-2 overflow-x-auto max-w-full">
          {participants.map((participant) => (
            <div
              key={participant.userId}
              className={`relative cursor-pointer transition-all ${isSelf(participant.userId) ? "border-2 border-primary" : ""
                } ${activeParticipant === participant.userId ? "ring-2 ring-white" : ""}`}
              onClick={() => setAsActive(participant.userId)}
            >
              <div className="w-32 h-24 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {renderParticipantVideo(participant)}
              </div>
              <div className="absolute bottom-1 left-1 right-1 bg-black/50 px-1 py-0.5 rounded text-white text-xs truncate flex items-center justify-between">
                <span>
                  {participant.user.name} {isSelf(participant.userId) && "(You)"}
                </span>
                <div className="flex gap-1">
                  {!participant.audio && <MicOff className="h-3 w-3 text-red-400" />}
                  {!participant.video && <VideoOff className="h-3 w-3 text-red-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-card flex items-center justify-center gap-4">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="icon"
          className="rounded-full h-12 w-12"
          onClick={toggleMute}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <Button variant="destructive" size="icon" className="rounded-full h-14 w-14" onClick={handleEndCall}>
          <Phone className="h-6 w-6 rotate-135" />
        </Button>

        <Button
          variant={isVideoOn ? "secondary" : "destructive"}
          size="icon"
          className="rounded-full h-12 w-12"
          onClick={toggleVideo}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}
