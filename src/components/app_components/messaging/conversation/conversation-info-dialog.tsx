"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Conversation, User } from "@/gql/graphql"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type Props = {
  isInfoOpen: boolean
  setIsInfoOpen: (isOpen: boolean) => void
  conversation: Conversation
  conversationTitle: string
  conversationCreatedAt: string
  currentUserId: string
  participants: User[]
  onlineStatusMap: Record<string, boolean>
}

export default function ConversationInfoDialog({
  onlineStatusMap,
  isInfoOpen,
  setIsInfoOpen,
  currentUserId,
  conversation,
  conversationTitle,
  conversationCreatedAt,
  participants,
}: Props) {
  const otherUser = participants.find((p) => p.id !== currentUserId)!
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredParticipants, setFilteredParticipants] = useState<User[]>(participants)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredParticipants(participants)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = participants.filter(
      (participant) =>
        participant.name.toLowerCase().includes(query) ||
        (participant.userName && participant.userName.toLowerCase().includes(query)),
    )
    setFilteredParticipants(filtered)
  }, [searchQuery, participants])

  return (
    <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
      <DialogContent className="bg-background border-border text-foreground max-w-md w-full shadow-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{conversationTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
            <p className="text-sm mt-1">{conversation.createdAt ? conversationCreatedAt : "Unknown"}</p>
          </div>

          {!conversation.admin && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact</h3>
              <Link href={`/user/${otherUser.id}`} passHref className="mt-2">
                <div className="flex items-center gap-3 border border-border rounded-md p-3 bg-secondary/30 hover:bg-secondary transition cursor-pointer shadow-sm">
                  <div className="relative">
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
                    {onlineStatusMap[otherUser.id] && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f] shadow-sm"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{otherUser.name}</p>
                    {otherUser.userName && <p className="text-xs text-muted-foreground">@{otherUser.userName}</p>}
                  </div>
                </div>
              </Link>
            </div>
          )}

          {conversation.admin && (
            <div className="space-y-3">
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Participants ({filteredParticipants.length}/{participants.length})
                </h3>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search participants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 bg-background/80"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant) => (
                    <Link href={`/user/${participant.id}`} key={participant.id} passHref>
                      <div className="flex items-center gap-3 border border-border rounded-md p-3 bg-secondary/30 hover:bg-secondary transition cursor-pointer shadow-sm">
                        <div className="relative">
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
                          {(onlineStatusMap[participant.id] || participant.id == currentUserId) && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f] shadow-sm"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <p className="text-sm font-medium">{participant.name}</p>
                          </div>
                          {participant.userName && (
                            <p className="text-xs text-muted-foreground">@{participant.userName}</p>
                          )}
                        </div>
                        {conversation.admin?.id === participant.id && (
                          <Badge variant="outline" className="ml-auto text-xs border-[#ff6b35] text-[#ff6b35]">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No participants found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
