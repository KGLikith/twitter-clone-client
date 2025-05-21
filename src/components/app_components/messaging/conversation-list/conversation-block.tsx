import { Conversation } from '@/gql/graphql'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from "date-fns"
import { useMessageSubscription, useOnlineSubscription, useTypingSubscription } from '@/hooks/subscriptions'
import { getOnlineUsersQuery } from '@/hooks/user'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQueryClient } from '@tanstack/react-query'
import { Message } from '@/components/icons'

type Props = {
  conversation: Conversation
  selectedConversationId?: string
  isClosed: boolean
  currentUserId?: string
}

export default function ConversationBlock({ conversation, currentUserId, selectedConversationId, isClosed }: Props) {
  const router = useRouter();
  const timeAgo = formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })
  const [onlineStatusMap, setOnlineStatusMap] = useState<Record<string, boolean>>({})
  const initialOnlineUsersData = getOnlineUsersQuery(conversation.participants.filter((p) => p.id != currentUserId).map((p) => p.id), conversation.id)
  const queryClient = useQueryClient()

    const { data: onlineStatusUpdateData } = useOnlineSubscription(
    conversation.participants.filter((p) => p.id != currentUserId).map((p) => p.id),
  )

  const { data: MessageData } = useMessageSubscription(conversation.id)

  const { data: typingData } = useTypingSubscription(conversation.id)
  const isTyping = typingData?.userTyping?.typing && typingData?.userTyping?.userId !== currentUserId
  const typingUser = isTyping ? conversation.participants.find((user) => user.id === typingData?.userTyping?.userId) : null

  useEffect(() => {
    if (initialOnlineUsersData.length > 0) {
      const initialOnline = initialOnlineUsersData
        .map((user) => ({ id: user.userId, online: user.online }))
        .reduce((acc: Record<string, boolean>, user: { id: string; online: boolean }) => {
          if (conversation.participants.map((p) => p.id).includes(user.id)) {
            acc[user.id] = user.online
          }
          return acc
        }, {})
      setOnlineStatusMap((prev) => ({ ...prev, ...initialOnline }))
    }
  }, [initialOnlineUsersData, conversation.participants])

  useEffect(() => {
    const onlineStatusData = onlineStatusUpdateData?.onlineStatusUpdated
    if (onlineStatusData) {
      setOnlineStatusMap((prev) => ({
        ...prev,
        [onlineStatusData.userId]: onlineStatusData.online,
      }))
    }
  }, [onlineStatusUpdateData])

  async function invalidateQueryCache() {
    await queryClient.invalidateQueries({ queryKey: ["messageNotification"] })
    await queryClient.refetchQueries({ queryKey: ["messages", conversation.id] })
    await queryClient.invalidateQueries({ queryKey: ["conversations"] })
    await queryClient.invalidateQueries({ queryKey: ["conversation", conversation.id] })
  }

  useEffect(() => {
    if (MessageData?.messageSent) {
      if(MessageData.messageSent.sender.id === currentUserId) return;
      invalidateQueryCache();
    }
  }, [MessageData?.messageSent])

  const getDisplayName = () => {
    const otherParticipants = conversation.participants.filter(p => p.id !== currentUserId)
    if (!conversation.admin) {
      return otherParticipants[0]?.name || "Unknown"
    }
    return conversation.name || otherParticipants.map(p => p.name).join(", ")
  }

  const getDisplayAvatars = () => {
    const others = conversation.participants.filter(p => p.id !== currentUserId);

    if (!conversation.admin) {
      const user = others[0];
      return (
        <div className="relative w-10 h-10">
          <Avatar className={`w-10 h-10 ${(selectedConversationId === conversation.id && isClosed) ? "ring-2 ring-orange-500 rounded-full" : ""}`}>
            <AvatarImage
              className="object-cover"
              src={user?.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${user.profileImageUrl}` : "/user.png"}
              alt={user?.name}
            />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {Object.values(onlineStatusMap).some(status => status) && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f] shadow-sm"></div>
          )}
        </div>
      );
    }
    return (
      <div className="relative h-10 w-10">
        {others.slice(0, 2).map((p, i) => {
          return (
            <div key={p.id} className={`absolute ${i === 0 ? "top-0 left-0" : "bottom-0 right-0"} `}>
              <div className="relative">
                <Avatar className={`h-7 w-7 border border-black ${(selectedConversationId === conversation.id && isClosed) ? "ring-2 ring-orange-500 rounded-full" : ""}`}>
                  <AvatarImage
                    className="object-cover"
                    src={p.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${p.profileImageUrl}` : "/user.png"}
                    alt={p.name}
                  />
                  <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {Object.values(onlineStatusMap).some(status => status) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f] shadow-sm"></div>
                )}
              </ div>
            </div>
          );
        })}
      </div>
    );
  };

  return <>
    {!isClosed ?
      (
        <div
          key={conversation.id}
          onClick={() => router.push(`/messages/${conversation.id}`)}
          className={cn("p-4 border-b border-gray-800 hover:bg-gray-800/30 cursor-pointer transition-colors", selectedConversationId === conversation.id && "bg-gray-800/50")}
        >
          <div className="flex items-start gap-3">
            {getDisplayAvatars()}

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="font-medium truncate">{getDisplayName()}</div>
                <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{timeAgo}</div>
              </div>

              <div className="flex items-center mt-1">
                {isTyping ? (
                  <div className="text-sm text-zinc-500 truncate flex-1 flex items-center">
                    <span className="font-medium">{typingUser?.name}</span>
                    <span className="mx-1">is typing</span>
                    <div className="flex space-x-1 items-center ml-1 justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 truncate flex-1">
                    {conversation.lastMessageSenderId ? (conversation.lastMessageSenderId === currentUserId ? "You" : conversation.participants.find((p) => p.id === conversation?.lastMessageSenderId)?.name) + " :" : ""} {conversation.lastMessage}
                  </p>
                )}
                {conversation.numberOfUnreadMessages > 0 && (
                  <div className="ml-2 flex items-center">
                    <span className="h-5 w-5 flex items-center justify-center bg-orange-500 rounded-full text-xs text-white">
                      {conversation.numberOfUnreadMessages}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
      :
      (
        <div key={conversation.id} onClick={() => router.push(conversation.id)} className={cn("w-full cursor-pointer transition-all hover:scale-110 relative flex justify-center py-2", selectedConversationId === conversation.id && "bg-gray-800/50")}>
          <div className='w-full flex justify-center' >
            {getDisplayAvatars()}
          </div>
          {/* {isTyping && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
              <div className="flex space-x-1 items-center bg-[#f35217]/90 rounded-full px-2 py-0.5 shadow-lg">
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )} */}
          {conversation.numberOfUnreadMessages > 0 && (
            <div className="absolute top-0 right-4 flex items-center justify-center h-5 w-5 bg-orange-500 rounded-full text-xs text-white font-medium">
              {conversation.numberOfUnreadMessages}
            </div>
          )}
        </div>
      )
    }
  </>
}
