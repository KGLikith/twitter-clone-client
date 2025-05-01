import {
  UserPlus,
  Heart,
  MessageCircle,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Comment, Notification, Tweet, User } from "@/gql/graphql";
import React from "react";



export const calculateDestination = (notification: Notification) => {
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

export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "FOLLOW":
      return (
        <div className="group transition-colors duration-150">
          <UserPlus
            size={20}
            className="text-blue-600 dark:text-blue-400 group-hover:text-blue-400 dark:group-hover:text-blue-300"
            fill="currentColor"
          />
        </div>
      );

    case "LIKE":
      return (
        <div className="group transition-colors duration-150">
          <Heart
            size={20}
            className="text-pink-600 dark:text-pink-400 group-hover:text-pink-400 dark:group-hover:text-pink-300"
            fill="currentColor"
          />
        </div>
      );

    case "COMMENT":
      return (
        <div className="group transition-colors duration-150">
          <MessageCircle
            size={20}
            className="text-green-600 dark:text-green-400 group-hover:text-green-400 dark:group-hover:text-green-300"
            fill="currentColor"
          />
        </div>
      );

    case "LIKE_COMMENT":
      return (
        <div className="group transition-colors duration-150">
          <Heart
            size={20}
            className="text-purple-600 dark:text-purple-400 group-hover:text-purple-400 dark:group-hover:text-purple-300"
            fill="currentColor"
          />
        </div>
      );

    default:
      return (
        <div className="group transition-colors duration-150">
          <Bell
            size={20}
            className="text-gray-500 dark:text-gray-400 group-hover:text-gray-400 dark:group-hover:text-gray-300"
            fill="currentColor"
          />
        </div>
      );
  }
};

export const renderTweetPreview = (content: string) => {
  return (
    <div className="mt-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/70">
      <p className="text-zinc-800 dark:text-zinc-200 font-normal leading-relaxed">{content}</p>
    </div>
  )
}


export const renderCommentPreview = (comment: Comment ,userLength: number, tweet?: Tweet ) => {
  return (
    <div className="mt-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/70">
      {userLength === 1 && <p className="text-zinc-800 dark:text-zinc-200 font-normal leading-relaxed">{comment.content}</p>}
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

export const renderFollowUserCard = (user: User, notifiedUserId: string, loadingButton:boolean,onButtonClick: (e: React.MouseEvent<HTMLButtonElement>)=> void ,handleNavigate:(e: React.MouseEvent, path: string)=> void) => {
  if (!user) return null
  if (user.followers?.findIndex((follower) => follower === notifiedUserId) !== -1) return null

  return (
    <div className="mt-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/70">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => handleNavigate(e, `/user/${user.id}`)}
        >
          <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-700">
            <AvatarImage src={user.profileImageUrl?`${process.env.NEXT_PUBLIC_CDN_URL || ""}${user.profileImageUrl}` : "/user.png"} alt={user?.name} />
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
          onClick={onButtonClick}
        >
          {loadingButton ? <Loader2 className="h-4 w-4 animate-spin text-center" /> : <span>Follow Back</span>}
        </Button>
      </div>
    </div>
  )
}


export const getNotificationMessage = (notification: Notification,handleNavigate:(e: React.MouseEvent, path: string)=> void) => {
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

export const renderUserAvatars = (user: User[],type: string,handleNavigate:(e: React.MouseEvent, path: string)=> void) => {
  if (!user || user.length === 0) return null
  if (["LIKE", "LIKE_COMMENT", "COMMENT", "FOLLOW"].includes(type)) {
    const displayUsers = user.slice(0, 5)

    return (
      <div className="flex -space-x-3 mb-3">
        {displayUsers.map((user, index) => {
          return (
            <Avatar
              key={user?.id || index}
              className="h-8 w-8 border-2 border-white dark:border-black hover:scale-110 transition-transform cursor-pointer"
              onClick={(e) => user?.id && handleNavigate(e, `/user/${user.id}`)}
            >
              <AvatarImage className="object-cover" src={user.profileImageUrl?`${process.env.NEXT_PUBLIC_CDN_URL || ""}${user.profileImageUrl}` : "/user.png"} alt={user?.name} />
              <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                {user?.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )
        })}
        {user.length > 5 && (
          <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-black">
            +{user.length - 5}
          </div>
        )}
      </div>
    )
  }

  return null
}
