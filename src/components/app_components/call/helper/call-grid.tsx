"use client"

import type React from "react"

import { useState, useMemo, useRef, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MicOff, VideoOff, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react"
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
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null)
  const [currentUserPosition, setCurrentUserPosition] = useState<
    "top-left" | "top-right" | "bottom-left" | "bottom-right"
  >("bottom-left")
  const [mainViewParticipant, setMainViewParticipant] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<HTMLDivElement>(null)

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768
  const isOneOnOne = participants.length === 2

  // one o n one
  const getOneOnOneParticipants = () => {
    if (!isOneOnOne) return { main: null, small: null }

    const otherParticipant = participants.find((p) => p.userId !== currentUser.id)
    const currentUserParticipant = participants.find((p) => p.userId === currentUser.id)

    if (mainViewParticipant === currentUser.id) {
      return { main: currentUserParticipant, small: otherParticipant }
    } else {
      return { main: otherParticipant, small: currentUserParticipant }
    }
  }

  const allParticipants = useMemo(() => participants, [participants])

  const otherParticipants = useMemo(
    () => participants.filter((p) => p.userId !== currentUser.id),
    [participants, currentUser.id],
  )

  const currentUserParticipant = useMemo(
    () => participants.find((p) => p.userId === currentUser.id),
    [participants, currentUser.id],
  )

  const getAudioGridConfig = (count: number, isMobile: boolean) => {
    if (isMobile) {
      if (count <= 2) return { cols: 1, rows: 2, maxPerPage: 2 }
      if (count <= 4) return { cols: 2, rows: 2, maxPerPage: 4 }
      return { cols: 2, rows: 3, maxPerPage: 6 }
    } else {
      if (count <= 4) return { cols: 4, rows: 1, maxPerPage: 4 }
      if (count <= 8) return { cols: 4, rows: 2, maxPerPage: 8 }
      return { cols: 4, rows: 3, maxPerPage: 12 }
    }
  }

  const getVideoGridConfig = (count: number, isMobile: boolean) => {
    if (isMobile) {
      if (count <= 1) return { cols: 1, rows: 1, maxPerPage: 1 }
      if (count <= 2) return { cols: 1, rows: 2, maxPerPage: 2 }
      if (count <= 4) return { cols: 2, rows: 2, maxPerPage: 4 }
      return { cols: 2, rows: 3, maxPerPage: 6 }
    } else {
      if (count <= 1) return { cols: 1, rows: 1, maxPerPage: 1 }
      if (count === 2) return { cols: 2, rows: 1, maxPerPage: 2 }
      if (count === 3) return { cols: 2, rows: 2, maxPerPage: 3 }
      if (count === 4) return { cols: 2, rows: 2, maxPerPage: 4 }
      if (count <= 6) return { cols: 3, rows: 2, maxPerPage: 6 }
      return { cols: 3, rows: 3, maxPerPage: 9 }
    }
  }

  const gridConfig = video
    ? getVideoGridConfig(otherParticipants.length, isMobile)
    : getAudioGridConfig(allParticipants.length, isMobile)

  const displayParticipants = video ? otherParticipants : allParticipants
  const totalPages = Math.ceil(displayParticipants.length / gridConfig.maxPerPage)

  const currentPageParticipants = displayParticipants.slice(
    currentPage * gridConfig.maxPerPage,
    (currentPage + 1) * gridConfig.maxPerPage,
  )

  const handleTileClick = (participantId: string) => {
    if (!video) return

    if (isOneOnOne) {
      setMainViewParticipant(participantId)
    } else {
      if (expandedParticipant === participantId) {
        setExpandedParticipant(null)
      } else {
        setExpandedParticipant(participantId)
      }
    }
  }

  // WIP: Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return

    setIsDragging(true)
    const rect = dragRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return

      const container = dragRef.current.parentElement
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const tileRect = dragRef.current.getBoundingClientRect()

      let newX = e.clientX - containerRect.left - dragOffset.x
      let newY = e.clientY - containerRect.top - dragOffset.y

      // Constrain within container bounds with padding
      const padding = 20
      newX = Math.max(padding, Math.min(newX, containerRect.width - tileRect.width - padding))
      newY = Math.max(padding, Math.min(newY, containerRect.height - tileRect.height - padding))

      dragRef.current.style.left = `${newX}px`
      dragRef.current.style.top = `${newY}px`
    },
    [isDragging, dragOffset],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useState(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  })

  const AudioTile = ({
    participant,
    isSpeaking,
    stream,
  }: { participant: Participants; isSpeaking: boolean; stream: MediaStream | null }) => {
    const isCurrentUser = participant.userId === currentUser.id

    return (
      <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-xl min-h-[250px] min-w-[200px] max-w-[300px] max-h-[400px]">
        <div className="relative mb-3">
          <div className={`relative ${isSpeaking ? "animate-pulse" : ""}`}>
            {isSpeaking && !isCurrentUser && (
              <>
                <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping scale-125"></div>
                <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping scale-150 animation-delay-75"></div>
                <div className="absolute inset-0 rounded-full bg-green-400/10 animate-ping scale-175 animation-delay-150"></div>
              </>
            )}
            <Avatar
              className={`h-16 w-16 transition-all duration-300 ${(isSpeaking && !currentUser )? "ring-4 ring-green-400 border-4 border-green-600 scale-110" : ""}`}
            >
              <AvatarImage
                src={
                  participant.user.profileImageUrl
                    ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participant.user.profileImageUrl}`
                    : "/user.png?height=40&width=40"
                }
                alt={participant.user.name}
              />
              <AvatarFallback className="text-lg">{participant.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          {!participant.audio && (
            <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1.5">
              <MicOff className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium truncate max-w-full">
            {participant.user.name.split(" ")[0]} {isCurrentUser && "(You)"}
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
    )
  }

  const VideoTile = ({
    participant,
    isExpanded = false,
    isInSidebar = false,
    isSmallView = false,
    onClick,
    isSpeaking,
    stream,
  }: {
    participant: Participants
    isExpanded?: boolean
    isInSidebar?: boolean
    isSmallView?: boolean
    onClick?: () => void
    isSpeaking?: boolean
    stream?: MediaStream | null
  }) => {
    const isCurrentUser = participant.userId === currentUser.id

    const getTileClasses = () => {
      const baseClasses =
        "relative rounded-xl overflow-hidden transition-all duration-300 bg-muted cursor-pointer border-2"
      const borderClasses = isSpeaking
        ? "border-green-400 shadow-lg shadow-green-400/25"
        : isCurrentUser
          ? "border-blue-400 shadow-lg shadow-blue-400/25"
          : "border-gray-300/50 shadow-md"
      const ringClasses = isSpeaking ? "ring-1 ring-green-400 ring-offset-1" : ""

      if (isExpanded) {
        return `${baseClasses} ${borderClasses} ${ringClasses} w-full h-full`
      } else if (isInSidebar) {
        return `${baseClasses} ${borderClasses} ${ringClasses} aspect-video w-full max-h-24 backdrop-blur-sm bg-gray-900/80`
      } else if (isSmallView) {
        return `${baseClasses} ${borderClasses} ${ringClasses} aspect-video w-40 h-24 md:w-48 md:h-28 backdrop-blur-sm bg-gray-900/90 shadow-xl`
      } else {
        return `${baseClasses} ${borderClasses} ${ringClasses} aspect-video w-full h-full min-h-[120px]`
      }
    }

    return (
      <div className={getTileClasses()} onClick={onClick}>
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
            <div className="w-full h-full flex items-center justify-center bg-muted relative">
              <div className={`relative ${isSpeaking ? "animate-pulse" : ""}`}>
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping scale-125"></div>
                    <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping scale-150 animation-delay-75"></div>
                    <div className="absolute inset-0 rounded-full bg-green-400/10 animate-ping scale-175 animation-delay-150"></div>
                  </>
                )}
                <Avatar
                  className={`transition-all duration-300 ${
                    isExpanded
                      ? `h-24 w-24 ${isSpeaking ? "scale-110" : ""}`
                      : isInSidebar
                        ? `h-8 w-8 ${isSpeaking ? "scale-110" : ""}`
                        : isSmallView
                          ? `h-12 w-12 ${isSpeaking ? "scale-110" : ""}`
                          : `h-16 w-16 ${isSpeaking ? "scale-110" : ""}`
                  } ${isSpeaking ? "ring-2 ring-green-400" : ""}`}
                >
                  <AvatarImage
                    src={
                      participant.user.profileImageUrl
                        ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participant.user.profileImageUrl}`
                        : "/user.png?height=40&width=40"
                    }
                    alt={participant.user.name}
                  />
                  <AvatarFallback className={isInSidebar ? "text-xs" : isSmallView ? "text-sm" : "text-lg"}>
                    {participant.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          )}

          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <span className="bg-black/80 text-white px-2 py-1 rounded-md text-sm truncate max-w-[70%] backdrop-blur-sm">
              {participant.user.name.split(" ")[0]} {isCurrentUser && "(You)"}
            </span>
            <div className="flex gap-1.5">
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
              {!isInSidebar && !isSmallView && (
                <div className="bg-black/60 rounded-full p-1">
                  {isExpanded ? (
                    <Minimize2 className="h-3 w-3 text-white" />
                  ) : (
                    <Maximize2 className="h-3 w-3 text-white" />
                  )}
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
      </div>
    )
  }

  if (video && isOneOnOne) {
    const { main, small } = getOneOnOneParticipants()

    return (
      <>
        <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative justify-center items-center">
          <div className="flex-1 p-3 max-w-screenu-lg min-w-[512px] md:min-w-[700px]  lg:min-w-[1024px] ">
            {main && (
              <VideoTile
                participant={main}
                isExpanded={true}
                onClick={() => handleTileClick(main.userId)}
                stream={main.userId === currentUser.id ? localStream : remoteStreams[main.userId]}
              />
            )}
          </div>

          <div
            ref={dragRef}
            className={`absolute z-20 ${
              !isDragging
                ? currentUserPosition === "top-left"
                  ? "top-6 left-4 md:left-10"
                  : currentUserPosition === "top-right"
                    ? "top-6 right-4 md:right-10"
                    : currentUserPosition === "bottom-left"
                      ? "bottom-6 left-4 md:left-10"
                      : "bottom-6 right-4 md:right-10"
                : ""
            }`}
            style={isDragging ? { position: "absolute" } : {}}
          >
            <div className="relative group">
              {small && (
                <VideoTile
                  participant={small}
                  isSmallView={true}
                  onClick={() => handleTileClick(small.userId)}
                  stream={small.userId === currentUser.id ? localStream : remoteStreams[small.userId]}
                />
              )}

              <div className="absolute -top-6 z-50 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/80 rounded-md p-1.5 flex gap-2 items-center">
                  {/* WIP: Add the drag functionality */}
                  {/* <div className="cursor-move p-1 hover:bg-white/20 rounded" onMouseDown={handleMouseDown}>
                    <Move className="h-3 w-3 text-white" />
                  </div> */}
                  <div className="flex gap-1">
                    {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((position) => (
                      <button
                        key={position}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentUserPosition(position)
                        }}
                        className={`w-3 h-3 rounded-sm border border-white/30 ${
                          currentUserPosition === position ? "bg-blue-500" : "bg-white/20"
                        }`}
                        title={position.replace("-", " ")}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const expandedParticipantData = expandedParticipant
    ? participants.find((p) => p.userId === expandedParticipant)
    : null

  const sidebarParticipants = expandedParticipant
    ? currentPageParticipants.filter((p) => p.userId !== expandedParticipant)
    : []

  return (
    <>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 flex min-h-0">
          <div
            className={`flex-1 flex items-center justify-center p-3 min-h-0 relative ${
              expandedParticipant ? "pr-2" : ""
            }`}
          >
            {expandedParticipantData ? (
              <div className="w-full h-full max-w-5xl">
                <VideoTile
                  participant={expandedParticipantData}
                  isExpanded={true}
                  onClick={() => setExpandedParticipant(null)}
                  isSpeaking={activeSpeaker === expandedParticipantData.userId && expandedParticipantData.audio}
                  stream={
                    expandedParticipantData.userId === currentUser.id
                      ? localStream
                      : remoteStreams[expandedParticipantData.userId]
                  }
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {!video ? (
                  <div className="flex flex-wrap gap-4 justify-center items-center max-w-5xl">
                    {currentPageParticipants.map((participant) => (
                      <AudioTile
                        key={participant.userId}
                        participant={participant}
                        isSpeaking={activeSpeaker === participant.userId && participant.audio}
                        stream={participant.userId === currentUser.id ? localStream : remoteStreams[participant.userId]}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full max-w-6xl">
                    <div
                      className="grid gap-2 sm:gap-3 w-full h-full place-items-center"
                      style={{
                        gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${Math.min(gridConfig.rows, Math.ceil(currentPageParticipants.length / gridConfig.cols))}, minmax(0, 1fr))`,
                      }}
                    >
                      {currentPageParticipants.map((participant) => (
                        <VideoTile
                          key={participant.userId}
                          participant={participant}
                          onClick={() => handleTileClick(participant.userId)}
                          isSpeaking={activeSpeaker === participant.userId && participant.audio}
                          stream={
                            participant.userId === currentUser.id ? localStream : remoteStreams[participant.userId]
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {video &&
              currentUserParticipant &&
              !isOneOnOne &&
              expandedParticipant !== currentUserParticipant.userId && (
                <div
                  className={`absolute z-20 ${
                    currentUserPosition === "top-left"
                      ? "top-6 left-4"
                      : currentUserPosition === "top-right"
                        ? "top-6 right-4"
                        : currentUserPosition === "bottom-left"
                          ? "bottom-4 left-4"
                          : "bottom-4 right-4"
                  }`}
                >
                  <div className="relative group">
                    <VideoTile
                      participant={currentUserParticipant}
                      isSmallView={true}
                      onClick={() => setExpandedParticipant(currentUserParticipant.userId)}
                      stream={localStream}
                    />

                    <div className="absolute -top-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/80 rounded-md p-1.5 flex gap-1">
                        {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((position) => (
                          <button
                            key={position}
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentUserPosition(position)
                            }}
                            className={`w-3 h-3 rounded-sm border border-white/30 ${
                              currentUserPosition === position ? "bg-blue-500" : "bg-white/20"
                            }`}
                            title={position.replace("-", " ")}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {expandedParticipant && sidebarParticipants.length > 0 && (
            <div className="w-32 sm:w-44 p-3 border-l bg-muted/20 flex flex-col gap-3 overflow-y-auto">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Others</h3>
              {sidebarParticipants.map((participant) => (
                <VideoTile
                  key={participant.userId}
                  participant={participant}
                  isInSidebar={true}
                  onClick={() => setExpandedParticipant(participant.userId)}
                  isSpeaking={activeSpeaker === participant.userId && participant.audio}
                  stream={participant.userId === currentUser.id ? localStream : remoteStreams[participant.userId]}
                />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && !expandedParticipant && (
          <div className="flex items-center justify-center gap-3 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentPage ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!video && !expandedParticipant && (
          <div className="text-center py-3">
            <p className="text-sm text-muted-foreground">
              {participants.filter((p) => p.audio).length}/{participants.length} unmuted
            </p>
          </div>
        )}
      </div>
    </>
  )
}
