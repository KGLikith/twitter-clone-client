"use client"

import { useState, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, VideoOff, ChevronLeft, ChevronRight } from "lucide-react"
import type { Participants } from "@/app/(full_page)/call/[callId]/page"
import type { User } from "@/gql/graphql"

interface CallGridProps {
  participants: Participants[]
  currentUser: User
  video: boolean
  localStream: MediaStream | null
  remoteStreams: Record<string, MediaStream>
  activeSpeaker?: string | null
}

export default function CallGrid({
  participants,
  currentUser,
  video,
  localStream,
  remoteStreams,
  activeSpeaker,
}: CallGridProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const getGridConfig = (participantCount: number, isVideo: boolean) => {
    if (!isVideo) {
      if (participantCount <= 4) return { cols: 2, rows: 2, maxPerPage: 4 }
      if (participantCount <= 9) return { cols: 3, rows: 3, maxPerPage: 9 }
      if (participantCount <= 16) return { cols: 4, rows: 4, maxPerPage: 16 }
      return { cols: 4, rows: 4, maxPerPage: 16 }
    } else {
      if (participantCount <= 2) return { cols: 1, rows: 2, maxPerPage: 2 }
      if (participantCount <= 4) return { cols: 2, rows: 2, maxPerPage: 4 }
      if (participantCount <= 6) return { cols: 3, rows: 2, maxPerPage: 6 }
      if (participantCount <= 9) return { cols: 3, rows: 3, maxPerPage: 9 }
      return { cols: 3, rows: 3, maxPerPage: 9 }
    }
  }

  const gridConfig = getGridConfig(participants.length, video)
  const totalPages = Math.ceil(participants.length / gridConfig.maxPerPage)

  const sortedParticipants = useMemo(() => {
    const currentUserParticipant = participants.find((p) => p.userId === currentUser.id)
    const otherParticipants = participants.filter((p) => p.userId !== currentUser.id)

    if (video && currentUserParticipant) {
      return [...otherParticipants, currentUserParticipant]
    } else {
      return currentUserParticipant ? [currentUserParticipant, ...otherParticipants] : otherParticipants
    }
  }, [participants, currentUser.id, video])

  const currentPageParticipants = sortedParticipants.slice(
    currentPage * gridConfig.maxPerPage,
    (currentPage + 1) * gridConfig.maxPerPage,
  )

  const isSelf = (id: string) => currentUser.id === id

  const ParticipantTile = ({ participant, index }: { participant: Participants; index: number }) => {
    const stream = isSelf(participant.userId) ? localStream : remoteStreams[participant.userId]
    const isCurrentUser = isSelf(participant.userId)
    const isSpeaking = activeSpeaker === participant.userId && participant.audio

    return (
      <div
        className={`
          relative rounded-lg overflow-hidden transition-all duration-200
          ${isSpeaking ? "ring-2 ring-green-500 ring-opacity-75" : ""}
          ${isCurrentUser ? "ring-2 ring-blue-500" : ""}
          ${video ? "aspect-video" : "aspect-square"}
          bg-muted
        `}
      >
        {video ? (
          <div className="w-full h-full relative">
            {participant.video && stream ? (
              <video
                ref={(el) => {
                  if (el && stream) {
                    el.srcObject = stream
                    el.muted = isCurrentUser 
                  }
                }}
                autoPlay
                playsInline
                muted={isCurrentUser}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Avatar className="h-16 w-16 md:h-20 md:w-20">
                  <AvatarImage
                    src={
                      participant.user.profileImageUrl
                        ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participant.user.profileImageUrl}`
                        : "/user.png"
                    }
                    alt={participant.user.name}
                  />
                  <AvatarFallback className="text-lg">{participant.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            )}

            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
              <span className="bg-black/70 text-white px-2 py-1 rounded text-xs truncate max-w-[60%]">
                {participant.user.name} {isCurrentUser && "(You)"}
              </span>
              <div className="flex gap-1">
                {!participant.audio && (
                  <div className="bg-red-500 rounded-full p-1">
                    <MicOff className="h-3 w-3 text-white" />
                  </div>
                )}
                {!participant.video && (
                  <div className="bg-red-500 rounded-full p-1">
                    <VideoOff className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>

            {!isCurrentUser && stream && (
              <audio
                ref={(el) => {
                  if (el && stream) {
                    el.srcObject = stream
                    el.muted = !participant.audio
                  }
                }}
                autoPlay
                playsInline
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="relative">
              <Avatar className={`h-12 w-12 md:h-16 md:w-16 ${isSpeaking ? "ring-2 ring-green-500" : ""}`}>
                <AvatarImage
                  src={
                    participant.user.profileImageUrl
                      ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participant.user.profileImageUrl}`
                      : "/user.png"
                  }
                  alt={participant.user.name}
                />
                <AvatarFallback>{participant.user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {!participant.audio && (
                <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                  <MicOff className="h-3 w-3 text-white" />
                </div>
              )}
              {isSpeaking && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <Mic className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="mt-2 text-center">
              <p className="text-sm font-medium truncate max-w-full">
                {participant.user.name} {isCurrentUser && "(You)"}
              </p>
              <p
                className={`text-xs ${
                  !participant.audio ? "text-red-500" : isSpeaking ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                {!participant.audio ? "Muted" : isSpeaking ? "Speaking" : "Silent"}
              </p>
            </div>

            {!isCurrentUser && stream && (
              <audio
                ref={(el) => {
                  if (el && stream) {
                    el.srcObject = stream
                    el.muted = !participant.audio
                  }
                }}
                autoPlay
                playsInline
              />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`
            grid gap-2 md:gap-4 w-full max-w-7xl
            grid-cols-${gridConfig.cols}
          `}
          style={{
            gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${Math.min(gridConfig.rows, Math.ceil(currentPageParticipants.length / gridConfig.cols))}, minmax(0, 1fr))`,
          }}
        >
          {currentPageParticipants.map((participant, index) => (
            <ParticipantTile key={participant.userId} participant={participant} index={index} />
          ))}
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Call info */}
      <div className="text-center mt-4 text-muted-foreground">
        <p className="text-sm">
          {participants.filter((p) => p.audio).length} of {participants.length} participants unmuted
        </p>
      </div>
    </div>
  )
}
