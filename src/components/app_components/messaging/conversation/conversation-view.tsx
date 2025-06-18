"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Info } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { CallType, type Conversation, type Message } from "@/gql/graphql"
import { ConversationInfoSkeleton } from "@/components/global/Skeleton/ConversationInfo"
import { useOnlineSubscription } from "@/hooks/subscriptions"
import { getOnlineUsersQuery } from "@/hooks/user"
import ConversationInfoDialog from "./conversation-info-dialog"
import MessageInput from "./message-input"
import MessagesContainer from "./messages-container"
import { Phone, Video } from "lucide-react"
import { toast } from "sonner"
import { startCall } from "@/actions/call"

interface ConversationViewProps {
  conversation: Conversation
  messages: Message[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  isLoading: boolean
  currentUserId: string
}

export default function ConversationView({
  messages,
  hasNextPage,
  isFetchingNextPage,
  conversation,
  fetchNextPage,
  isLoading,
  currentUserId,
}: ConversationViewProps) {
  const router = useRouter()
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const participants = conversation?.participants
  const otherUser = participants.find((p) => p.id !== currentUserId)!
  const [onlineStatusMap, setOnlineStatusMap] = useState<Record<string, boolean>>({})
  const initialOnlineUsersData = getOnlineUsersQuery(
    participants.filter((p) => p.id != currentUserId).map((p) => p.id),
    conversation.id,
  )

  const { data: onlineStatusUpdateData } = useOnlineSubscription(
    participants.filter((p) => p.id != currentUserId).map((p) => p.id),
  )

  useEffect(() => {
    const onlineStatusData = onlineStatusUpdateData?.onlineStatusUpdated
    if (onlineStatusData) {
      setOnlineStatusMap((prev) => ({
        ...prev,
        [onlineStatusData.userId]: onlineStatusData.online,
      }))
    }
  }, [onlineStatusUpdateData])

  useEffect(() => {
    if (initialOnlineUsersData.length > 0) {
      const initialOnline = initialOnlineUsersData
        .map((user) => ({ id: user.userId, online: user.online }))
        .reduce((acc: Record<string, boolean>, user: { id: string; online: boolean }) => {
          if (participants.map((p) => p.id).includes(user.id)) {
            acc[user.id] = user.online
          }
          return acc
        }, {})
      setOnlineStatusMap((prev) => ({ ...prev, ...initialOnline }))
    }
  }, [initialOnlineUsersData, participants])

  const getConversationTitle = () => {
    if (conversation.name) return conversation.name

    if (participants.length === 2) {
      return otherUser.name
    }

    return (
      participants
        .slice(0, 2)
        .filter((p) => p.id !== currentUserId)
        .map((p) => p.name)
        .join(", ") + (participants.length > 2 ? ` & ${participants.length - 2} more` : "")
    )
  }

  const handleBackToList = () => {
    router.push("/messages")
  }

  const initialAudioCall = async() =>{
    try{
      const participants = conversation.participants
        .filter((p) => p.id !== currentUserId)
        .map((p) => p.id)
      const data = await startCall(CallType.Audio, participants, conversation.id)

      if(!data?.success){
        toast.error(data?.error || "Failed to start audio call. Please try again after some time.")
        return
      }

      const callId = data.callId
      if(callId)
        router.push(`/call/${callId}`)

    }catch(err){
      console.error("Error starting audio call:", err)
      toast.error("Failed to start audio call. Please try again after some time.")
    }
  }

  const initiateVideoCall =async () => {
    try{
      const participants = conversation.participants
        .filter((p) => p.id !== currentUserId)
        .map((p) => p.id)
      const data = await startCall(CallType.Video, participants, conversation.id)

      if(!data?.success){
        toast.error(data?.error || "Failed to start video call. Please try again after some time.")
        return
      }

      const callId = data.callId
      if(callId)
        router.push(`/call/${callId}`)

    }catch(err){
      console.error("Error starting audio call:", err)
      toast.error("Failed to start audio call. Please try again after some time.")
    }
  }

  return (
    <div className="flex flex-col h-full w-full relative bg-background">
      {isLoading ? (
        <ConversationInfoSkeleton />
      ) : (
        <div className="p-4 border-b border-border flex items-center gap-3 w-full bg-card/80 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {participants.length === 2 ? (
              <div className="relative">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage
                    className="object-cover"
                    src={
                      otherUser.profileImageUrl
                        ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${otherUser.profileImageUrl}`
                        : "/user.png"
                    }
                    alt={otherUser?.name}
                  />
                  <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="relative h-10 w-10 flex-shrink-0">
                <Avatar className="absolute top-0 left-0 h-7 w-7 border border-background">
                  <AvatarImage
                    className="object-cover"
                    src={
                      participants[0].profileImageUrl
                        ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participants[0].profileImageUrl}`
                        : "/user.png"
                    }
                    alt={participants[0]?.name}
                  />
                  <AvatarFallback>{participants[0].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Avatar className="absolute bottom-0 right-0 h-7 w-7 border border-background">
                  <AvatarImage
                    className="object-cover"
                    src={
                      participants[1].profileImageUrl
                        ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participants[1].profileImageUrl}`
                        : "/user.png"
                    }
                    alt={participants[1]?.name}
                  />
                  <AvatarFallback>{participants[1]?.name.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-between items-center mb-2 mt-1">
            <div className="flex flex-col items-start justify-between">
              <h2 className="font-semibold text-foreground text-left">{getConversationTitle()}</h2>
              {participants.length > 2 ? (
                <p className="text-sm text-muted-foreground status-text flex items-center">
                  {Object.values(onlineStatusMap).filter(Boolean).length > 0 ? (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                      {`${Object.values(onlineStatusMap).filter(Boolean).length + 1} online`}
                    </>
                  ) : (
                    `${participants.length} participants`
                  )}
                </p>
              ) : (
                onlineStatusMap[otherUser?.id] && (
                  <p className="text-sm text-muted-foreground flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                    online
                  </p>
                )
              )}
            </div>
            <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  title="Audio Call"
                  onClick={initialAudioCall}
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={initiateVideoCall}
                  title="Video Call"
                >
                  <Video className="h-6 w-6" />
                </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsInfoOpen(true)}
                className="text-muted-foreground hover:text-foreground"
                title="Info"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <MessagesContainer
        messages={[...messages].reverse()}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        conversation={conversation}
        currentUserId={currentUserId}
        participants={participants}
      />

      {!isLoading && <MessageInput conversationId={conversation.id} currentUserId={currentUserId} />}

      <ConversationInfoDialog
        setIsInfoOpen={setIsInfoOpen}
        isInfoOpen={isInfoOpen}
        conversationTitle={getConversationTitle()}
        conversationCreatedAt={formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
        conversation={conversation}
        currentUserId={currentUserId}
        participants={participants}
        onlineStatusMap={onlineStatusMap}
      />
    </div>
  )
}
