"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Phone, Users } from "lucide-react"
import type { Call, User } from "@/gql/graphql"
import type { Participants } from "@/app/(full_page)/call/[callId]/page"
import { apolloClient } from "@/clients/api"
import { endCallMutation, muteAudioMutation, unmuteAudioMutation } from "@/graphql/mutation/user"
import { toast } from "sonner"
import { useOnCallMediaUpdateSubscription } from "@/hooks/subscriptions"

interface AudioCallComponentProps {
  call: Call
  currentUser: User
  participants: Participants
  setParticipants: React.Dispatch<React.SetStateAction<Participants>>
}

export default function AudioCallComponent({
  call,
  currentUser,
  participants,
  setParticipants,
}: AudioCallComponentProps) {
  const router = useRouter()
  const currentUserParticipant = participants.find((p) => p.userId === currentUser.id)
  const isHost = currentUserParticipant?.userId === call.callerId
  const [isMuted, setIsMuted] = useState(!currentUserParticipant?.audio)
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const animationFrameRef = useRef<number | null>(null)
  const callStartTimeRef = useRef<number | null>(null)

  const { data: mediaData } = useOnCallMediaUpdateSubscription(call.id)

  useEffect(() => {
    if (!currentUserParticipant) return
    const nonHostParticipants = participants.filter((p) => p.userId !== currentUser.id)
    const shouldStartTimer = nonHostParticipants.length > 0 || call.callPickedAt

    if (shouldStartTimer && !timerStarted) {
      const baseStartTime = new Date(isHost ? call.callPickedAt :currentUserParticipant?.joinedAt).getTime()
      callStartTimeRef.current = baseStartTime + callDuration * 1000
      setTimerStarted(true)
    } else if (!shouldStartTimer && timerStarted) {
      setTimerStarted(false)
      setCallDuration(0)
      callStartTimeRef.current = null
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

      setParticipants((prev) =>
        prev.map((participant) => {
          if (participant.userId === participantId) {
            return {
              ...participant,
              audio: typeof audioState === "boolean" ? audioState : participant.audio,
            }
          }
          return participant
        }),
      )
    }
  }, [mediaData, setParticipants])

  useEffect(() => {
    const unmutedParticipants = participants.filter((p) => p.audio)

    if (unmutedParticipants.length === 0) {
      setActiveSpeaker(null)
      return
    }

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * unmutedParticipants.length)
      setActiveSpeaker(unmutedParticipants[randomIndex]?.userId ?? null)
    }, 5000)

    return () => clearInterval(interval)
  }, [participants])

  

  const isSelf = (id: string) => currentUser.id === id

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

  const getParticipantStatus = (participant: any) => {
    if (!participant.audio) {
      return "Muted"
    }
    if (activeSpeaker === participant.userId) {
      return "Speaking"
    }
    return "Silent"
  }

  const getParticipantStatusColor = (participant: any) => {
    if (!participant.audio) {
      return "text-destructive"
    }
    if (activeSpeaker === participant.userId) {
      return "text-green-500"
    }
    return "text-muted-foreground"
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
          <h2 className="font-semibold">Audio Call</h2>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>{participants.length}</span>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-background to-muted/30 p-4 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl w-full">
          {participants.map((participant) => (
            <div
              key={participant.userId}
              className={`flex flex-col items-center p-4 rounded-lg transition-all ${activeSpeaker === participant.userId && participant.audio ? "bg-primary/10 ring-2 ring-primary/30" : ""
                }`}
            >
              <div className="relative">
                <Avatar className={`h-24 w-24 ${isSelf(participant.userId) ? "ring-2 ring-primary" : ""}`}>
                  <AvatarImage
                    src={participant.user.profileImageUrl || "/placeholder.svg"}
                    alt={participant.user.name}
                  />
                  <AvatarFallback>{participant.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                {!participant.audio && (
                  <div className="absolute -bottom-1 -right-1 bg-destructive rounded-full p-1">
                    <MicOff className="h-4 w-4 text-destructive-foreground" />
                  </div>
                )}
                {participant.audio && activeSpeaker === participant.userId && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <Mic className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-medium">
                  {participant.user.name} {isSelf(participant.userId) && "(You)"}
                </h3>
                <p className={`text-sm ${getParticipantStatusColor(participant)}`}>
                  {getParticipantStatus(participant)}
                </p>
              </div>
              <div className="mt-2">
                {!participant.audio ? (
                  <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full flex items-center gap-1">
                    <MicOff className="h-3 w-3" />
                    Muted
                  </span>
                ) : (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
                    <Mic className="h-3 w-3" />
                    Unmuted
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-muted-foreground">
          <p>Call duration: {timerStarted ? formatDuration(callDuration) : "00:00"}</p>
          <p className="text-sm mt-1">
            {participants.filter((p) => p.audio).length} of {participants.length} participants unmuted
          </p>
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
      </div>
    </div>
  )
}
