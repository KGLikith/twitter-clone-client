"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useCurrentUser } from "@/hooks/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MdPhotoSizeSelectActual, MdGifBox, MdOutlineEmojiEmotions } from "react-icons/md"
import { BiPoll } from "react-icons/bi"
import { RiCalendarScheduleLine } from "react-icons/ri"
import { CiLocationOn } from "react-icons/ci"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useCreateTweet } from "@/hooks/tweets"
import type { User } from "@/gql/graphql"
import { apolloClient } from "@/clients/api"
import { getSignedUrlforTweetQuery } from "@/graphql/query/tweet"
import { toast } from "@/hooks/use-toast"
import { deleteMediaMutation } from "@/graphql/mutation/tweet"
import { useMutation } from "@apollo/client"
import { DeleteTweetModal } from "../global/deletetweetDialog"

const FormSchema = z.object({
  content: z
    .string()
    .min(3, {
      message: "Content must be at least 3 characters.",
    })
    .max(300, {
      message: "Content must not be longer than 300 characters.",
    }),
})

const TweetModal = () => {
  const [user, setUser] = useState<User | undefined>()
  const { user: currentUser } = useCurrentUser()
  const { mutateAsync } = useCreateTweet()
  const [deleteMedia] = useMutation(deleteMediaMutation)
  const [mediaUrl, setMediaUrl] = useState<string | null>()
  const [mediaType, setMediaType] = useState<string | null>(null)
  const [mediaUploading, setMediaUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const handleInput = () => {
        textarea.style.height = 'auto'; // Reset the height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
      };

      textarea.addEventListener("input", handleInput);

      return () => {
        textarea.removeEventListener("input", handleInput);
      };
    }
  }, [])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser as User)
      setMediaUrl(null)
      setMediaType(null)
      form.reset({ content: "" })
    } else {
      setUser(undefined)
    }
  }, [currentUser])

  const contentValue = form.watch("content")

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setPosting(true)
    await mutateAsync({ content: data.content, mediaUrl, mediaType })
    setMediaUrl(null)
    setMediaType(null)
    form.reset({ content: "" })
    setPosting(false)
  }

  const handleImageChange = useCallback((input: HTMLInputElement) => {
    return async (e: Event) => {
      if (posting) return
      e.preventDefault()
      const file: File | null | undefined = input.files?.item(0)
      if (!file) return

      setMediaUploading(true)

      try {
        const { data } = await apolloClient.query({
          query: getSignedUrlforTweetQuery,
          variables: {
            mediaType: file.type,
            mediaName: file.name,
          },
        })

        const { getSignedURLForTweet } = data
        if (getSignedURLForTweet) {
          await axios.put(getSignedURLForTweet, file, {
            headers: {
              "Content-Type": file.type,
            },
          })

          const url = new URL(getSignedURLForTweet)
          setMediaUrl(url.pathname)
          setMediaType(file.type.startsWith("image") ? "image" : "video")
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Upload failed" })
      } finally {
        setMediaUploading(false)
      }
    }
  }, [user])

  const handleSelectImage = useCallback(() => {
    console.log('hlakjdfl ')
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

      <div className="border border-gray-800 p-2 md:p-4 cursor-pointer hover:bg-[#0a0606] transition-all min-h-fit">
        <div className="grid grid-cols-12 md:gap-2">
          <div className="col-span-1 mt-5 md:mt-2">
            {user?.profileImageUrl && (
              <Image
                className="rounded-full"
                src={user.profileImageUrl || "/placeholder.svg"}
                alt="user-image"
                height={50}
                width={50}
              />
            )}
          </div>
          <div className="col-span-11">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="text-xl">
                        <Textarea
                          placeholder="What is happening?"
                          className="resize-y rows={1} bg-inherit min-h-fit overflow-y border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-none  foucs-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
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
                    <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
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
                  <span>{contentValue?.length ?? 0}/300</span>
                </div>

                <div className="border border-gray-800"></div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xl text-orange-400">
                    <div onClick={handleSelectImage} className="hover:bg-gray-900 rounded-full p-2 transition-all">
                      <MdPhotoSizeSelectActual />
                    </div>
                    <div className="hover:bg-gray-900 rounded-full p-2 transition-all">
                      <MdGifBox />
                    </div>
                    <div className="hover:bg-gray-900 rounded-full p-2 transition-all">
                      <BiPoll />
                    </div>
                    <div className="hover:bg-gray-900 rounded-full p-2 transition-all">
                      <MdOutlineEmojiEmotions />
                    </div>
                    <div className="hover:bg-gray-900 rounded-full p-2 transition-all">
                      <RiCalendarScheduleLine />
                    </div>
                    <div className="hover:bg-gray-900 rounded-full p-2 transition-all">
                      <CiLocationOn />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={contentValue?.length < 3 || contentValue?.length > 300 || mediaUploading || posting}
                    className="py-1 px-5 text-white bg-orange-700 hover:bg-orange-800 rounded-full font-bold text-base"
                  >
                    Post
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

    </>

  )
}

export default TweetModal
