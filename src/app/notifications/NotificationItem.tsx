"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { calculateDestination, getNotificationIcon, getNotificationMessage, renderCommentPreview, renderFollowUserCard, renderTweetPreview, renderUserAvatars } from "./helper"
import { useRouter } from "next/navigation"
import type { Comment, Notification, Tweet, User } from "@/gql/graphql"
import { useQueryClient } from "@tanstack/react-query"
import { apolloClient } from "@/clients/api"
import { updateNotificatonMutation } from "@/graphql/mutation/user"
import { FollowUser } from "@/actions/follow_unfollow"

export function NotificationItem({
  notification,
}: {
  notification: Notification
}) {
  if (!notification) return null
  const router = useRouter()
  const [loadingButton, setLoadingButton] = useState(false)
  const queryclient = useQueryClient()
  const [destination, setDestination] = useState<string | null>(null)

  useEffect(() => {
    setDestination(calculateDestination(notification))
  }, [notification])

  const handleNotificationClick = async () => {
    if (notification && destination) {
      router.push(destination)
      await apolloClient.mutate({
        mutation: updateNotificatonMutation,
        variables: { id: notification.id as string }
      })
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["notifications"] })
    }
  }


  return (
    <div
      className={`border-b border-zinc-800  hover:bg-zinc-900/40 transition-colors cursor-pointer p-4 bg-zinc-900/30"}`}
      onClick={handleNotificationClick}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 text-zinc-800 dark:text-zinc-200">{getNotificationIcon(notification.type)}</div>

        <div className="flex-1">
          {(notification.type === "LIKE" || notification.type === "LIKE_COMMENT" || notification.type === "COMMENT") &&
            renderUserAvatars(notification.user as User[], notification.type)}

          <div className="font-medium mb-2">{getNotificationMessage(notification)}</div>

          {notification.type === "FOLLOW" &&
            notification.user &&
            notification.user.length === 1 &&
            notification.user[0] &&
            renderFollowUserCard(notification.user[0], notification.notifiedUserId, loadingButton, async(e) => {
              e.stopPropagation()
              console.log("hello")
              if (notification.user && notification.user[0]) {
                await FollowUser(notification.user[0].id, setLoadingButton, queryclient)
              }
              await apolloClient.mutate({
                mutation: updateNotificatonMutation,
                variables: { id: notification.id }
              })
              await queryclient.invalidateQueries({ queryKey: ["notifications"] })
            })
          }

          {notification.type === "LIKE" && notification.tweet && renderTweetPreview(notification.tweet.content)}

          {notification.type === "COMMENT" &&
            notification.comment &&
            renderCommentPreview(notification.comment, notification.user?.length || 0, notification.tweet as Tweet)}

          {notification.type === "LIKE_COMMENT" && notification.comment && renderCommentPreview(notification.comment, notification.user?.length || 0, notification.tweet as Tweet)}
        </div>
      </div>
    </div>
  )
}
