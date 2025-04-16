"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useCurrentUser } from "@/hooks/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { handleEmojiSelect, handleGifSelect, searchGifs } from "../global/postMenu/handleSelect"
import TweetMenu from "../global/TweetMenu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [posting, setPosting] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [gifSearchTerm, setGifSearchTerm] = useState("")
  const [gifs, setGifs] = useState<any[]>([])

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
    if (!user || posting) return
    setPosting(true)
    try {

      await mutateAsync({
        content: data.content,
        mediaUrl,
        mediaType,
      })

      setMediaUrl(null)
      setMediaType(null)
      form.reset({ content: "" })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to post tweet",
        description: "Please try again later",
      })
    } finally {
      setPosting(false)
    }
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
      <div className="border border-gray-800 p-2 md:p-4 cursor-pointer hover:bg-[#0a0606] transition-all min-h-fit">
        <div className="grid grid-cols-12 md:gap-2">
          <Avatar className="sm:h-12 sm:w-12 h-10 w-10 border-2 mt-1 col-span-1 border-zinc-700 rounded-full overflow-hidden">
            <AvatarImage
              src={user?.profileImageUrl?.startsWith("/") ? process.env.NEXT_PUBLIC_CDN_URL + user.profileImageUrl : user?.profileImageUrl || "/user.png"}

              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl flex items-center justify-center">
              {user?.userName?.slice(1)[0]}
            </AvatarFallback>
          </Avatar>
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
                          className="resize-y rows={1} text-lg bg-inherit min-h-fit overflow-y border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-none foucs-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
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
                  <span>{contentValue?.length ?? 0}/300</span>
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
                    disabled={contentValue?.length < 3 || contentValue?.length > 300 || mediaUploading || posting}
                    className="py-1 px-5 text-white bg-orange-700 hover:bg-orange-800 rounded-full font-bold text-base"
                  >
                    {posting ? "Posting..." : "Post"}
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


// <div className="flex items-center text-xl text-orange-400">

// <div
//   onClick={handleSelectImage}
//   className="hover:bg-gray-900 rounded-full p-2 transition-all cursor-pointer"
// >
//   <HiOutlinePhotograph />
// </div>

// <Popover open={showGifPicker} onOpenChange={setShowGifPicker}>
//   <PopoverTrigger asChild>
//     <div className="hover:bg-gray-900 rounded-full p-2 transition-all cursor-pointer">
//       <AiOutlineGif />
//     </div>
//   </PopoverTrigger>
//   <PopoverContent className="w-[300px]">
//     <Input
//       placeholder="Search GIFs"
//       className="mb-2"
//       value={gifSearchTerm}
//       onChange={(e) => setGifSearchTerm(e.target.value)}
//       onKeyDown={(e) => e.key === "Enter" && searchGifs(gifSearchTerm, setGifs)}
//     />
//     <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
//       {gifs.map((gif) => (
//         <img
//           key={gif.id}
//           src={gif.images.fixed_height_small.url}
//           alt="gif"
//           className="cursor-pointer rounded-md"
//           onClick={() => handleGifSelect(gif, setMediaUploading, setShowGifPicker, setMediaUrl, setMediaType, toast)}
//         />
//       ))}
//     </div>
//     {
//       !gifSearchTerm && (
//         <div className="text-center py-4 text-gray-400">
//           Search for GIFs. Press Enter after typing.
//         </div>
//       )
//     }
//     {gifs.length === 0 && gifSearchTerm && (
//       <div className="text-center py-4 text-gray-400">
//         No GIFs found. Try a different search term.
//       </div>
//     )}
//   </PopoverContent>
// </Popover>


// {/* <div
//   onClick={() => setShowPollCreator(!showPollCreator)}
//   className={`hover:bg-gray-900 rounded-full p-2 transition-all cursor-pointer ${showPollCreator ? "bg-gray-900" : ""}`}
// >
//   <HiOutlineChartBar />
// </div> */}

// <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
//   <PopoverTrigger asChild>
//     <div className="hover:bg-gray-900 rounded-full p-2 transition-all cursor-pointer">
//       <FiSmile />
//     </div>
//   </PopoverTrigger>
//   <PopoverContent className="w-full p-0 border-gray-700">
//     <Picker data={data} onEmojiSelect={(emoji: any) => {
//       handleEmojiSelect(textareaRef, emoji, form, setShowEmojiPicker)
//     }} theme="dark" />
//   </PopoverContent>
// </Popover>

// {/* <div
//   onClick={() => setShowScheduler(!showScheduler)}
//   className={`hover:bg-gray-900 rounded-full p-2 transition-all cursor-pointer ${showScheduler ? "bg-gray-900" : ""}`}
// >
//   <FiCalendar />
// </div> */}

// {/* <div
//   onClick={() => setShowLocationPicker(!showLocationPicker)}
//   className={`hover:bg-gray-900 rounded-full p-2 transition-all cursor-pointer ${showLocationPicker ? "bg-gray-900" : ""}`}
// >
//   <FiMapPin />
// </div> */}
// </div>



{/* {showPollCreator && (
                  <div className="border border-gray-700 rounded-lg p-3 space-y-3">
                    <h3 className="font-medium text-orange-400">Create a poll</h3>
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updatePollOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="bg-transparent border-gray-700"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removePollOption(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 4 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addPollOption}
                        className="w-full border-gray-700 text-orange-400 hover:bg-gray-900"
                      >
                        Add option
                      </Button>
                    )}
                    <div>
                      <Label className="text-sm text-gray-400">Poll duration</Label>
                      <select
                        value={pollDuration}
                        onChange={(e) => setPollDuration(e.target.value)}
                        className="w-full mt-1 bg-transparent border border-gray-700 rounded-md p-2"
                      >
                        <option value="1 day">1 day</option>
                        <option value="3 days">3 days</option>
                        <option value="1 week">1 week</option>
                        <option value="1 month">1 month</option>
                      </select>
                    </div>
                  </div>
                )} */}

{/* {showLocationPicker && (
                  <div className="border border-gray-700 rounded-lg p-3">
                    <h3 className="font-medium text-orange-400 mb-2">Add location</h3>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter your location"
                      className="bg-transparent border-gray-700"
                    />
                  </div>
                )} */}

{/* {showScheduler && (
                  <div className="border border-gray-700 rounded-lg p-3">
                    <h3 className="font-medium text-orange-400 mb-2">Schedule post</h3>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border border-gray-700"
                    />
                    {date && (
                      <div className="mt-2 text-sm text-gray-400">
                        Your tweet will be posted on {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                )} */}