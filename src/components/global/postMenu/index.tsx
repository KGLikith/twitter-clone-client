"use client"

import type { Comment, Tweet } from "@/gql/graphql"
import Link from "next/link"
import { FaHeart, FaRegComment } from "react-icons/fa6"
import { CiBookmark, CiHeart } from "react-icons/ci"
import { GoUpload } from "react-icons/go"
import { FaBookmark } from "react-icons/fa"
import { toast } from "sonner"

type Props = {
  tweet?: Tweet
  userId?: string
  comment?: Comment
  liked: boolean
  bookmarked: boolean
  handleLike: () => Promise<void>
  handledislike: () => Promise<void>
  isLikeAnimating: boolean
  isBookmarkAnimating: boolean
  handleAnimationEnd: () => void
  handleBookmark?: () => Promise<void>
  handleUnBookmark?: () => Promise<void>
}

export default function PostMenu({
  comment,
  tweet,
  userId,
  liked,
  bookmarked,
  handleLike,
  handledislike,
  handleAnimationEnd,
  isLikeAnimating,
  isBookmarkAnimating,
  handleBookmark,
  handleUnBookmark,
}: Props) {
  const iconColor = "text-gray-500"
  const likedColor = "text-pink-500"
  const likedHoverColor = "text-pink-300"
  const bookmarkedColor = "text-orange-500"
  const bookmarkedHoverColor = "text-orange-300"

  const handleShare = async () => {
    const postUrl = tweet
      ? `${window.location.origin}/posts/${tweet.id}`
      : comment?.id
        ? `${window.location.origin}/comments/${comment.id}`
        : window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: tweet?.content || comment?.content || "Check out this post",
          url: postUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl)
      toast.info("Link copied to clipboard",{
        duration: 2000,
        description: "You can now share it with others",
      })
    } else {
      toast.error("Sorry, your browser does not support sharing",{
        duration: 2000,
      })
    }
  }

  return (
    <div className="flex justify-between my-2 text-lg">
      <Link href={userId ? (tweet ? `/posts/${tweet?.id}` : "#") : "not_authorised"}>
        <div className="rounded-full gap-2 p-2 flex justify-center items-center">
          <FaRegComment size={16} className={`${iconColor} hover:text-orange-500`} />
          <p className="text-center text-xs text-gray-500">{tweet?.commentsLength || 0}</p>
        </div>
      </Link>

      <div className="rounded-full p-2 gap-2 flex justify-center items-center">
        {liked ? (
          <>
            <div className={`${likedColor} flex gap-2 justify-center items-center`}>
              <div className={`heart-icon ${isLikeAnimating ? "heart-pop" : ""}`} onAnimationEnd={handleAnimationEnd}>
                <FaHeart
                  onClick={handledislike}
                  size={18}
                  className={`${likedColor} hover:${likedHoverColor} cursor-pointer`}
                />
              </div>
              <p className="text-center text-xs">{tweet ? tweet.likes?.length || 0 : comment?.likes?.length || 0}</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-2 justify-center items-center">
              <div
                className={`heart-icon ${isLikeAnimating ? "heart-empty-pop" : ""}`}
                onAnimationEnd={handleAnimationEnd}
              >
                <CiHeart onClick={handleLike} size={18} className={`${iconColor} hover:text-pink-500 cursor-pointer`} />
              </div>
              <p className={`${iconColor} text-center text-xs`}>
                {tweet ? tweet.likes?.length || 0 : comment?.likes?.length || 0}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-4">
        <div className="rounded-full p-2 flex justify-center items-center">
          {bookmarked ? (
            <div
              className={`bookmark-icon ${isBookmarkAnimating ? "bookmark-pop" : ""}`}
              onAnimationEnd={handleAnimationEnd}
            >
              <FaBookmark
                onClick={handleUnBookmark}
                size={16}
                className={`${bookmarkedColor} hover:${bookmarkedHoverColor} cursor-pointer`}
              />
            </div>
          ) : (
            <div
              className={`bookmark-icon ${isBookmarkAnimating ? "bookmark-empty-pop" : ""}`}
              onAnimationEnd={handleAnimationEnd}
            >
              <CiBookmark
                onClick={handleBookmark}
                size={16}
                className={`${iconColor} hover:text-orange-500 cursor-pointer`}
              />
            </div>
          )}
        </div>
        <div className="rounded-full p-2 flex justify-center items-center">
          <GoUpload onClick={handleShare} size={16} className={`${iconColor} hover:text-orange-500 cursor-pointer`} />
        </div>
      </div>
    </div>
  )
}
