"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CreateConversationModal from "./create-conversation-modal"
import type { Conversation } from "@/gql/graphql"
import { ConversationSkeleton } from "@/components/global/Skeleton/ConversationSkel"
import { EmptyState } from "@/components/global/Skeleton/empty-state"
import { useSession } from "next-auth/react"
import ConversationBlock from "./conversation-block"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  isClosed?: boolean
  isLoading?: boolean
  fetchNextPage?: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  userId: string
}

export default function ConversationList({
  isClosed,
  conversations,
  selectedConversationId,
  isLoading = false,
  fetchNextPage,
  hasNextPage,
  userId: currentUserId,
  isFetchingNextPage,
}: ConversationListProps) {
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

  const filteredConversations = conversations.filter((conversation) => {
    const others = conversation.participants.filter(p => p.id !== currentUserId)
    const name = conversation.name?.toLowerCase() || ""
    const participantNames = others.map(p => p.name.toLowerCase()).join(" ")
    const query = searchQuery.toLowerCase()
    return name.includes(query) || participantNames.includes(query)
  })
  if (isLoading) {
    return <ConversationSkeleton isClosed={isClosed} />
  }

  return (
    <div className="flex flex-col h-full w-full no-scrollbar">
      {!isClosed && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsModalOpen(true)}
              className="text-gray-400 hover:text-white"
            >
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
      )}

      {isClosed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsModalOpen(true)}
          className="text-gray-400 hover:text-white my-2 py-1 px-2 w-fit self-center flex items-center justify-center"
        >
          <PlusCircle className="h-8 w-8" />
        </Button>
      )}

      <div className={cn("overflow-y-auto flex-1 w-full", isClosed && "w-full pt-5 h-full")} ref={scrollRef}>
        {filteredConversations.length === 0 ? (
          isClosed ? (
            <div className="p-2 text-center text-gray-500 text-xs">No conversations</div>
          ) : (
            <EmptyState type="conversations" />
          )
        ) : (
          <div className={cn(isClosed && "flex flex-col items-center justify-center gap-4 w-full")}>
            {filteredConversations.map((conversation) =>
              <ConversationBlock
                currentUserId={currentUserId}
                isClosed={isClosed || false}
                key={conversation.id}
                conversation={conversation}
                selectedConversationId={selectedConversationId}
              />
            )}
          </div>
        )}
      </div>

      {isModalOpen && <CreateConversationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
