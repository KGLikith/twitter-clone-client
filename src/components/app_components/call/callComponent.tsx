"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import type { Call, User } from "@/gql/graphql"
import type { Participants } from "@/app/(full_page)/call/[callId]/page"
import { useOnCallMediaUpdateSubscription } from "@/hooks/subscriptions"
import { useCallTimer } from "./helper/useCallTimer"
import Controls from "./helper/controls"
import { formatDurationSec } from "./helper"
import MediaStreamManager from "./helper/mediaStreamManager"

interface CallComponentProps {
  call: Call
  currentUser: User
  participants: Participants[]
  setParticipants: React.Dispatch<React.SetStateAction<Participants[]>>
  video: boolean
}

export default function CallComponent({ call, currentUser, participants, setParticipants, video }: CallComponentProps) {
  const router = useRouter()
  const currentUserParticipant = participants.find((p) => p.userId === currentUser.id)
  const isHost = currentUserParticipant?.userId === call.callerId
  const [audioPermissationGranted, setAudioPermissionGranted] = useState(true)
  const [videoPermissationGranted, setVideoPermissionGranted] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(false)

  const { data: mediaData } = useOnCallMediaUpdateSubscription(call.id)
  const { callDuration, timerStarted } = useCallTimer(call, currentUser, participants)

  useEffect(() => {
    if (!audioPermissationGranted) {
      setParticipants((prev) => {
        return prev.map((participant) => {
          if (participant.userId === currentUser.id) {
            return {
              ...participant,
              audio: false,
            }
          }
          return participant
        })
      })
    }
  }, [audioPermissationGranted, currentUser.id, setParticipants])

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
              ...(video && {
                video: typeof videoState === "boolean" ? videoState : participant.video,
              }),
            }
          }
          return participant
        }),
      )
    }
  }, [mediaData, setParticipants, video])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/messages/${call?.conversationId}`)}>
            Back
          </Button>
          <h2 className="font-semibold">{video ? "Video Call" : "Audio Call"}</h2>
        </div>
        <div className="flex items-center gap-4">
          {video && (
            <span className="text-sm text-muted-foreground">
              {timerStarted ? formatDurationSec(callDuration) : "00:00"}
            </span>
          )}
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{participants.length}</span>
          </div>
        </div>
      </div>

      <MediaStreamManager
        participants={participants}
        call={call}
        currentUser={currentUser}
        video={video}
        setAudioPermissionGranted={setAudioPermissionGranted}
        setIsMuted={setIsMuted}
        setIsVideoOn={setIsVideoOn}
        
        {...(video && { setVideoPermissionGranted })}
      />

      <Controls
        currentUserParticipant={currentUserParticipant as Participants}
        audioPermissationGranted={audioPermissationGranted}
        call={call}
        videoCallComponent={video}
        {...(video && { videoPermissationGranted })}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isVideoOn={isVideoOn}
        setIsVideoOn={setIsVideoOn}
      />
    </div>
  )
}
