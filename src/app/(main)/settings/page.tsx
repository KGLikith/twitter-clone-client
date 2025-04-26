"use client"

import { apolloClient } from "@/clients/api"
import UserSettingsForm from "@/components/global/forms/User-settings"
import SettingsSkel from "@/components/global/Skeleton/SettingsSkel"
import type { UpdateUserData, User } from "@/gql/graphql"
import { updateUserMutation } from "@/graphql/mutation/user"
import { useCurrentUser } from "@/hooks/user"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Settings() {
    const { user: currentUser, isLoading } = useCurrentUser()
    const router = useRouter()
    const [user, setUser] = useState<User | undefined>()
    const queryCLient = useQueryClient();

    useEffect(() => {
        if (currentUser) setUser(currentUser as User)
        else setUser(undefined)
    }, [currentUser])

    const handleSaveSettings = async (userData: UpdateUserData) => {
        try {
            if (!user) return
            const { data } = await apolloClient.mutate({
                mutation: updateUserMutation,
                variables: {
                    payload: {
                        ...userData
                    }
                },
            })
            if(!data?.updateUser || !data?.updateUser?.updated) {
                toast.error("Error updating profile",{
                    duration: 1000,
                    description: "There was an error updating your settings. Please try again.",
                })
                return;
            }
            await apolloClient.resetStore()
            await queryCLient.invalidateQueries({ queryKey: ["currentUser"] })
            await queryCLient.invalidateQueries({ queryKey: ["currentUserById", user.id] })
            await queryCLient.invalidateQueries({ queryKey: ["userTweets", user.id] })

            if(data.updateUser?.success) {
                toast.success("Profile Updated",{
                    duration: 1000,
                    description: "Your profile settings have been updated successfully.",
                })
            }

            toast.info( "Profile updated", {
                description: data.updateUser?.message,
                duration: 1000,
            })
        } catch (error) {
            console.log("error", error)
            toast.error("Error updating settings", {
                duration: 1000,
                description: "There was an error updating your settings. Please try again.",
            })
        }
    }

    if (isLoading) {
        return <>
            <div className="h-full w-full">
                <SettingsSkel />
            </div>
        </>
    }

    return (
        <div className="flex flex-col h-full bg-black text-white">
            <nav className="border-b border-zinc-800 flex items-center gap-4 px-4 py-3 sticky top-0 bg-black z-10">
                <div
                    className="hover:bg-zinc-800 rounded-full p-2 transition-all cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <ArrowLeft size={18} className="text-zinc-300" />
                </div>
                <div className="flex items-center gap-2">
                    <h1 className="font-bold text-xl text-zinc-100">Settings</h1>
                </div>
            </nav>

            <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto w-full">
                <UserSettingsForm user={user} onSave={handleSaveSettings} />
            </div>
        </div>
    )
}
