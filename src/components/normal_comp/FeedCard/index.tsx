"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { FaArrowRight, FaHeart, FaRegComment, FaUser } from "react-icons/fa6"
import { AiOutlineRetweet } from "react-icons/ai"
import { CiBookmark, CiHeart, CiMenuKebab } from "react-icons/ci"
import { VscGraph } from "react-icons/vsc"
import { GoUpload } from "react-icons/go"
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
import "./heart-animation.css"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { DeleteTweetModal } from "@/components/global/deletetweetDialog"

interface FeedCardProps {
  tweet: Tweet
  user: User
}

const FeedCard: React.FC<FeedCardProps> = ({ tweet, user }) => {
  const [liked, setLiked] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Orange theme colors
  const iconColor = "text-gray-500"
  const iconHoverColor = "text-blue-500"
  const likedColor = "text-pink-500"
  const likedHoverColor = "text-pink-300"

  useEffect(() => {
    if (tweet) {
      setLiked(tweet.likes.includes((user as User)?.id))
    }
  }, [tweet, user])

  const handleLike = useCallback(async () => {
    setIsAnimating(true)
    await like(user.id, tweet as Tweet, setLiked, liked)
  }, [user, tweet, liked])

  const handledislike = useCallback(async () => {
    setIsAnimating(true)
    await dislike(user.id, tweet as Tweet, setLiked, liked)
  }, [user, tweet, liked])

  const handleDeletePost = useCallback(async () => {
    setShowDeleteDialog(true)
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deletePost(tweet as Tweet)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Failed to delete post:", error)
    } finally {
      setDeleting(false)
    }
  }

  const handleUnfollowUser = useCallback(async () => await UnFollowUser((tweet as Tweet).user, () => { }), [tweet])

  const handleFollowUser = useCallback(async () => await FollowUser((tweet as Tweet).user, () => { }), [tweet])

  const handleAnimationEnd = () => {
    setIsAnimating(false)
  }

  return (
    <>
      {tweet && (
        <div className="border border-gray-800 p-4 py-2 cursor-pointer hover:bg-[#0a0606] ">
          <div className="grid grid-cols-12 gap-2">
            <Link href={user ? `/user/${tweet?.user.id}` : "/not_authorised"}>
              <div className="col-span-1  ">
                {tweet.user?.profileImageUrl && (
                  <Image
                    className="rounded-full"
                    src={tweet.user.profileImageUrl || "/placeholder.svg"}
                    alt="user-image"
                    height={50}
                    width={50}
                  />
                )}
              </div>
            </Link>
            <div className="col-span-11 space-y-3">
              <div className="flex justify-between items-center">
                <Link href={user ? `/user/${tweet.user.id}` : "/not_authorised"}>
                  <h5 className="font-bold hover:underline w-fit">
                    {tweet.user.firstName} {tweet.user.lastName}
                  </h5>
                </Link>
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className={`p-1 py-2 rounded-full hover:bg-gray-900 ${iconColor} hover:${iconHoverColor}`}>
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
                        <Link href={`/user/${tweet.user.id}/posts/${tweet.id}`}>
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
              <p>{tweet.content}</p>
              {tweet.mediaUrl && tweet.mediaType === "image" && (
                <div className="relative w-full">
                  <div className="group relative w-fit">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}${tweet.mediaUrl}` || "/placeholder.svg"}
                      alt="tweet-media"
                      width={300}
                      height={300}
                      className="rounded-lg"
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
              <div className="flex justify-between mt-4 text-lg">
                <Link href={user ? `/user/${tweet.user.id}/posts/${tweet.id}` : "not_authorised"}>
                  <div className="rounded-full gap-2 p-2 flex justify-center items-center">
                    <FaRegComment size={16} className={`${iconColor} hover:text-orange-500`} />
                    <p className="text-center text-xs text-gray-500">{tweet.comments?.length | 0}</p>
                  </div>
                </Link>
                <div className="rounded-full p-2 flex justify-center items-center">
                  <AiOutlineRetweet size={16} className={`${iconColor} hover:text-orange-500`} />
                </div>
                <div className="rounded-full p-2 gap-2 flex justify-center items-center">
                  {liked ? (
                    <>
                      <div className={`${likedColor} flex gap-2 justify-center items-center`}>
                        <div
                          className={`heart-icon ${isAnimating ? "heart-pop" : ""}`}
                          onAnimationEnd={handleAnimationEnd}
                        >
                          <FaHeart
                            onClick={handledislike}
                            size={16}
                            className={`${likedColor} hover:${likedHoverColor}`}
                          />
                        </div>
                        <p className="text-center text-xs">{tweet.likes?.length | 0}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2 justify-center items-center">
                        <div
                          className={`heart-icon ${isAnimating ? "heart-empty-pop" : ""}`}
                          onAnimationEnd={handleAnimationEnd}
                        >
                          <CiHeart onClick={handleLike} size={16} className={`${iconColor} hover:text-orange-500`} />
                        </div>
                        <p className={`${iconColor} text-center text-xs`}>{tweet.likes?.length | 0}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="rounded-full p-2 flex justify-center items-center">
                  <VscGraph size={16} className={`${iconColor} hover:text-orange-500`} />
                </div>
                <div className="flex gap-2">
                  <div className="rounded-full p-2 flex justify-center items-center">
                    <CiBookmark size={16} className={`${iconColor} hover:text-orange-500`} />
                  </div>
                  <div className="rounded-full p-2 flex justify-center items-center">
                    <GoUpload size={16} className={`${iconColor} hover:text-orange-500`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteTweetModal showDeleteDialog={showDeleteDialog} isDeleting={isDeleting} confirmDelete={confirmDelete} setShowDeleteDialog={setShowDeleteDialog} />
    </>
  )
}

export default FeedCard
