"use client"

import { useParams } from "next/navigation"
import MessageView from "@/components/app_components/messaging/message-view"
import {
  useCurrentUser,
  useGetConversation,
  useGetPaginatedMessages,
} from "@/hooks/user"
import type { Conversation, Message } from "@/gql/graphql"
import { ConversationInfoSkeleton } from "@/components/global/Skeleton/ConversationInfo"
import { MessageSkeleton } from "@/components/global/Skeleton/MessagingSkel"
import { useSession } from "next-auth/react"
import { AlertTriangle } from "lucide-react"

export default function ConversationPage() {
  const { conversationId } = useParams()
  const { data: session, status } = useSession()

  const currentUserId = session?.user?.id

  const {
    data: conversationData,
    isLoading: conversationLoading,
  } = useGetConversation(conversationId as string)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: messagesLoading,
  } = useGetPaginatedMessages(conversationId as string)

  const messages = data?.pages.flatMap((page) => page.messages) || []

  if (conversationLoading || !currentUserId || status === "loading") {
    return (
      <div className="flex h-full w-full flex-col">
        <ConversationInfoSkeleton />
        <div className="flex-1 overflow-y-auto p-4 flex flex-col custom-scrollbar">
          <MessageSkeleton />
        </div>
      </div>
    )
  }

  if (!currentUserId) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center space-y-2">
          <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto" />
          <h2 className="text-lg font-semibold text-white">You must be signed in to view this conversation.</h2>
        </div>
      </div>
    )
  }

  if (!conversationData?.getConversation) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center space-y-2">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Conversation not found</h2>
          <p className="text-sm text-gray-400">The conversation you are trying to access does not exist or has been deleted.</p>
        </div>
      </div>
    )
  }

  console.log(messagesLoading)

  return (
    <div className="flex h-full w-full">
      <MessageView
        messages={messages as Message[]}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={messagesLoading}
        conversation={conversationData.getConversation as Conversation}
        currentUserId={currentUserId}
      />
    </div>
  )
}
