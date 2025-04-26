"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { FaArrowRight, FaUser } from "react-icons/fa6"
import { CiMenuKebab } from "react-icons/ci"
import type { Tweet, User } from "@/gql/graphql"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MdDelete } from "react-icons/md"
import { RiUserFollowFill, RiUserUnfollowFill } from "react-icons/ri"
import { FollowUser, UnFollowUser } from "@/actions/follow_unfollow"
import { dislike, like } from "@/actions/like_dislike"
import { deletePost } from "@/actions/deletePost"
import { DeleteTweetModal } from "@/components/global/deletetweetDialog"
import PostMenu from "@/components/global/postMenu"
import { formatTweetContent } from "@/components/global/postMenu/handleSelect"
import { useQueryClient } from "@tanstack/react-query"
import { formatRelativeTime } from "@/actions/helperFxns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { bookmark, unBookmark } from "@/actions/bookmarks"
import { toast } from "sonner"

interface FeedCardProps {
  tweet: Tweet
  user: User
}

const FeedCard: React.FC<FeedCardProps> = ({ tweet, user }) => {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false)

  useEffect(() => {
    setLiked(tweet?.likes?.includes((user as User)?.id))
  }, [tweet, user])

  useEffect(() => {
    setBookmarked(user?.bookmark?.bookmarks ? (user.bookmark.bookmarks?.findIndex((el) => el?.tweetId === tweet.id) !== -1) : false || false)
  }, [tweet, user])

  const handleLike = useCallback(async () => {
    if (!user) {
      toast.error("Please login to like the post", {
        duration: 2000,
      })
      return
    }
    setIsLikeAnimating(true)

    await like(user.id, tweet as Tweet, setLiked, liked, queryClient)
  }, [user, tweet, liked])

  const handledislike = useCallback(async () => {
    if (!user) {
      toast.error("Please login to like the post", {
        duration: 2000,
      })
      return
    }
    setIsLikeAnimating(true)
    await dislike(user.id, tweet as Tweet, setLiked, liked, queryClient)
  }, [user, tweet, liked])

  const handleDeletePost = useCallback(async () => {
    if (!user) {
      toast.error("Please login to like the post", {
        duration: 2000,
      })
      return
    }
    setShowDeleteDialog(true)
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deletePost(tweet as Tweet, queryClient)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Failed to delete post:", error)
    } finally {
      setDeleting(false)
    }
  }

  const handleUnfollowUser = useCallback(async () => await UnFollowUser((tweet as Tweet).user, () => { }, queryClient), [tweet])

  const handleFollowUser = useCallback(async () => await FollowUser((tweet as Tweet).user.id, () => { }, queryClient), [tweet])

  const handleAnimationEnd = () => {
    setIsLikeAnimating(false)
    setIsBookmarkAnimating(false)
  }

  const handleBookmark = useCallback(async () => {
    if (!user) {
      toast.error("Please login to like the post", {
        duration: 2000,
      })
      return
    }
    setIsBookmarkAnimating(true)
    await bookmark(tweet.id, undefined, user.id, setBookmarked, bookmarked, queryClient)
  }, [user, tweet, bookmarked])

  const handleUnBookmark = useCallback(async () => {
    if (!user) {
      toast.error("Please login to like the post", {
        duration: 2000,
      })
      return
    }
    setIsBookmarkAnimating(true)
    await unBookmark(tweet.id, undefined, user.id, setBookmarked, bookmarked, queryClient)
  }, [user, tweet, bookmarked])

  return (
    <>
      {tweet && (
        <div className="border border-gray-800 p-4 py-2 cursor-pointer hover:bg-[#0a0606] ">
          <div className="grid grid-cols-12 gap-2">
            <Link href={user ? `/user/${tweet?.user.id}` : "/not_authorised"}>
              <div className="col-span-1  ">
                <Avatar className="h-8 w-8 border-2 border-zinc-700 rounded-full overflow-hidden">
                  <AvatarImage
                    src={tweet.user?.profileImageUrl?.startsWith("/") ? process.env.NEXT_PUBLIC_CDN_URL + tweet.user.profileImageUrl : tweet.user?.profileImageUrl || "/user.png"}

                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl flex items-center justify-center">
                    {tweet.user?.userName?.slice(1)[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>
            <div className="col-span-11 space-y-2 ">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Link className="flex justify-center items-center gap-2" href={user ? `/user/${tweet.user.id}` : "/not_authorised"}>
                    <h5 className="font-bold hover:underline w-fit">
                      {tweet.user.name}
                    </h5>
                    <p className="text-sm text-gray-500">@{tweet.user.userName}</p>
                  </Link>
                  <span className="text-gray-500">·</span>
                  <div className="text-xs text-gray-500 hover:underline">{formatRelativeTime(tweet.createdAt)}</div>
                </div>
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className={`p-1 py-2 rounded-full hover:bg-gray-800  hover:text-orange-300`}>
                        <CiMenuKebab />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-36 bg-black "
                      style={{
                        boxShadow: "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px",
                      }}
                    >
                      <DropdownMenuGroup>
                        <Link href={`/posts/${tweet.id}`}>
                          <DropdownMenuItem className="flex justify-between items-center px-4 hover:bg-gray-900">
                            <FaArrowRight className="mr-2 h-3.5 w-3.5" />
                            <span>View Post</span>
                          </DropdownMenuItem>
                        </Link>

                        <Link href={`/user/${tweet.user.id}`}>
                          <DropdownMenuItem className="flex justify-between items-center px-4 hover:bg-gray-900">
                            <FaUser className="mr-2 h-3.5 w-3.5" />
                            <span>Profile</span>
                          </DropdownMenuItem>
                        </Link>
                        {user?.id === tweet.user.id ? (
                          <DropdownMenuItem
                            className="flex justify-between items-center px-4 hover:bg-gray-900"
                            onClick={handleDeletePost}
                          >
                            <MdDelete className="mr-2 h-3.5 w-3.5" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        ) : (
                          <>
                            {user?.following?.findIndex((el) => el?.id === tweet.user.id) !== -1 ? (
                              <DropdownMenuItem
                                className="flex justify-between items-center px-4 hover:bg-gray-900"
                                onClick={handleUnfollowUser}
                              >
                                <RiUserUnfollowFill className="mr-2 h-3.5 w-3.5" />
                                <span>Unfollow</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="flex justify-between items-center px-4 hover:bg-gray-900"
                                onClick={handleFollowUser}
                              >
                                <RiUserFollowFill className="mr-2 h-3.5 w-3.5" />
                                <span>Follow</span>
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

              </div>

              <div
                className="break-words whitespace-pre-wrap text-base text-zinc-300 font-sans"
                dangerouslySetInnerHTML={{ __html: formatTweetContent(tweet.content) }}
              />
              {tweet.mediaUrl && tweet.mediaType === "image" && (
                <div className="relative w-full">
                  <div className="group relative w-fit">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}${tweet.mediaUrl}` || "/placeholder.svg"}
                      alt="tweet-media"
                      width={300}
                      height={300}
                      className="rounded-lg"
                      unoptimized
                    />
                  </div>
                </div>
              )}
              {tweet.mediaUrl && tweet.mediaType === "video" && (
                <div className="relative w-full">
                  <div className="group relative w-fit">
                    <video controls className="w-full max-w-md rounded-lg">
                      <source src={`${process.env.NEXT_PUBLIC_CDN_URL}${tweet.mediaUrl}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
              <PostMenu
                tweet={tweet}
                isLikeAnimating={isLikeAnimating}
                isBookmarkAnimating={isBookmarkAnimating}
                bookmarked={bookmarked}
                liked={liked}
                userId={user?.id}
                handleBookmark={handleBookmark}
                handleUnBookmark={handleUnBookmark}
                handleLike={handleLike}
                handledislike={handledislike}
                handleAnimationEnd={handleAnimationEnd}
              />
            </div>
          </div>
        </div>
      )}
      <DeleteTweetModal
        showDeleteDialog={showDeleteDialog}
        isDeleting={isDeleting}
        confirmDelete={confirmDelete}
        setShowDeleteDialog={setShowDeleteDialog}
      />
    </>
  )
}

export default FeedCard
