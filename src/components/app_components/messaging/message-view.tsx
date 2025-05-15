"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { useEffect, useRef, useState } from "react"
import { Send, ArrowLeft, Info, CheckCheck, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns"
import { useRouter } from "next/navigation"
import type { Conversation, Message } from "@/gql/graphql"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSkeleton } from "@/components/global/Skeleton/MessagingSkel"
import { EmptyState } from "@/components/global/Skeleton/empty-state"
import { ConversationInfoSkeleton } from "@/components/global/Skeleton/ConversationInfo"
import Link from "next/link"

interface MessageViewProps {
  conversation: Conversation
  messages: Message[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  isLoading: boolean
  currentUserId: string
}

export default function MessageView({
  messages,
  hasNextPage,
  isFetchingNextPage,
  conversation,
  fetchNextPage,
  isLoading,
  currentUserId,
}: MessageViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [newMessage, setNewMessage] = useState("")
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [initialScrollDone, setInitialScrollDone] = useState(false)
  const participants = conversation?.participants
  const otherUser = participants.find((p) => p.id !== currentUserId)!

  useEffect(() => {
    setInitialScrollDone(false)
  }, [conversation.id])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container && messages.length > 0 && !isLoading && !initialScrollDone) {
      container.scrollTop = container.scrollHeight
      setInitialScrollDone(true)

      setTimeout(checkScrollPosition, 100)
    }
  }, [isLoading, messages.length, initialScrollDone, conversation?.id])

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(loadMoreRef.current)

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => checkScrollPosition()

    container.addEventListener("scroll", handleScroll)

    setTimeout(() => {
      checkScrollPosition()
    }, 50)

    return () => container.removeEventListener("scroll", handleScroll)
  }, [messages.length])

  const checkScrollPosition = () => {
    const container = messagesContainerRef.current
    if (!container) return

    const tolerance = 5
    const isScrolledUp =
      container.scrollHeight - container.scrollTop - container.clientHeight > tolerance
    setShowScrollButton(isScrolledUp)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // Here you would call your API to send the message
    console.log("Sending message:", newMessage)

    // Clear input
    setNewMessage("")
  }

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

  const isLastMessageFromUser = (index: number) => {
    if (index === messages.length - 1) return true
    return false
  }

  const scrollToBottom = () => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
    }
  }
  console.log("mes", isLoading)
  const messagesByDate = messages.reduce(
    (groups, message, index) => {
      const messageDate = new Date(message.createdAt)
      const dateStr = format(messageDate, "yyyy-MM-dd")

      if (!groups[dateStr]) {
        groups[dateStr] = []
      }

      groups[dateStr].push({ message, index })
      return groups
    },
    {} as Record<string, { message: Message; index: number }[]>,
  )

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) {
      return "Today"
    } else if (isYesterday(date)) {
      return "Yesterday"
    } else {
      return format(date, "MMMM d, yyyy")
    }
  }

  isLoading = false

  return (
    <div className="flex flex-col h-full w-full relative">
      {isLoading ? (
        <ConversationInfoSkeleton />
      ) : (
        <div className="p-4 border-b border-gray-800 flex items-center gap-3 w-full">
          <div className="flex items-center gap-2 ">

            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {participants.length === 2 ? (
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage className="object-cover" src={otherUser.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${otherUser.profileImageUrl}` : "/user.png"} alt={otherUser?.name} />
                <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="relative h-10 w-10 flex-shrink-0">
                <Avatar className="absolute top-0 left-0 h-7 w-7 border border-black">
                  <AvatarImage className="object-cover" src={participants[0].profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participants[0].profileImageUrl}` : "/user.png"} alt={participants[0]?.name} />
                  <AvatarFallback>{participants[0].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Avatar className="absolute bottom-0 right-0 h-7 w-7 border border-black">
                  <AvatarImage className="object-cover" src={participants[1].profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participants[1].profileImageUrl}` : "/user.png"} alt={participants[1]?.name} />
                  <AvatarFallback>{participants[1]?.name.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-between items-center mb-2 mt-1">
            <div className="flex flex-col items-center justify-between">
              <h2 className="font-semibold">{getConversationTitle()}</h2>
              {participants.length > 2 && <p className="text-xs text-gray-400">{participants.length} participants</p>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsInfoOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col custom-scrollbar">
        {isLoading ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <EmptyState type="messages" />
        ) : (
          <>
            {hasNextPage && (
              <div ref={loadMoreRef} className="text-center py-2">
                {isFetchingNextPage ? (
                  <div className="animate-pulse text-gray-500">Loading more messages...</div>
                ) : null}
              </div>
            )}

            {Object.entries(messagesByDate).map(([dateStr, messagesForDate], groupIndex) => (
              <div key={dateStr} className="mb-6">
                <div className="sticky top-0 z-10 flex justify-center mb-4">
                  <div className="bg-gray-800/80 backdrop-blur-sm text-gray-300 text-xs px-3 py-1 rounded-full">
                    {formatDateHeader(dateStr)}
                  </div>
                </div>

                {messagesForDate.map(({ message, index }) => {
                  const isCurrentUser = message.sender.id === currentUserId
                  const showAvatar = index === 0 || messages[index - 1]?.sender.id !== message.sender.id
                  const isLastFromUser = isLastMessageFromUser(index)

                  return (
                    <div key={message.id} className={cn("flex mb-2", isCurrentUser ? "justify-end" : "justify-start")}>
                      {!isCurrentUser && showAvatar && (
                        <Avatar className="mr-2 h-8 w-8 flex-shrink-0 self-end mb-1">
                          <AvatarImage src={message.sender.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${message.sender.profileImageUrl}` : "/user.png"} alt={message.sender?.name} />
                          <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}

                      <div className={cn("max-w-[75%]", !isCurrentUser && !showAvatar && "ml-10")}>
                        {!isCurrentUser && showAvatar && (
                          <div className="text-xs text-gray-500 mb-1 ml-1">{message.sender.name}</div>
                        )}

                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 break-words",
                            isCurrentUser
                              ? "bg-orange-600 text-white rounded-br-none"
                              : "bg-gray-800 text-white rounded-bl-none",
                          )}
                        >
                          {message.deletedBy ? (
                            <span className="italic text-gray-400">This message was deleted</span>
                          ) : (
                            message.content
                          )}
                        </div>

                        <div
                          className={cn(
                            "text-xs text-gray-500 mt-1 flex items-center",
                            isCurrentUser ? "justify-end" : "justify-start",
                          )}
                        >
                          <span className="cursor-pointer" title={message.readAt ? `Read ${format(new Date(message.readAt), "MMM d, h:mm a")}` : message.read ? "Read" : ""}>{format(new Date(message.createdAt), "h:mm a")}</span>

                          {isLastFromUser && isCurrentUser && (
                            <span className="ml-1 cursor-pointer">
                              {message.read ? (
                                <span
                                  className="text-orange-400"
                                >
                                  <CheckCheck className="h-4 w-4" />
                                </span>
                              ) : (
                                <span className="text-gray-400" title="Sent">
                                  ✓
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
        {messages.length != 0 && showScrollButton && (
          <Button
            onClick={scrollToBottom}
            className="absolute bottom-24 right-8 rounded-full p-2 bg-orange-600 hover:bg-orange-700 shadow-lg z-10"
            size="icon"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="bg-gray-800/50 border-gray-700"
          />
          <Button type="submit" disabled={!newMessage.trim()} className="bg-orange-600 hover:bg-orange-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="bg-zinc-900 border-gray-800 text-white max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              {conversation.name || getConversationTitle()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Created</h3>
              <p className="text-sm mt-1 text-gray-200">
                {conversation.createdAt
                  ? formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })
                  : "Unknown"}
              </p>
            </div>

            {!conversation.admin && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Contact</h3>
                <Link href={`/user/${otherUser.id}`} passHref className="mt-2">
                  <div className="flex items-center gap-3 border border-gray-800 rounded-md p-3 bg-zinc-800/30 hover:bg-zinc-800 transition cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          otherUser.profileImageUrl
                            ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${otherUser.profileImageUrl}`
                            : "/user.png"
                        }
                        className="object-cover"

                        alt={otherUser.name}
                      />
                      <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{otherUser.name}</p>
                      {otherUser.userName && (
                        <p className="text-xs text-gray-400">@{otherUser.userName}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {conversation.admin && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400">
                  Participants ({participants.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {participants.map((participant) => (
                    <Link href={`/user/${participant.id}`} key={participant.id} passHref>
                      <div className="flex items-center gap-3 border border-gray-800 rounded-md p-3 bg-zinc-800/30 hover:bg-zinc-800 transition cursor-pointer">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              participant.profileImageUrl
                                ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participant.profileImageUrl}`
                                : "/user.png"
                            }
                            className="object-cover"

                            alt={participant.name}
                          />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{participant.name}</p>
                          {participant.userName && (
                            <p className="text-xs text-gray-400">@{participant.userName}</p>
                          )}
                        </div>
                        {conversation.admin?.id === participant.id && (
                          <Badge
                            variant="outline"
                            className="ml-auto text-xs border-orange-500 text-orange-500"
                          >
                            Admin
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
