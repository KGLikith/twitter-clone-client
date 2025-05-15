"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import CreateConversationModal from "./create-conversation-modal"
import type { Conversation } from "@/gql/graphql"
import { ConversationSkeleton } from "@/components/global/Skeleton/ConversationSkel"
import { EmptyState } from "@/components/global/Skeleton/empty-state"
import { useSession } from "next-auth/react"

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  isClosed?: boolean
  isLoading?: boolean
  fetchNextPage?: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
}

export default function ConversationList({
  isClosed,
  conversations,
  selectedConversationId,
  isLoading = false,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: ConversationListProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const currentUserId = session?.user?.id
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hasNextPage || !fetchNextPage) return
    const handleScroll = () => {
      if (!scrollRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        fetchNextPage()
      }
    }
    const ref = scrollRef.current
    ref?.addEventListener("scroll", handleScroll)
    return () => ref?.removeEventListener("scroll", handleScroll)
  }, [hasNextPage, fetchNextPage])

  const getDisplayName = (conversation: Conversation) => {
    const otherParticipants = conversation.participants.filter(p => p.id !== currentUserId)
    if (!conversation.admin) {
      return otherParticipants[0]?.name || "Unknown"
    }
    return conversation.name || otherParticipants.map(p => p.name).join(", ")
  }

  const getDisplayAvatars = (conversation: Conversation) => {
    const others = conversation.participants.filter(p => p.id !== currentUserId)
    if (!conversation.admin) {
      return (
        <Avatar className="w-10 h-10">
          <AvatarImage  src={others[0]?.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${others[0].profileImageUrl}` : "/user.png"} alt={others[0]?.name} />
          <AvatarFallback>{others[0]?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )
    }
    return (
      <div className="relative h-10 w-10">
        {others.slice(0, 2).map((p, i) => (
          <Avatar
            key={p.id}
            className={`absolute ${i === 0 ? "top-0 left-0" : "bottom-0 right-0"} h-7 w-7 border border-black`}
          >
            <AvatarImage className="object-cover" src={p.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${p.profileImageUrl}` : "/user.png"} alt={p.name} />
            <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    )
  }

  const filteredConversations = conversations.filter((conversation) => {
    const others = conversation.participants.filter(p => p.id !== currentUserId)
    const name = conversation.name?.toLowerCase() || ""
    const participantNames = others.map(p => p.name.toLowerCase()).join(" ")
    const query = searchQuery.toLowerCase()
    return name.includes(query) || participantNames.includes(query)
  })

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/messages/${conversationId}`)
  }

  if (isLoading) {
    return <ConversationSkeleton isClosed={isClosed} />
  }

  if (isClosed) {
    return (
      <div className="flex flex-col h-full items-center py-4 w-full custom-scrollbar">
        <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-white mb-2">
          <PlusCircle className="h-8 w-8" />
        </Button>

        <div className="overflow-y-auto flex-1 w-full pt-5 h-full" ref={scrollRef}>
          {filteredConversations.length === 0 ? (
            <div className="p-2 text-center text-gray-500 text-xs">No conversations</div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {filteredConversations.map((conversation) => (
                <div key={conversation.id} onClick={() => handleSelectConversation(conversation.id)} className={cn("cursor-pointer transition-all hover:scale-110 relative")}>
                  <div className={selectedConversationId === conversation.id ? "ring-2 ring-orange-500 rounded-full" : ""}>
                    {getDisplayAvatars(conversation)}
                  </div>
                  {conversation.numberOfUnreadMessages > 0 && (
                    <div className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-orange-500 rounded-full text-xs text-white font-medium">
                      {conversation.numberOfUnreadMessages}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <CreateConversationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-white">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search conversations"
            className="pl-9 bg-gray-900/50 border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1" ref={scrollRef}>
        {filteredConversations.length === 0 ? (
          <EmptyState type="conversations" />
        ) : (
          filteredConversations.map((conversation) => {
            const displayName = getDisplayName(conversation)
            const lastMessage = conversation.lastMessage
            const timeAgo = formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })

            return (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={cn("p-4 border-b border-gray-800 hover:bg-gray-800/30 cursor-pointer transition-colors", selectedConversationId === conversation.id && "bg-gray-800/50")}
              >
                <div className="flex items-start gap-3">
                  {getDisplayAvatars(conversation)}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="font-medium truncate">{displayName}</div>
                      <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{timeAgo}</div>
                    </div>

                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-400 truncate flex-1">{lastMessage}</p>
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
          })
        )}
      </div>

      <CreateConversationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
