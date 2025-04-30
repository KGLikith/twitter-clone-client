"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { FaUser } from "react-icons/fa6"
import { UnFollowUser, FollowUser } from "@/actions/follow_unfollow"
import { like, dislike } from "@/actions/like_dislike"
import { CiMenuKebab } from "react-icons/ci"
import { MdDelete } from "react-icons/md"
import { RiUserUnfollowFill, RiUserFollowFill } from "react-icons/ri"
import Image from "next/image"
import { deletePost } from "@/actions/deletePost"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Comment, Tweet, User } from "@/gql/graphql"
import { DeleteTweetModal } from "@/components/global/deletetweetDialog"
import PostMenu from "@/components/global/postMenu"
import { useQueryClient } from "@tanstack/react-query"
import { formatRelativeTime } from "@/actions/helperFxns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CommentPage from "@/components/_components/Comment/Comment_card"
import CommentInput from "@/components/_components/Comment/Comment_Input"
import { bookmark, unBookmark } from "@/actions/bookmarks"
import Skel from "@/components/global/Skeleton/Skeleton"
import { toast } from "sonner"
import { formatTweetContent } from "@/components/global/postMenu/handleSelect"

const TweetPage = ({
  isFetchingNextPage,
  tweet,
  user,
  comments,
  hasNextPage
}: {
  isFetchingNextPage: boolean
  user: User
  tweet: Tweet
  comments: Comment[]
  hasNextPage: boolean
}) => {
  const router = useRouter()

  const [isDeleting, setDeleting] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [liked, setLiked] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false)
  const queryclient = useQueryClient();

  useEffect(() => {
    setLiked(tweet.likes.includes(user.id))
    setBookmarked(user?.bookmark?.bookmarks ? (user.bookmark.bookmarks?.findIndex((el) => el?.tweetId === tweet.id) !== -1) : false || false)
  }, [tweet, user])

  const handleLike = useCallback(async () => {
    setIsLikeAnimating(true)
    await like(user.id, tweet as Tweet, setLiked, liked, queryclient)
  }, [user, tweet, liked])

  const handledislike = useCallback(async () => {
    setIsLikeAnimating(true)
    await dislike(user.id, tweet as Tweet, setLiked, liked, queryclient)
  }, [user, tweet, liked])

  const handleDeletePost = useCallback(async () => {
    setShowDeleteDialog(true)
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deletePost(tweet as Tweet, queryclient)
      setShowDeleteDialog(false)
      router.push("/")
    } catch (error) {
      console.error("Failed to delete post:", error)
    } finally {
      setDeleting(false)
    }
  }
  const tweetUser = (tweet as Tweet)?.user
  const handleUnfollowUser = useCallback(async () => await UnFollowUser(user.id,(tweet as Tweet).user.id, () => { }, queryclient), [tweetUser])

  const handleFollowUser = useCallback(async () => await FollowUser(user.id,(tweet as Tweet).user.id, () => { }, queryclient), [tweetUser])
  const handleAnimationEnd = () => {
    setIsLikeAnimating(false)
    setIsBookmarkAnimating(false)
  }

  const handleBookmark = useCallback(async () => {
    if (!user) {
      toast.error("Please login/sign-up to like the post", { duration: 1000 })
      return
    }
    setIsBookmarkAnimating(true)
    await bookmark(tweet.id, undefined, user.id, setBookmarked, bookmarked, queryclient)
  }, [user, tweet, bookmarked])

  const handleUnBookmark = useCallback(async () => {
    if (!user) {
      toast.error("Please login/sign-up to like the post", { duration: 1000 })
      return
    }
    setIsBookmarkAnimating(true)
    await unBookmark(tweet.id, undefined, user.id, setBookmarked, bookmarked, queryclient)
  }, [user, tweet, bookmarked])

  return (
    <>
      <div className="border border-gray-800 p-4 cursor-pointer hover:bg-[#0a0606]  ">
        <div className="flex gap-2 items-center mb-2">
          <Link href={`/user/${tweet.user.id}`} className="flex items-center">
            <Avatar className="h-10 w-10 border-2 border-zinc-700 rounded-full overflow-hidden">
              <AvatarImage
                src={tweet.user.profileImageUrl?`${process.env.NEXT_PUBLIC_CDN_URL || ""}${tweet.user.profileImageUrl}` : "/user.png"}
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl flex items-center justify-center">
                {tweet.user.name.slice(1)[0]}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <Link className="flex justify-center items-center gap-2" href={user ? `/user/${tweet.user.id}` : "/not_authorised"}>
                <h5 className="font-bold hover:underline w-fit">
                  {tweet.user.name}
                </h5>
                <p className="text-sm text-gray-400">@{tweet.user.userName}</p>
              </Link>
              <span className="text-gray-500">·</span>
              <div className="text-xs text-gray-500 hover:underline">{formatRelativeTime(tweet.createdAt)}</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="p-1 py-2 rounded-full hover:bg-gray-800 hover:text-orange-300">
                  <CiMenuKebab />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-40  bg-black "
                style={{
                  boxShadow: "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px",
                }}
              >
                <DropdownMenuGroup>
                  <Link href={`/user/${tweet.user.id}`}>
                    <DropdownMenuItem className="flex justify-between items-center px-4 hover:bg-gray-900">
                      <FaUser className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  {user?.id === tweet.user.id ? (
                    <DropdownMenuItem
                      className="flex justify-between items-center px-4 hover:bg-gray-900 text-red-500"
                      onClick={handleDeletePost}
                    >
                      <MdDelete className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      {user?.following?.findIndex((el) => el === tweet.user.id) !== -1 ? (
                        <DropdownMenuItem
                          className="flex justify-between items-center px-4 hover:bg-gray-900"
                          onClick={handleUnfollowUser}
                        >
                          <RiUserUnfollowFill className="mr-2 h-4 w-4" />
                          <span>Unfollow</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="flex justify-between items-center px-4 hover:bg-gray-900"
                          onClick={handleFollowUser}
                        >
                          <RiUserFollowFill className="mr-2 h-4 w-4" />
                          <span>Follow</span>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-3 mt-3">
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
                />
              </div>
            </div>
          )}
          {tweet.mediaUrl && tweet.mediaType === "video" && (
            <div className="relative w-full">
              <div className="group relative w-full">
                <video controls className="w-full max-w-md rounded-lg">
                  <source src={`${process.env.NEXT_PUBLIC_CDN_URL}${tweet.mediaUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </div>
        <div className="border border-gray-800 mb-2"></div>

        <PostMenu
          bookmarked={bookmarked}
          isBookmarkAnimating={isBookmarkAnimating}
          handleBookmark={handleBookmark}
          handleUnBookmark={handleUnBookmark}
          isLikeAnimating={isLikeAnimating}
          tweet={{
            ...tweet,
            commentsLength: comments.length
          }}
          userId={user.id}
          liked={liked}
          handleLike={handleLike}
          handledislike={handledislike}
          handleAnimationEnd={handleAnimationEnd}
        />

        <div className="border border-gray-800 mb-3"></div>

        <CommentInput user={user} tweetId={tweet.id} />

      </div>
      <DeleteTweetModal showDeleteDialog={showDeleteDialog} isDeleting={isDeleting} confirmDelete={confirmDelete} setShowDeleteDialog={setShowDeleteDialog} />
      {comments
        ?.filter((comment): comment is Comment => comment !== null)
        .map((comment: Comment) => (
          <CommentPage key={comment.id} comment={comment} user={user} tweet={tweet} />
        ))}
      {
        isFetchingNextPage && (
          <>
            <Skel />
            <Skel />
            <Skel />
            <Skel />
          </>
        )
      }
      {!hasNextPage && !isFetchingNextPage && comments.length > 0 && (
        <div className="text-center text-gray-500 py-6">
          You’ve reached the end of the comments!
        </div>
      )}


    </>
  )
}

export default TweetPage