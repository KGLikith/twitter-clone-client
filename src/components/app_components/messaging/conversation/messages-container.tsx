"use client"

import type { Conversation, Message, User } from "@/gql/graphql"
import { useEffect, useMemo, useRef, useState } from "react"
import { format, isToday, isYesterday } from "date-fns"
import { cn } from "@/lib/utils"
import { MessageSkeleton } from "@/components/global/Skeleton/MessagingSkel"
import { EmptyState } from "@/components/global/Skeleton/empty-state"
import { ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useMessageSubscription, useSeenConversationSubscription, useTypingSubscription } from "@/hooks/subscriptions"
import Link from "next/link"
import MessageContent from "./helper/message-content"
import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@apollo/client"
import { markConversationAsReadMutation } from "@/graphql/mutation/user"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AnimatedSeenText from "./helper/animated-seen-text"

type Props = {
  messages: Message[]
  isLoading: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  conversation: Conversation
  currentUserId: string
  participants: User[]
}

export default function MessagesContainer({
  messages,
  participants,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  conversation,
  currentUserId,
}: Props) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [initialScrollDone, setInitialScrollDone] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [localMessages, setLocalMessages] = useState<Message[]>(messages)
  const [seenUsers, setSeenUsers] = useState<string[]>(conversation.readBy)
  const queryClient = useQueryClient()
  const [markConversationAsRead] = useMutation(markConversationAsReadMutation)

  const { data: TypingData } = useTypingSubscription(conversation.id)
  const isTyping = TypingData?.userTyping.typing
  const typingUser = isTyping ? participants.find((user) => user.id === TypingData?.userTyping?.userId) : null

  const { data: MessageData } = useMessageSubscription(conversation.id)

  const { data: seenData } = useSeenConversationSubscription(conversation.id)

  useEffect(() => {
    if (seenData?.seenMessage) {
      if (seenData.seenMessage.readAt < localMessages[localMessages.length - 1].createdAt) return
      setSeenUsers((prevSeenUsers) => {
        const newSeenUser = seenData.seenMessage.userId
        if (!prevSeenUsers.includes(newSeenUser)) {
          return [...prevSeenUsers, newSeenUser]
        }
        return prevSeenUsers
      })
    }
  }, [seenData?.seenMessage])

  useEffect(() => {
    if (conversation.readBy.length > 0) {
      setSeenUsers(conversation.readBy)
    }
  }, [conversation.readBy])

  async function markConvoRead() {
    await markConversationAsRead({
      variables: {
        conversationId: conversation.id,
      },
    })
      .then((data) => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] })
      })
      .catch((error) => {
        console.error("Error marking conversation as read:", error)
      })
  }

  async function invalidateQueryCache() {
    queryClient.invalidateQueries({ queryKey: ["messages", conversation.id] })
    queryClient.invalidateQueries({ queryKey: ["conversations"] })
  }

  useEffect(() => {
    if (MessageData?.messageSent) {
      setSeenUsers([])
      markConvoRead()
    }
  }, [MessageData])

  useEffect(() => {
    markConvoRead()
  }, [])

  useEffect(() => {
    if (MessageData?.messageSent) {
      setLocalMessages((prevMessages) => {
        const newMessage = MessageData.messageSent
        const existingIndex = prevMessages.findIndex((m) => m.id === newMessage.id)

        if (existingIndex === -1) {
          return [...prevMessages, newMessage as Message]
        } else {
          const updated = [...prevMessages]
          updated[existingIndex] = newMessage as Message
          return updated
        }
      })
      invalidateQueryCache()
    }
  }, [MessageData])

  useEffect(() => {
    if (messages.length > localMessages.length) {
      setLocalMessages(messages)
    }
  }, [messages])

  useEffect(() => {
    if (!initialScrollDone && localMessages.length > 0) {
      const container = messagesContainerRef.current
      if (container) {
        container.scrollTop = 0
        setInitialScrollDone(true)
      }
    }
  }, [localMessages, initialScrollDone])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container && localMessages.length > 0 && !isLoading && !initialScrollDone) {
      container.scrollTop = container.scrollHeight
      setInitialScrollDone(true)

      setTimeout(checkScrollPosition, 100)
    }
  }, [isLoading, localMessages.length, initialScrollDone, conversation.id])

  useEffect(() => {
    const target = loadMoreRef.current
    const container = messagesContainerRef.current
    if (!target || !container || !hasNextPage || isFetchingNextPage) return
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: container,
        threshold: 0.1,
      },
    )
    observer.observe(target)
    return () => {
      if (target) observer.unobserve(target)
    }
  }, [hasNextPage, isFetchingNextPage])

  useEffect(() => {
    setInitialScrollDone(false)
  }, [conversation.id])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => checkScrollPosition()

    container.addEventListener("scroll", handleScroll)

    setTimeout(() => {
      checkScrollPosition()
    }, 50)

    return () => container.removeEventListener("scroll", handleScroll)
  }, [localMessages.length])

  const checkScrollPosition = () => {
    const container = messagesContainerRef.current
    if (!container) return

    const scrollThreshold = -300
    setShowScrollButton(container.scrollTop < scrollThreshold)
  }

  const scrollToBottom = () => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" })

      setTimeout(() => setShowScrollButton(false), 500)
    }
  }

  const isLastMessageFromUser = (index: number) => {
    if (index === localMessages.length - 1) return true
    return false
  }

  const messagesByDate = localMessages.reduce(
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

  const sortedDateGroups = Object.entries(messagesByDate).sort(
    ([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime(),
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

  const getReadByText = useMemo(
    () => (readBy: string[], currentUserId: string, currentUserSender: boolean) => {
      if (!readBy || readBy.length === 0) return null

      if (participants.length === 2) {
        if (!currentUserSender) return
        if (readBy.length === 2) return "Seen"
      }

      const totalParticipants = participants.length
      if (readBy.length === participants.length) return "Seen by everyone"

      const otherReaders = participants.filter(
        (user) =>
          readBy.includes(user.id) &&
          user.id !== currentUserId &&
          user.id !== localMessages[localMessages.length - 1].sender.id,
      )

      if (currentUserId === conversation.lastMessageSenderId) {
        if (otherReaders.length === totalParticipants - 1) {
          return `Seen by everyone`
        }
      } else if (otherReaders.length >= totalParticipants - 2) {
        return "Seen by everyone"
      }

      if (!currentUserSender) {
        if (otherReaders.length === 0) {
          return "Seen by you"
        }
        if (otherReaders.length === 1) {
          return `Seen by you and ${otherReaders[0].name}`
        }
        if (otherReaders.length === 2) {
          return `Seen by you, ${otherReaders[0].name} and ${otherReaders[1].name}`
        } else {
          return `Seen by you, ${otherReaders[0].name} and ${otherReaders.length - 1} others`
        }
      }

      if (otherReaders.length === 1) {
        return `Seen by ${otherReaders[0].name}`
      } else if (otherReaders.length === 2) {
        return `Seen by ${otherReaders[0].name} and ${otherReaders[1].name}`
      } else if (otherReaders.length > 2) {
        return `Seen by ${otherReaders[0].name} and ${otherReaders.length - 1} others`
      }
    },
    [seenUsers.length],
  )

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 flex flex-col-reverse custom-scrollbar mt-auto"
    >
      {isTyping && typingUser?.id !== currentUserId && (
        <div key={typingUser?.id} className="flex mb-4 ml-2">
          <Avatar className="mr-2 h-8 w-8 flex-shrink-0 self-end ring-2 ring-[#f35217]/50 animate-pulse">
            <AvatarImage
              src={
                typingUser?.profileImageUrl
                  ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${typingUser.profileImageUrl}`
                  : "/user.png"
              }
              className="object-cover"
            />
            <AvatarFallback>{typingUser?.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="max-w-[75%]">
            <div className="text-xs text-muted-foreground mb-1 ml-1 font-medium">{typingUser?.name || "Someone"}</div>
            <div className="bg-white/10 backdrop-blur-md shadow-md border border-white/10 rounded-2xl px-4 py-2.5 text-white relative overflow-hidden group">
              <div className="flex items-center justify-center">
                <div className="flex space-x-1 items-center">
                  <div className="typing-dot" style={{ animationDelay: "0ms" }}></div>
                  <div className="typing-dot" style={{ animationDelay: "300ms" }}></div>
                  <div className="typing-dot" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent typing-shine"></div>
            </div>
          </div>
        </div>
      )}
      {isLoading ? (
        <MessageSkeleton />
      ) : localMessages.length === 0 && (!typingUser || typingUser?.id == currentUserId) ? (
        <EmptyState type="messages" />
      ) : (
        <>
          {sortedDateGroups.map(([dateStr, messagesForDate], groupIndex) => (
            <div key={dateStr} className="mb-6">
              <div className="sticky top-0 z-10 flex justify-center mb-4">
                <div className="bg-secondary/80 backdrop-blur-sm text-secondary-foreground text-xs px-3 py-1 rounded-full">
                  {formatDateHeader(dateStr)}
                </div>
              </div>

              {messagesForDate.map(({ message, index }, messageIndex) => {
                const isCurrentUser = message.sender.id === currentUserId
                const showName = index === 0 || localMessages[index - 1]?.sender.id !== message.sender.id
                const showAvatar = localMessages[index + 1]?.sender.id !== message.sender.id
                const isLastFromUser = isLastMessageFromUser(index)
                const readByText = getReadByText(seenUsers, currentUserId, isCurrentUser)

                return (
                  <div
                    key={message.id}
                    ref={index === 0 ? loadMoreRef : null}
                    className={cn("flex mb-1", isCurrentUser ? "justify-end" : "justify-start", showAvatar && "mb-1")}
                  >
                    {!isCurrentUser && showAvatar && (
                      <Link
                        href={`/user/${message.sender.id}`}
                        className={cn(" mr-2 h-8 w-8 flex-shrink-0 self-end", isLastFromUser ? "mb-6" : "mb-3")}
                      >
                        <Avatar className=" cursor-pointer h-8 w-8">
                          <AvatarImage
                            className="object-cover"
                            src={
                              message.sender.profileImageUrl
                                ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${message.sender.profileImageUrl}`
                                : "/user.png"
                            }
                            alt={message.sender?.name}
                          />
                          <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Link>
                    )}

                    <div className={cn("max-w-[75%] flex flex-col", !isCurrentUser && !showAvatar && "ml-10")}>
                      {!isCurrentUser && showName && (
                        <div className="text-xs text-muted-foreground mb-1 ml-1 font-medium">{message.sender.name}</div>
                      )}

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-2 w-fit backdrop-blur-md shadow-md border transition-shadow duration-300 ease-in-out cursor-pointer hover:bg-gradient-to-br before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white/5 before:rounded-2xl break-words",
                                isCurrentUser
                                  ? "bg-[#f35217]/80 text-white border-[#ff7f50]/50 hover:shadow-[0_0_15px_rgba(255,127,80,0.45)] from-[#f35217] via-[#ce6204] to-[#f35217] self-end"
                                  : "bg-white/10 text-white border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1) self-start",
                              )}
                            >
                              <MessageContent content={message.content} isDeleted={message.deletedBy ? true : false} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-900 text-white border-gray-800 text-xs">
                            {format(new Date(message.createdAt), "MMMM d, yyyy h:mm a")}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {isLastFromUser && readByText && (
                        <div
                          className={cn(
                            "text-xs text-muted-foreground mt-1 flex flex-wrap",
                            isCurrentUser ? "justify-end" : "justify-start",
                            "max-w-full",
                          )}
                        >
                          <div className="ml-1 flex items-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-pointer text-[#ff6b35] flex items-center mx-1 break-words">
                                    <AnimatedSeenText text={readByText} className="text-xs" />
                                  </span>
                                </TooltipTrigger>
                                {participants.length > 2 && (
                                  <TooltipContent side="top" className="bg-gray-900 text-white border-gray-800 text-xs">
                                    {seenUsers.length === participants.length
                                      ? "Seen by all"
                                      : participants
                                          .filter((user) => seenUsers.includes(user.id) && user.id !== currentUserId)
                                          .map((user) => user.name)
                                          .join(", ")}
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </>
      )}

      {localMessages.length != 0 && showScrollButton && (
        <Button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 bg-orange-800 hover:bg-orange-700 shadow-md transition transform hover:scale-105 text-white"
          size="icon"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
