"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
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
import "@/components/_components/FeedCard/heart-animation.css"
import { DeleteTweetModal } from "@/components/global/deletetweetDialog"
import PostMenu from "@/components/global/postMenu"
import { Textarea } from "@/components/ui/textarea"
import { useMutation } from "@apollo/client"
import { deleteMediaMutation } from "@/graphql/mutation/tweet"
import { apolloClient } from "@/clients/api"
import { getSignedUrlforCommentQuery } from "@/graphql/query/tweet"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import TweetMenu from "@/components/global/TweetMenu"
import { handleEmojiSelect, handleGifSelect, searchGifs } from "@/components/global/postMenu/handleSelect"
import { useQueryClient } from "@tanstack/react-query"
import { formatRelativeTime } from "@/actions/helperFxns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const FormSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Content must be at least 1 characters.",
    })
    .max(150, {
      message: "Reply must not be longer than 150 characters.",
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

  const { mutateAsync, comment } = useCreateComment()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteMedia] = useMutation(deleteMediaMutation)
  const [mediaUrl, setMediaUrl] = useState<string | null>()
  const [mediaType, setMediaType] = useState<string | null>(null)
  const [mediaUploading, setMediaUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [posting, setPosting] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [gifSearchTerm, setGifSearchTerm] = useState("")
  const [gifs, setGifs] = useState<any[]>([])
  const [focus, onFocus] = useState(false)
  const queryclient = useQueryClient();

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      const handleInput = () => {
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`
      }

      textarea.addEventListener("input", handleInput)

      return () => {
        textarea.removeEventListener("input", handleInput)
      }
    }
  }, [focus])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  })

  const contentValue = form.watch("content")
  useEffect(() => {
    if (user !== undefined) {
      form.reset({
        content: "",
      })
    }
  }, [user])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user || posting) return
    try {
      setPosting(true)
      await mutateAsync({ content: data.content, tweetId: tweet.id, mediaUrl: mediaUrl, mediaType: mediaType })
      form.reset({
        content: "",
      })
      setMediaUrl(null)
      setMediaType(null)
      form.reset()

      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to reply...",
        description: "Please try again later",
      })
    } finally {
      setPosting(false)
    }

    setPosting(false)
  }

  const handleLike = useCallback(async () => {
    setIsAnimating(true)
    await like(user.id, user.name, tweet as Tweet, setLiked, liked, queryclient)
  }, [user, tweet, liked])

  const handledislike = useCallback(async () => {
    setIsAnimating(true)
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
  const handleUnfollowUser = useCallback(async () => await UnFollowUser((tweet as Tweet).user, () => { }, queryclient), [tweetUser])

  const handleFollowUser = useCallback(async () => await FollowUser((tweet as Tweet).user.id, () => { }, queryclient), [tweetUser])
  const handleAnimationEnd = () => {
    setIsAnimating(false)
  }

  const handleImageChange = useCallback(
    (input: HTMLInputElement) => {
      return async (e: Event) => {
        if (posting) return
        e.preventDefault()
        const file: File | null | undefined = input.files?.item(0)
        if (!file) return

        setMediaUploading(true)

        try {
          const { data } = await apolloClient.query({
            query: getSignedUrlforCommentQuery,
            variables: {
              mediaType: file.type,
              mediaName: file.name,
            },
          })

          const { getSignedURLForComment } = data
          if (getSignedURLForComment) {
            await axios.put(getSignedURLForComment, file, {
              headers: {
                "Content-Type": file.type,
              },
            })

            const url = new URL(getSignedURLForComment)
            setMediaUrl(url.pathname)
            setMediaType(file.type.startsWith("image") ? "image" : "video")
          }
        } catch (error) {
          toast({ variant: "destructive", title: "Upload failed" })
        } finally {
          setMediaUploading(false)
        }
      }
    },
    [user],
  )

  const handleSelectImage = useCallback(() => {
    if (posting || !user) return
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,video/*"
    const handlerFn = handleImageChange(input)
    input.addEventListener("change", handlerFn)
    input.click()
  }, [posting, user])

  const handleRemoveMedia = () => {
    if (!mediaUrl) return
    deleteMedia({ variables: { mediaUrl: mediaUrl || "" } })
    setMediaUrl(null)
    setMediaType(null)
  }

  return (
    <>
      <div className="border border-gray-800 p-4 cursor-pointer hover:bg-[#0a0606]  ">
        <div className="flex gap-2 items-center mb-2">
          <Link href={`/user/${tweet.user.id}`} className="flex items-center">
            <Avatar className="h-10 w-10 border-2 border-zinc-700 rounded-full overflow-hidden">
              <AvatarImage
                src={
                  tweet.user?.profileImageUrl?.startsWith("/")
                    ? process.env.NEXT_PUBLIC_CDN_URL + tweet.user.profileImageUrl
                    : tweet.user?.profileImageUrl || "/user.png"
                }
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

        <PostMenu isAnimating={isAnimating} tweet={tweet} userId={user.id} liked={liked} handleLike={handleLike} handledislike={handledislike} handleAnimationEnd={handleAnimationEnd} />

        <div className="border border-gray-800 mb-3"></div>
        <div className="flex justify-between gap-2 items-start">
          <div className="h-10 w-10 rounded-full overflow-hidden">
          <Avatar className="h-10 w-10 border-2 border-zinc-700 rounded-full overflow-hidden">
              <AvatarImage
                src={
                  user?.profileImageUrl?.startsWith("/")
                    ? process.env.NEXT_PUBLIC_CDN_URL + user.profileImageUrl
                    : user?.profileImageUrl || "/user.png"
                }
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl flex items-center justify-center">
                {user.name.slice(1)[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="w-full ">
            {!focus ? (<>
              <div className="w-full space-y-2 flex items-center">
                <Input
                  onFocus={() => onFocus(true)}
                  placeholder="Add a comment"
                  className="w-full overflow-y bg-inherit text-sm border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-none  foucs-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  disabled={true}
                  className="w-fit py-1 px-5 flex items-center text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-orange-300 rounded-full text-center font-bold text-base dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                >
                  Reply
                </Button>
              </div>
            </>) : (
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl className="text-xl">
                            <Textarea
                              placeholder="Add a comment"
                              className="resize-y rows={1} text-base bg-inherit min-h-fit overflow-y border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-none foucs-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                              {...field}
                              disabled={posting || !user}
                              ref={textareaRef}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {mediaUploading && (
                      <div className="w-full flex justify-start items-center gap-2 py-2">
                        <div className="w-5 h-5 border-2 border-t-transparent border-orange-500 rounded-full animate-spin" />
                        <span className="text-sm text-muted-foreground">Uploading...</span>
                      </div>
                    )}

                    {mediaUrl && mediaType === "image" && (
                      <div className="relative w-full">
                        <div className="group relative w-fit">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_CDN_URL}${mediaUrl}` || "/placeholder.svg"}
                            alt="tweet-media"
                            width={300}
                            height={300}
                            className="rounded-lg"
                            unoptimized
                          />
                          <button
                            type="button"
                            disabled={posting}
                            onClick={handleRemoveMedia}
                            className="absolute top-2 right-2 p-1.5 text-white bg-black/70 hover:bg-black/90 rounded-full focus:outline-none transition-all"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    )}
                    {mediaUrl && mediaType === "video" && (
                      <div className="relative w-full">
                        <div className="group relative w-fit">
                          <video controls className="w-full max-w-md rounded-lg">
                            <source src={`${process.env.NEXT_PUBLIC_CDN_URL}${mediaUrl}`} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <button
                            type="button"
                            onClick={handleRemoveMedia}
                            disabled={posting}
                            className="absolute top-2 right-2 p-2 px-4 text-white bg-black/70 hover:bg-black/90 rounded-full focus:outline-none transition-all"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground flex justify-between ">
                      <span>{contentValue?.length ?? 0}/150</span>
                    </div>

                    <div className="border border-gray-800"></div>
                    <div className="flex justify-between items-center">
                      <TweetMenu
                        handleGifSelect={(data) => {
                          handleGifSelect(data, setMediaUploading, setShowGifPicker, setMediaUrl, setMediaType, mediaUrl, toast)
                        }}
                        searchGifs={() => searchGifs(gifSearchTerm, setGifs)}
                        handleEmojiSelect={(emoji) => {
                          handleEmojiSelect(textareaRef, emoji, form, setShowEmojiPicker)
                        }}
                        handleSelectImage={handleSelectImage}
                        showGifPicker={showGifPicker}
                        setShowGifPicker={setShowGifPicker}
                        gifSearchTerm={gifSearchTerm}
                        setGifSearchTerm={setGifSearchTerm}
                        gifs={gifs}
                        showEmojiPicker={showEmojiPicker}
                        setShowEmojiPicker={setShowEmojiPicker}
                      />
                      <Button
                        type="submit"
                        disabled={contentValue?.length < 3 || contentValue?.length > 150 || mediaUploading || posting}
                        className="py-1 px-5 text-white bg-orange-700 hover:bg-orange-800 rounded-full font-bold text-base"
                      >
                        {posting ? "Replying..." : "Reply"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            )
            }
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