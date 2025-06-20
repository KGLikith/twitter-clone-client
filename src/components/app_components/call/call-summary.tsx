"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Phone, Video, Users, PhoneOff, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import { type CallParticipants, CallType, type Call, type User, UserInfo } from "@/gql/graphql"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getConversationUser, startCall } from "@/actions/call"
import type { Participants } from "@/app/(full_page)/call/[callId]/page"
import { Badge } from "@/components/ui/badge"
import { formatDuration } from "./helper"
import RenderParticipantAvatars from "./helper/renderParticipnatAvatars"

export interface CallSummaryProps {
  call: Call
  currentUser: User
  participants: Participants[]
  declinedParticipants: string[]
  callEndedParticipants: string[]
  callType: "AUDIO" | "VIDEO"
  showCallAgainOptions?: boolean
  hostEnded: boolean
}

export default function CallSummary({
  call,
  currentUser,
  declinedParticipants,
  callEndedParticipants,
  participants,
  callType,
  hostEnded,
  showCallAgainOptions = true,
}: CallSummaryProps) {
  const router = useRouter()
  const [animationStep, setAnimationStep] = useState(0)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  const allParticipants = call.participants
  const totalParticipants = allParticipants?.length || 0
  const isGroupCall = totalParticipants > 2
  const allDeclined = declinedParticipants.length === totalParticipants - 1

  const currentUserParticipant = allParticipants.find((p) => p.userId === currentUser.id)
  const joinedParticipants = allParticipants.filter((p) => callEndedParticipants.includes(p.userId))
  const stillInCallParticipants = Object.values(participants).map((p) => p.userId)
  const allCallParticipants = [...joinedParticipants]

  allParticipants.forEach((participant) => {
    if (
      stillInCallParticipants.includes(participant.userId) &&
      !joinedParticipants.find((jp) => jp.userId === participant.userId)
    ) {
      allCallParticipants.push(participant)
    }
  })
  const hostUser = allParticipants?.find((p) => p.userId === call.callerId)?.user
  const recieverUser = allParticipants?.find((p) => p.userId !== call.callerId)?.user
  const otherUser = allParticipants?.find((p) => p.userId !== currentUser.id)?.user

  const isHost = (userId: string): boolean => {
    return call?.callerId === userId
  }

  const isCurrentUserHost = isHost(currentUser.id)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStep(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const initiateAudioCall = async () => {
    if (!currentUser || !currentUser.id || !call) return
    const participants =
      call?.participants
        ?.map((p: CallParticipants) => (p.userId !== currentUser.id ? p.userId : null))
        .filter((id): id is string => Boolean(id)) || []
    try {

      const data = await startCall(CallType.Audio, participants, call?.conversationId || "")

      if (!data?.success) {
        toast.error(data?.error || "Failed to start audio call. Please try again after some time.",{
            duration: 2000,
          })
        return
      }

      const callId = data.callId
      if (callId) router.push(`/call/${callId}`)
    } catch (err) {
      console.error("Error starting audio call:", err)
      toast.error("Failed to start audio call. Please try again after some time.",{
            duration: 2000,
          })
    }
  }

  const initiateVideoCall = async () => {
    if (!currentUser || !currentUser.id || !call) return
    try {
      const participants =
        call?.participants
          ?.map((p: CallParticipants) => (p.userId !== currentUser.id ? p.userId : null))
          .filter((id): id is string => Boolean(id)) || []

      const data = await startCall(CallType.Video, participants, call?.conversationId || "")

      if (!data?.success) {
        toast.error(data?.error || "Failed to start video call. Please try again after some time.",{
            duration: 2000,
          })
        return
      }

      const callId = data.callId
      if (callId) router.push(`/call/${callId}`)
    } catch (err) {
      console.error("Error starting video call:", err)
      toast.error("Failed to start video call. Please try again after some time.",{
            duration: 2000,
          })
    }
  }

  const navigateToUser = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  const onMessage = () => {
    router.push(`/messages/${call.conversationId}`)
  }

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getCurrentUserDuration = (): string => {
    if (isCurrentUserHost && call.callPickedAt && call.endedAt) {
      return formatDuration(call.callPickedAt, call.endedAt)
    }

    const currentUserParticipant = allParticipants.find((p) => p.userId === currentUser.id)
    if (currentUserParticipant?.joinedAt && currentUserParticipant.leftAt) {
      const endTime = currentUserParticipant.leftAt
      return formatDuration(currentUserParticipant.joinedAt, endTime)
    }

    return "0s"
  }

  const getCallStatusMessage = () => {
    if (allDeclined) {
      if (isGroupCall) {
        if (currentUser.id === call.callerId) {
          return `Everyone declined the group call`
        } else {
          return `You declined the group call and no one else joined`
        }
      } else {
        if (currentUser.id === call.callerId) {
          return `${otherUser?.name || "The other person"} declined the call`
        } else {
          return `You declined the call from ${otherUser?.name || "the caller"}`
        }
      }
    }

    if (joinedParticipants.length === 0) {
      if (isGroupCall) {
        return `No one joined the group call`
      } else {
        return `${otherUser?.name || "The other person"} didn't join the call`
      }
    }

    return null
  }

  const callStatusMessage = getCallStatusMessage()
  const userDuration = getCurrentUserDuration()

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{isGroupCall ? `Call with "${call.conversation?.name || ""}"` : `Call with "${otherUser?.name || "Unknown"}"`}</CardTitle>
          <p className="text-muted-foreground">{callType === "VIDEO" ? "Video" : "Audio"} call ended</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {callStatusMessage ? (
            <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg text-center">
              <PhoneOff className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="font-medium text-destructive">{callStatusMessage}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg">
                <div className="flex items-center justify-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className={cn("h-16 w-16 shadow-lg", isCurrentUserHost ? "ring-2 ring-primary" : "")}>
                      <AvatarImage
                        src={
                          hostUser?.profileImageUrl
                            ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${hostUser.profileImageUrl}`
                            : "/user.png"
                        }
                      />
                      <AvatarFallback className="text-lg font-semibold">
                        {hostUser?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium ">
                      {isCurrentUserHost ? (
                        <span className="font-medium text-primary">You</span>
                      ) : (
                        <>{hostUser?.name}</>
                      )}
                    </span>
                  </div>

                  <div
                    className={`transition-all duration-1000 ${animationStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                  >
                    <ArrowRight className="h-8 w-8 text-primary animate-pulse" />
                  </div>

                  <div
                    className={`flex flex-col items-center gap-2 transition-all duration-1000 delay-300 ${animationStep >= 1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                  >
                    <RenderParticipantAvatars
                      isGroupCall={isGroupCall}
                      currentUser={currentUser}
                      recieverUser={recieverUser as UserInfo}
                      callerId={call.callerId}
                      allParticipants={allParticipants}
                    />

                    <span className="text-sm font-medium text-muted-foreground">
                      {isGroupCall ? (
                        `${allParticipants.length - 1} total participants`
                      ) : recieverUser?.id === currentUser.id ? (
                        <span className="font-bold text-primary">You</span>
                      ) : (
                        recieverUser?.name
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {joinedParticipants.length > 0 && allParticipants.length > 2 && (
                <Collapsible open={isParticipantsOpen} onOpenChange={setIsParticipantsOpen}>
                  <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl border">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full p-5 h-auto justify-between hover:bg-transparent">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-foreground">
                            Call Participants ({allCallParticipants.length})
                          </span>
                        </div>
                        {isParticipantsOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-5 pb-5">
                      <ScrollArea className="h-fit max-h-64">
                        <div className=" pr-4">
                          {allCallParticipants
                            .sort((a, b) => {
                              const aStillInCall = stillInCallParticipants.includes(a.userId)
                              const bStillInCall = stillInCallParticipants.includes(b.userId)

                              if (aStillInCall && !bStillInCall) return -1
                              if (!aStillInCall && bStillInCall) return 1

                              return new Date(a.joinedAt || "").getTime() - new Date(b.joinedAt || "").getTime()
                            })
                            .map((participant, index) => {
                              const isStillInCall = stillInCallParticipants.includes(participant.userId)
                              const isHost = participant.userId === call.callerId
                              const endTime = participant.leftAt || call.endedAt

                              const isCurrentUser = participant.userId === currentUser.id

                              const initiateAudioCallWithUser = async () => {
                                if (!currentUser || !currentUser.id) return
                                try {
                                  const conversationData = await getConversationUser(participant.userId)

                                  if (conversationData?.id) {
                                    const data = await startCall(
                                      CallType.Audio,
                                      [participant.userId],
                                      conversationData?.id,
                                    )

                                    if (!data?.success) {
                                      toast.error(
                                        data?.error || "Failed to start audio call. Please try again after some time.", {
                                        duration: 2000,
                                      }
                                      )
                                      return
                                    }

                                    const callId = data.callId
                                    if (callId) router.push(`/call/${callId}`)
                                  }
                                } catch (err) {
                                  console.error("Error starting audio call:", err)
                                  toast.error("Failed to start audio call. Please try again after some time.", {
                                    duration: 2000,
                                  })
                                }
                              }

                              const initiateVideoCallWithUser = async () => {
                                if (!currentUser || !currentUser.id) return
                                try {
                                  const conversationData = await getConversationUser(participant.userId)

                                  if (conversationData?.id) {
                                    const data = await startCall(
                                      CallType.Video,
                                      [participant.userId],
                                      conversationData?.id,
                                    )

                                    if (!data?.success) {
                                      toast.error(
                                        data?.error || "Failed to start video call. Please try again after some time.", {
                                        duration: 2000,
                                      }
                                      )
                                      return
                                    }

                                    const callId = data.callId
                                    if (callId) router.push(`/call/${callId}`)
                                  }
                                } catch (err) {
                                  console.error("Error starting video call:", err)
                                  toast.error("Failed to start video call. Please try again after some time.", {
                                    duration: 2000,
                                  })
                                }
                              }

                              const messageUser = async () => {
                                const conversationData = await getConversationUser(participant.userId)

                                if (conversationData?.id) {
                                  router.push(`/messages/${conversationData?.id}`)
                                } else {
                                  toast.error("Failed to find conversation with user. Please try again later.", {
                                    duration: 2000,
                                  })
                                }
                              }

                              return (
                                <div
                                  key={participant.userId}
                                  className="flex items-center gap-4 p-3 pl-5 rounded-lg hover:bg-background/60 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-border/50"
                                >
                                  <div className="relative">
                                    <Avatar
                                      className={cn(
                                        "h-8 w-8 ring-2 ring-primary/20",
                                        isCurrentUser ? "ring-primary" : "",
                                      )}
                                    >
                                      <AvatarImage
                                        src={
                                          participant.user.profileImageUrl
                                            ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participant.user.profileImageUrl}`
                                            : "/user.png"
                                        }
                                      />
                                      <AvatarFallback className="text-sm font-medium">
                                        {participant.user.name?.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <div
                                    className="flex-1 min-w-0 cursor-pointer"
                                    onClick={() => navigateToUser(participant.userId)}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <p className="font-medium text-foreground truncate">
                                        {isCurrentUser ? <span className="font-bold">You</span> : participant.user.name}
                                      </p>
                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        {isHost && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
                                          >
                                            Host
                                          </Badge>
                                        )}
                                        {isStillInCall && (
                                          <Badge
                                            className="text-xs px-2 py-0.5  bg-green-800 text-white hover:bg-green-700 "
                                          >
                                            In call
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {!isCurrentUser && !isStillInCall && (
                                    <div className="flex items-center gap-1 ml-auto">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 hover:bg-primary/10"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          initiateAudioCallWithUser()
                                        }}
                                        title="Audio call"
                                      >
                                        <Phone className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 hover:bg-primary/10"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          initiateVideoCallWithUser()
                                        }}
                                        title="Video call"
                                      >
                                        <Video className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 hover:bg-primary/10"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          messageUser()
                                        }}
                                        title="Message"
                                      >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                          />
                                        </svg>
                                      </Button>
                                    </div>
                                  )}
                                  {!isCurrentUser && isStillInCall && (
                                    <div className="flex items-center gap-1 ml-auto">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 hover:bg-primary/10"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          messageUser()
                                        }}
                                        title="Message"
                                      >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                          />
                                        </svg>
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                        </div>
                      </ScrollArea>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )}

              <div className="text-center bg-gradient-to-br from-primary/10 to-secondary/10 p-5 rounded-xl border border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="font-semibold text-foreground">Your Call Details</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-background/50 p-3 rounded-lg">
                    <div className="text-muted-foreground mb-1">Started</div>
                    <div className="font-medium text-lg">
                      {isCurrentUserHost && call.callPickedAt
                        ? formatTime(call.callPickedAt)
                        : currentUserParticipant?.joinedAt
                          ? formatTime(currentUserParticipant?.joinedAt || "")
                          : "N/A"}
                    </div>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg">
                    <div className="text-muted-foreground mb-1">Ended</div>
                    <div className="font-medium text-lg">
                      {isCurrentUserHost && call.endedAt
                        ? formatTime(call.endedAt)
                        : currentUserParticipant?.leftAt
                          ? formatTime(currentUserParticipant?.leftAt || "")
                          : call.endedAt
                            ? formatTime(call.endedAt)
                            : "N/A"}
                    </div>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg">
                    <div className="text-muted-foreground mb-1">Call Duration</div>
                    <div className="font-semibold text-lg">{userDuration}</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {showCallAgainOptions && (
            <div className="border-t pt-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-5">
              <h3 className="font-semibold mb-5 text-center text-lg">Continue the conversation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={initiateAudioCall}
                  variant="secondary"
                  className="flex items-center gap-2 h-12 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">Audio Call</span>
                </Button>
                <Button
                  onClick={initiateVideoCall}
                  className="flex items-center gap-2 h-12 bg-primary hover:bg-primary/90 transition-all duration-200"
                >
                  <Video className="h-5 w-5" />
                  <span className="font-medium">Video Call</span>
                </Button>
                <Button
                  onClick={onMessage}
                  variant="secondary"
                  className="flex items-center gap-2 h-12 hover:bg-secondary/80 transition-all duration-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="font-medium">Message</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
