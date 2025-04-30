"use client"

import React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import type { UpdateUserData, User } from "@/gql/graphql"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { formSchema } from "@/schema/updateUser"
import { Camera, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { apolloClient } from "@/clients/api"
import { getSignedUrlForUserQuery } from "@/graphql/query/user"
import axios from "axios"
import ProfileImageUpload from "@/components/_components/imageUpload"
import { toast } from "sonner"

interface UserSettingsFormProps {
    user: User | undefined
    onSave: (userData: UpdateUserData) => Promise<void>
}

type FormValues = z.infer<typeof formSchema>

export default function UserSettingsForm({ user, onSave }: UserSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [profileImage, setProfileImage] = useState<File | null>(null)

    const handleProfileImageChange = (file: File | null) => {
        setProfileImage(file)
        if(!file){
            form.setValue("profileImageUrl", "")
        }
    }

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
            name: "",
            email: "",
            location: "",
            bio: "",
            website: "",
            profileImageUrl: "",
            notificationPreference: {
                likes: true,
                comments: true,
                follows: true,
            },
        },
    })

    useEffect(() => {
        if (user) {
            form.reset({
                userName: user.userName || "",
                name: user.name || "",
                email: user.email || "",
                location: user.location || "",
                bio: user.bio || "",
                website: user.website || "",
                profileImageUrl: user.profileImageUrl || "",
                notificationPreference: {
                    likes: user.notificationPreference?.likes ?? true,
                    comments: user.notificationPreference?.comments ?? true,
                    follows: user.notificationPreference?.follows ?? true,
                },
            })
        }
    }, [user, form])

    const uploadProfileImage = async (): Promise<string | null> => {
        if (!profileImage) return null

        try {
            const { data } = await apolloClient.query({
                query: getSignedUrlForUserQuery,
                variables: {
                    mediaName: profileImage.name,
                    mediaType: profileImage.type,
                },
            })
            const { getSignedUrlForUser } = data
            if (!getSignedUrlForUser) {
                throw new Error("Failed to get signed URL")
            }

            await axios.put(getSignedUrlForUser, profileImage, {
                headers: {
                    "Content-Type": profileImage.type,
                },
            })

            const url = new URL(getSignedUrlForUser)

            return url.pathname
        } catch (error) {
            console.error("Image upload failed:", error)
            toast.error("Image upload failed",{
                duration:1000,
                description: "There was a problem uploading your profile image",
            })
            return null
        }
    }

    async function onSubmit(values: FormValues) {
        setIsLoading(true)
        try {
            let imageUrl = values.profileImageUrl
            if (profileImage) {
                const uploadedUrl = await uploadProfileImage()
                if (uploadedUrl) {
                    imageUrl = uploadedUrl
                }
            }

            await onSave({
                ...values,
                profileImageUrl: imageUrl,
            })
        } catch (error) {
            console.error("Error saving profile:", error)
            toast.error("Failed to update profile",{
                duration: 1000,
                description: "There was a problem updating your profile",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-50">Profile Information</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Update your profile details visible to other users
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col w-full items-center gap-6">
                            <ProfileImageUpload imageUrl={form.watch("profileImageUrl")} onImageChange={handleProfileImageChange} />

                            <div className="space-y-4 flex-1 w-full">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-300">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled
                                                    className="bg-zinc-950 border-zinc-700 text-zinc-400 cursor-not-allowed"
                                                    placeholder="your.email@example.com"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="userName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-300">Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="bg-zinc-950 border-zinc-700 text-zinc-50  focus:ring-orange-600/20"
                                                    placeholder="@userName"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-orange-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-300">Display Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="bg-zinc-950 border-zinc-700 text-zinc-50  focus:ring-orange-600/20"
                                                    placeholder="Your name"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-orange-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-300">Location</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="bg-zinc-950 border-zinc-700 text-zinc-50  focus:ring-orange-600/20"
                                                    placeholder="City, Country"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-orange-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-300">Website</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="bg-zinc-950 border-zinc-700 text-zinc-50  focus:ring-orange-600/20"
                                                    placeholder="https://yourwebsite.com"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-orange-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-300">Bio</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    className="bg-zinc-950 border-zinc-700 text-zinc-50 min-h-[100px]  focus:ring-orange-600/20"
                                                    placeholder="Tell us about yourself"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-orange-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-50">Notification Preferences</CardTitle>
                        <CardDescription className="text-zinc-400">Control which notifications you receive</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="notificationPreference.likes"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-zinc-300">Likes</FormLabel>
                                        <FormDescription className="text-xs text-zinc-400">
                                            Receive notifications when someone likes your content
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            className="data-[state=checked]:bg-orange-600"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Separator className="bg-zinc-800" />

                        <FormField
                            control={form.control}
                            name="notificationPreference.comments"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-zinc-300">Comments</FormLabel>
                                        <FormDescription className="text-xs text-zinc-400">
                                            Receive notifications when someone comments on your content
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            className="data-[state=checked]:bg-orange-600"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Separator className="bg-zinc-800" />

                        <FormField
                            control={form.control}
                            name="notificationPreference.follows"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-zinc-300">Follows</FormLabel>
                                        <FormDescription className="text-xs text-zinc-400">
                                            Receive notifications when someone follows you
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            className="data-[state=checked]:bg-orange-600"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-orange-600 text-zinc-50 hover:bg-orange-700">
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
