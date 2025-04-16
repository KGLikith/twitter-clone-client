"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getNotificationIcon } from "./helper"
import { useRouter } from "next/navigation"
import type { Comment, Notification, Tweet, User } from "@/gql/graphql"
import { Button } from "@/components/ui/button"
import { FollowUser } from "@/actions/follow_unfollow"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { apolloClient } from "@/clients/api"
import { updateNotificatonMutation } from "@/graphql/mutation/user"

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
    const calculateDestination = () => {
      switch (notification.type) {
        case "FOLLOW":
          return `/user/${notification?.notifiedUserId}?followers=true`
        case "LIKE":
          return `/posts/${notification.tweetId}?likes=true`
        case "COMMENT":
          return `/posts/${notification.tweetId}?commentId=${notification.commentId}`
        case "LIKE_COMMENT":
          return `/posts/${notification.tweetId}?commentId=${notification.commentId}&commentLikes=true`
        default:
          return "/"
      }
    }
    setDestination(calculateDestination())
  }, [notification])

  const handleNavigate = (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    router.push(path)
  }

  const handleNotificationClick = async () => {
    if (notification && destination) {
      await apolloClient.mutate({
        mutation: updateNotificatonMutation,
        variables: { id: notification.id as string }
      })
      router.push(destination)
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["notifications"] })
    }
  }

  const getNotificationMessage = () => {
    if (!notification.user || notification.user.length === 0) return ""

    const userCount = notification.user.length
    const firstName = notification.user[0]?.name || "Someone"
    const userId = notification.user[0]?.id

    const userLink = (name: string, id: string) => (
      <span
        className="font-semibold text-black dark:text-white hover:underline cursor-pointer"
        onClick={(e) => handleNavigate(e, `/user/${id}`)}
      >
        {name}
      </span>
    )

    switch (notification.type) {
      case "FOLLOW":
        if (userCount === 1) {
          return (
            <span className="text-zinc-700 dark:text-zinc-300">{userLink(firstName, userId || "")} started following you</span>
          )
        } else {
          return (
            <span className="text-zinc-700 dark:text-zinc-300">
              {userLink(firstName, userId || "")} and {userCount - 1} others started following you
            </span>
          )
        }
      case "LIKE":
        if (userCount === 1) {
          return (
            <span className="text-zinc-700 dark:text-zinc-300">
              {userLink(firstName, userId || "")} liked your Tweet
            </span>
          )
        } else {
          return (
            <span className="text-zinc-700 dark:text-zinc-300">
              {userLink(firstName, userId || "")} and{" "}
              <span
                className="font-semibold text-black dark:text-white hover:underline cursor-pointer"
              >
                {userCount - 1} others
              </span>{" "}
              liked your Tweet
            </span>
          )
        }
      case "COMMENT":
        if (userCount === 1) {
          return (
            <span className="text-zinc-700 dark:text-zinc-300">
              {userLink(firstName, userId || "")} replied to your post
            </span>
          )
        } else {
          return (
            <span className="text-zinc-700 dark:text-zinc-300">
              {userLink(firstName, userId || "")} and{" "}
              <span
                className="font-semibold text-black dark:text-white hover:underline cursor-pointer"
              >
                {userCount - 1} others
              </span>{" "}
              replied to you post
            </span>
          )
        }
      case "LIKE_COMMENT":
        if (userCount === 1) {
          return (
            <span className="text-zinc-700 dark:text-zinc-300">
              {userLink(firstName, userId || "")} liked your reply
            </span>
          )
        } else {
          return (
            <span className="text-zinc-700 dark:text-zinc-300">
              {userLink(firstName, userId || "")} and{" "}
              <span
                className="font-semibold text-black dark:text-white hover:underline cursor-pointer"
              >
                {userCount - 1} others
              </span>{" "}
              liked your reply
            </span>
          )
        }
      default:
        return ""
    }
  }

  const renderUserAvatars = () => {
    if (!notification.user || notification.user.length === 0) return null

    if (["LIKE", "LIKE_COMMENT", "COMMENT", "FOLLOW"].includes(notification.type)) {
      const displayUsers = notification.user.slice(0, 5)
      return (
        <div className="flex -space-x-3 mb-3">
          {displayUsers.map((user, index) => (
            <Avatar
              key={user?.id || index}
              className="h-8 w-8 border-2 border-white dark:border-black hover:scale-110 transition-transform cursor-pointer"
              onClick={(e) => user?.id && handleNavigate(e, `/user/${user.id}`)}
            >
              <AvatarImage src={user?.profileImageUrl?.startsWith("/") ? process.env.NEXT_PUBLIC_CDN_URL + user.profileImageUrl : user?.profileImageUrl || "/user.png"} alt={user?.name} />
              <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                {user?.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {notification.user.length > 5 && (
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-black">
              +{notification.user.length - 5}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  const renderTweetPreview = (content: string) => {
    return (
      <div className="mt-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/70">
        <p className="text-zinc-800 dark:text-zinc-200 font-normal leading-relaxed">{content}</p>
      </div>
    )
  }

  const renderCommentPreview = (comment: Comment, tweet?: Tweet) => {
    return (
      <div className="mt-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/70">
        {notification?.user?.length === 1 && <p className="text-zinc-800 dark:text-zinc-200 font-normal leading-relaxed">{comment.content}</p>}
        {tweet && (
          <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">On your post:</p>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm mt-1 italic">
              {tweet.content.substring(0, 60)}
              {tweet.content.length > 60 ? "..." : ""}
            </p>
          </div>
        )}
      </div>
    )
  }

  console.log(notification)
  const renderFollowUserCard = (user: User) => {
    if (!user) return null
    if (user.followers?.findIndex((follower) => follower?.id === notification.notifiedUserId) !== -1) return null

    return (
      <div className="mt-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/70">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => handleNavigate(e, `/user/${user.id}`)}
          >
            <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-700">
              <AvatarImage src={user?.profileImageUrl?.startsWith("/") ? process.env.NEXT_PUBLIC_CDN_URL + user.profileImageUrl : user?.profileImageUrl || "/user.png"} alt={user?.name} />

              <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">@{user.userName}</p>
            </div>
          </div>
          <Button
            size="sm"
            className="rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            onClick={async (e) => {
              e.stopPropagation()
              await FollowUser(user.id, setLoadingButton, queryclient)
              await apolloClient.mutate({
                mutation: updateNotificatonMutation,
                variables: { id: notification.id }
              })
              await queryclient.invalidateQueries({ queryKey: ["notifications"] })
            }}
          >
            {loadingButton ? <Loader2 className="h-4 w-4 animate-spin text-center" /> : <span>Follow Back</span>}
          </Button>
        </div>
      </div>
    )
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
            renderUserAvatars()}

          <div className="font-medium mb-2">{getNotificationMessage()}</div>

          {notification.type === "FOLLOW" &&
            notification.user &&
            notification.user.length === 1 &&
            notification.user[0] &&
            renderFollowUserCard(notification.user[0])}

          {notification.type === "LIKE" && notification.tweet && renderTweetPreview(notification.tweet.content)}

          {notification.type === "COMMENT" &&
            notification.comment &&
            renderCommentPreview(notification.comment, notification.tweet as Tweet)}

          {notification.type === "LIKE_COMMENT" && notification.comment && renderCommentPreview(notification.comment)}
        </div>
      </div>
    </div>
  )
}
