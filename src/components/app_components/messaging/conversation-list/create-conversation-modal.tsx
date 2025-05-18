"use client"

import { useState, useEffect } from "react"
import { X, Search, UserPlus, MessageSquarePlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "use-debounce"
import { useInView } from "react-intersection-observer"
import { getConversationUsers } from "@/hooks/user"
import { motion, AnimatePresence } from "framer-motion"
import { apolloClient } from "@/clients/api"
import { createConversationMutation } from "@/graphql/mutation/user"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

interface User {
  id: string
  name: string
  userName?: string | null
  profileImageUrl?: string | null
}

interface CreateConversationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateConversationModal({ isOpen, onClose }: CreateConversationModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [conversationName, setConversationName] = useState("")
  const router = useRouter();
  const queryclient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = getConversationUsers(debouncedSearchQuery)

  const { ref, inView } = useInView({ threshold: 1 })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage])

  const users = data?.pages.flatMap((page) => page?.users ?? []) ?? []

  const filteredUsers = users.filter((user) => !selectedUsers.some((selected) => selected.id === user?.id))

  const handleSelectUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user])
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
  }

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to create a conversation.")
      return
    }
    if (!conversationName && selectedUsers.length > 1) {
      toast.error("Please enter a group name.")
      return
    }
    if (conversationName.length > 20) {
      toast.error("Group name cannot exceed 20 characters.")
      return
    }
    if (selectedUsers.length>1 && conversationName.length < 3) {
      toast.error("Group name must be at least 3 characters long.")
      return
    }
    if (selectedUsers.length > 10) {
      toast.error("You can only add up to 10 users in a group conversation.")
      return
    }
    if (selectedUsers.some((user) => user.id === "currentUserId")) {
      toast.error("You cannot add yourself to a group conversation.")
      return
    }
    try {
      const { data } = await apolloClient.mutate({
        mutation: createConversationMutation,
        variables: {
          userIds: selectedUsers.map((user) => user.id),
          name: conversationName,
        }
      })

      if (!data?.createConversation) {
        toast.error("Failed to create conversation. Please try again.")
        return
      }

      if (data.createConversation.existing) {
        toast.error("Conversation already exists.")
        router.push(`/messages/${data?.createConversation.id}`)
      }else{
        await queryclient.invalidateQueries({
          queryKey: ["conversations"]
        })
        router.push(`/messages/${data?.createConversation.id}`)
      }

      setSelectedUsers([])
      setConversationName("")
      onClose()
    } catch (err) {
      console.error("Error creating conversation:", err)
      toast.error("Error creating conversation. Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-xl shadow-xl p-5">
        <DialogHeader className="pb-4 border-b border-zinc-800">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquarePlus className="h-5 w-5 text-zinc-400" />
            New Conversation
          </DialogTitle>
        </DialogHeader>

        {selectedUsers.length > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <label className="text-sm text-zinc-400 mb-2 block">Group name </label>
            <Input
              placeholder="Enter group name"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white rounded-lg focus:ring-1 focus:ring-zinc-600"
            />
          </motion.div>
        )}

        <AnimatePresence>
          {selectedUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="text-sm text-zinc-400 mb-2">Selected participants:</div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full"
                  >
                    <Avatar className="h-4 w-4 mr-1">
                      <AvatarImage className="object-cover" src={user.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${user.profileImageUrl}` : "/user.png"} alt={user?.name} />
                      <AvatarFallback className="text-[10px] bg-zinc-700 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {user.name}
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="ml-1 hover:bg-zinc-600 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search for people"
            className="pl-9 bg-zinc-800 border-zinc-700 text-white rounded-lg focus:ring-1 focus:ring-zinc-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {filteredUsers.length === 0 && !isFetchingNextPage ? (
            <div className="text-center text-zinc-500 py-6 bg-zinc-800/50 rounded-lg">No users found</div>
          ) : (
            <>
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => handleSelectUser(user)}
                  className="flex items-center gap-3 p-3 hover:bg-zinc-800/80 rounded-lg cursor-pointer transition-all border border-transparent hover:border-zinc-700"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Avatar className="h-10 w-10 border border-zinc-700">
                    <AvatarImage className="object-cover" src={user.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${user.profileImageUrl}` : "/user.png"} />
                    <AvatarFallback className="bg-zinc-700 text-white">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-zinc-400">@{user.userName}</div>
                  </div>
                  <div className="ml-auto bg-zinc-800 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                    <UserPlus className="h-4 w-4" />
                  </div>
                </motion.div>
              ))}
              <div ref={ref} className="h-10" />
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={selectedUsers.length === 0}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold disabled:opacity-50 disabled:pointer-events-none"
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
