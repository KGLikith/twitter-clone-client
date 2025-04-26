"use client"

import { ArrowLeft, Bell, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/gql/graphql"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NotificationItem } from "./NotificationItem"

interface NotificationPageProps {
  notifications: Notification[]
  onClearNotifications?: () => Promise<void>
}

export default function NotificationPage({ notifications, onClearNotifications }: NotificationPageProps) {
  const router = useRouter()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearNotifications = async () => {
    if (!onClearNotifications) return

    setIsClearing(true)
    try {
      await onClearNotifications()
    } catch (error) {
      console.error("Failed to clear notifications:", error)
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-black dark:text-white">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 py-3 sticky top-0 bg-white dark:bg-black z-10">
        <div className="flex items-center gap-4">
          <div
            className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-2 transition-all cursor-pointer"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={18} className="text-zinc-800 dark:text-zinc-300" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl text-zinc-900 dark:text-zinc-100">Notifications</h1>
          </div>
        </div>

        {notifications.length > 0 && onClearNotifications && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearNotifications}
                  disabled={isClearing}
                  className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                >
                  <Trash2 size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </nav>

      <div className="flex-1 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full w-full gap-2 p-6">
            <Bell size={40} className="text-gray-400" />
            <h1 className="text-white font-semibold text-lg">No notifications yet</h1>
            <p className="text-gray-400 text-center max-w-xs">
              When someone interacts with your posts or follows you, you'll see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
