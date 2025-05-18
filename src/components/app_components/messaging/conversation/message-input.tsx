"use client"

import { Button } from "@/components/ui/button"
import { handleUserTypingStatusMutation, sendMessageMutation } from "@/graphql/mutation/user"
import { debounce } from "@/utils/debounce"
import { useMutation } from "@apollo/client"
import { Send, Smile, ImageIcon, X } from "lucide-react"
import type React from "react"
import { useRef, useState, useEffect } from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"

type Props = {
  conversationId: string
  currentUserId: string
}

export default function MessageInput({ conversationId, currentUserId }: Props) {
  const [newMessage, setNewMessage] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [SendMessage] = useMutation(sendMessageMutation)
  const [handleUserTypingStatus] = useMutation(handleUserTypingStatusMutation)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const queryClient = useQueryClient();

  const TYPING_TIMEOUT = 500
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const isTypingRef = useRef(false)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }, [newMessage])

  useEffect(() => {
    return () => {
      setIsEmojiPickerOpen(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    }
  }, []);

  const sendTypingStatus = async (status: boolean) => {
    await handleUserTypingStatus({
      variables: {
        userId: currentUserId,
        conversationId,
        typingStatus: status,
      },
    })
  }

  const debouncedSendTypingStatus = debounce(sendTypingStatus, 200)

  const resetTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = undefined
    }

    typingTimeoutRef.current = setTimeout(() => {
      debouncedSendTypingStatus(false)
      isTypingRef.current = false
      typingTimeoutRef.current = undefined
    }, TYPING_TIMEOUT)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)

    if (!isTypingRef.current) {
      isTypingRef.current = true
      debouncedSendTypingStatus(true)

    }
    resetTypingTimeout()
  }

  const handleEmojiSelect = (emoji: any) => {
    setNewMessage((prev) => prev + emoji.native)
    setIsEmojiPickerOpen(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])

      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))

    const urlToRevoke = previewUrls[index]
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))

    setTimeout(() => {
      URL.revokeObjectURL(urlToRevoke)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() && selectedFiles.length === 0) return

    debouncedSendTypingStatus(false)
    isTypingRef.current = false
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    await SendMessage({
      variables: {
        conversationId: conversationId,
        content: newMessage,
      },
    })

    setNewMessage("")
    setSelectedFiles([])
    setPreviewUrls((prev) => {
      const oldUrls = [...prev]
      setTimeout(() => {
        oldUrls.forEach((url) => URL.revokeObjectURL(url))
      }, 0)
      return []
    })

    await queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] })
    await queryClient.invalidateQueries({ queryKey: ["messages", conversationId] })
    await queryClient.invalidateQueries({ queryKey: ["conversations"] })
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }


  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card/80 backdrop-blur-sm">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="w-16 h-16 rounded-md overflow-hidden border border-border">
                <img src={url || "/placeholder.svg"} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-1 -right-1 bg-background rounded-full p-0.5 border border-border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "resize-none min-h-[40px] max-h-[150px] rounded-lg px-4 py-2 pr-24 no-scrollbar",
              "bg-[#2a2a2a] text-white border border-[#ff7f50]/30",
              "placeholder:text-[#ff7f50]/60 focus:ring-[#ff7f50]",
            )}
            rows={1}
          />

          <div className="absolute right-2 bottom-1 flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*"
            />

            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border" align="end">
                <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" previewPosition="none" />
              </PopoverContent>
            </Popover>

            <Button
              type="submit"
              size="icon"
              disabled={!newMessage.trim() && selectedFiles.length === 0}
              className="h-8 w-8 rounded-full bg-[#ff6b35] hover:bg-[#e85d2c] text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
