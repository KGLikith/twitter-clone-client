"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { FaHeart, FaRegComment, FaUser } from "react-icons/fa6"
import { UnFollowUser, FollowUser } from "@/actions/follow_unfollow"
import { like, dislike } from "@/actions/like_dislike"
import { AiOutlineRetweet } from "react-icons/ai"
import { CiMenuKebab, CiHeart, CiBookmark } from "react-icons/ci"
import { GoUpload } from "react-icons/go"
import { MdDelete } from "react-icons/md"
import { RiUserUnfollowFill, RiUserFollowFill } from "react-icons/ri"
import { VscGraph } from "react-icons/vsc"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { deletePost } from "@/actions/deletePost"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Comment, Tweet, User } from "@/gql/graphql"
import CommentPage from "./Comment"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useCreateComment } from "@/hooks/tweets"
import { Input } from "@/components/ui/input"
import "@/components/normal_comp/FeedCard/heart-animation.css"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { DeleteTweetModal } from "@/components/global/deletetweetDialog"

const FormSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Content must be at least 1 characters.",
    })
    .max(50, {
      message: "Bio must not be longer than 50 characters.",
    }),
})

const TweetPage = ({
  tweet,
  user,
  liked,
  setLiked,
}: {
  user: User
  tweet: Tweet
  setLiked: (liked: boolean) => void
  liked: boolean
}) => {
  const router = useRouter()

  const { mutate } = useCreateComment()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  })

  const iconColor = "text-gray-500"
  const iconHoverColor = "text-orange-500"
  const likedColor = "text-pink-500"
  const likedHoverColor = "text-orange-300"

  const contentValue = form.watch("content")
  useEffect(() => {
    if (user !== undefined) {
      form.reset({
        content: "",
      })
    }
  }, [user])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    form.reset({
      content: "",
    })
    mutate({ content: data.content, tweetId: tweet.id })
    form.reset()
  }

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
      router.push("/")
    } catch (error) {
      console.error("Failed to delete post:", error)
    } finally {
      setDeleting(false)
    }
  }
  const tweetUser = (tweet as Tweet)?.user
  const handleUnfollowUser = useCallback(async () => await UnFollowUser((tweet as Tweet).user, () => { }), [tweetUser])

  const handleFollowUser = useCallback(async () => await FollowUser((tweet as Tweet).user, () => { }), [tweetUser])
  const handleAnimationEnd = () => {
    setIsAnimating(false)
  }

  return (
    <>
      <div className="border border-gray-800 p-4 cursor-pointer hover:bg-[#0a0606]  ">
        <div className="flex gap-2 items-center mb-2">
          <Link href={`/user/${tweet.user.id}`} className="flex items-center">
            {tweet.user?.profileImageUrl && (
              <Image
                className="rounded-full"
                src={tweet.user.profileImageUrl || "/placeholder.svg"}
                alt="user-image"
                height={35}
                width={35}
              />
            )}
          </Link>
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col  justify-start font-sans">
              <Link href={`/user/${tweet.user.id}`}>
                <h5 className="text-white font-bold text-sm hover:underline">
                  {tweet.user.firstName} {tweet.user.lastName}
                </h5>
              </Link>
              <p className="text-gray-400 text-sm">
                @{tweet.user.firstName}
                {tweet.user.lastName}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="p-1 py-2 rounded-full hover:bg-gray-900 hover:text-[#1d9bf0]">
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
                      {user?.following?.findIndex((el) => el?.id === tweet.user.id) !== -1 ? (
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
        <div className="flex flex-col gap-2 mb-3">
          <p className="text-md mx-3 mt-4 mb-2">{tweet.content}</p>
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
        <div className="flex justify-between my-2 text-lg">
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
        <div className="border border-gray-800 mb-3"></div>
        <div className="flex justify-between gap-2 items-center">
          <div className="w-14">
            {user?.profileImageUrl && (
              <Image
                src={user.profileImageUrl || "/placeholder.svg"}
                alt="profile-image"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </div>
          <div className="w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2 flex items-center">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="text-xl leading-3">
                        <Input
                          placeholder="Add a comment"
                          {...field}
                          className="w-full overflow-y bg-inherit text-base border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-none  foucs-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                        />
                        {/* <Textarea
                          placeholder="Add a comment"
                          className="w-full h-2 bg-inherit text-base border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-none  foucs-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                          {...field}
                        /> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={contentValue?.length < 1 || contentValue?.length > 50}
                  className="w-fit py-1 px-5 flex items-center text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-orange-300 rounded-full text-center font-bold text-base dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                >
                  Reply
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <DeleteTweetModal showDeleteDialog={showDeleteDialog} isDeleting={isDeleting} confirmDelete={confirmDelete} setShowDeleteDialog={setShowDeleteDialog} />
      {tweet.comments
        ?.filter((comment): comment is Comment => comment !== null)
        .map((comment: Comment) => (
          <CommentPage key={comment.id} comment={comment} user={user} tweet={tweet} />
        ))}
    </>
  )
}

export default TweetPage
