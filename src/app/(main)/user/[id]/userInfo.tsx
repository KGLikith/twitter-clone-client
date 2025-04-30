import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2, Globe, LinkIcon, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GetUserByIdQuery, User } from '@/gql/graphql'
import { FollowUser, UnFollowUser } from '@/actions/follow_unfollow'
import { QueryObserverResult, RefetchOptions, useQueryClient } from '@tanstack/react-query'
import DialogFollow from '@/components/_components/dialog-follow'

type Props = {
    user: User,
    currentUser: User
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<GetUserByIdQuery | undefined, Error>>
}

export default function UserInfo({ user, currentUser, refetch }: Props) {
    const queryClient = useQueryClient();
    const [buttonLoading, setButtonLoading] = useState(false)

    const amIFollowing = useMemo(() => {
        const ind = currentUser?.following?.findIndex((el) => {
            return el === user?.id
        })
        if (ind == null) return false
        return ind >= 0
    }, [currentUser?.following, user])


    const handleFollowUser = useCallback(async () => await FollowUser(currentUser.id,user.id, setButtonLoading, queryClient), [user])

    const handleUnfollowUser = useCallback(async () => await UnFollowUser(currentUser.id,user.id, setButtonLoading, queryClient), [user])

    return (
        <div className="p-4 border border-zinc-800 space-y-4 bg-zinc-950">
            <Avatar className="h-24 w-24 border-2 border-zinc-700 rounded-full overflow-hidden">
                <AvatarImage
                    src={user.profileImageUrl?`${process.env.NEXT_PUBLIC_CDN_URL || ""}${user.profileImageUrl}` : "/user.png"}
                    alt="Profile"
                    className="object-cover"
                />
                <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl flex items-center justify-center">
                    {user.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div>
                <h1 className="text-xl font-bold text-zinc-100">{user?.name}</h1>
                <p className="text-zinc-500">@{user?.userName}</p>
            </div>

            {user.bio && (
                <p className="text-zinc-300  transition-all cursor-pointer">{user.bio}</p>
            )}

            <div className="flex gap-2 text-zinc-400 text-sm">
                {user.location && (
                    <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-zinc-500" />
                        <span>{user.location}</span>
                    </div>
                )}

                {user.website && (
                    <div className="flex items-center gap-1">
                        <LinkIcon className="h-4 w-4 text-zinc-500" />
                        <a
                            href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:underline"
                        >
                            {user.website}
                        </a>
                    </div>
                )}

                {user.createdAt && (
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-zinc-500" />
                        <span>
                            Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between gap-6">

                <DialogFollow userId={user.id} currentUserId={currentUser.id} />

                {currentUser?.id !== user.id ? (
                    <div>
                        {buttonLoading ? (
                            <Button disabled className="rounded-full font-bold px-4 py-1">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <>
                                {amIFollowing ? (
                                    <Button
                                        variant={"default"}
                                        className="rounded-full text-zinc-100 font-bold px-4 py-1 bg-orange-600 hover:bg-orange-700"
                                        onClick={handleUnfollowUser}
                                    >
                                        Unfollow
                                    </Button>
                                ) : (
                                    <Button
                                        variant={"default"}
                                        className="rounded-full text-zinc-100 font-bold px-4 py-1 bg-orange-600 hover:bg-orange-700"
                                        onClick={handleFollowUser}
                                    >
                                        Follow
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    )
}