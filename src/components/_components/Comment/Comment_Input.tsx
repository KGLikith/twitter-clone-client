import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import TweetMenu from "@/components/global/TweetMenu"
import { handleEmojiSelect, handleGifSelect, searchGifs } from "@/components/global/postMenu/handleSelect"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {  User } from '@/gql/graphql'
import { useCreateComment } from '@/hooks/tweets'
import { getSignedUrlforCommentQuery } from '@/graphql/query/tweet'
import { apolloClient } from '@/clients/api'
import { useMutation } from '@apollo/client'
import { deleteMediaMutation } from '@/graphql/mutation/tweet'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'sonner'


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

type Props = {
    user: User
    tweetId: string
}

export default function CommentInput({ user, tweetId }: Props) {
    const { mutateAsync, comment } = useCreateComment()
    const [mediaType, setMediaType] = useState<string | null>(null)
    const [mediaUploading, setMediaUploading] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showGifPicker, setShowGifPicker] = useState(false)
    const [gifSearchTerm, setGifSearchTerm] = useState("")
    const [gifs, setGifs] = useState<any[]>([])
    const [mediaUrl, setMediaUrl] = useState<string | null>()
    const [posting, setPosting] = useState(false)
    const [deleteMedia] = useMutation(deleteMediaMutation)


    const [focus, onFocus] = useState(false)

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
            await mutateAsync({ content: data.content,  tweetId: tweetId, mediaUrl: mediaUrl, mediaType: mediaType })
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
            console.log("error",err)
            toast.error("Failed to reply...",{
                description: "Please try again later",
                duration: 2000
            })
        } finally {
            setPosting(false)
        }

        setPosting(false)
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
                    toast.error("Upload failed",{ duration: 2000, description: "Please try again later" })
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
        <div className="flex justify-between gap-2 items-start">
            <div className="h-10 w-10 rounded-full overflow-hidden">
                <Avatar className="h-10 w-10 border-2 border-zinc-700 rounded-full overflow-hidden">
                    <AvatarImage
                        src={user.profileImageUrl ?`${process.env.NEXT_PUBLIC_CDN_URL || ""}${user.profileImageUrl}` : "/user.png"}
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
    )
}