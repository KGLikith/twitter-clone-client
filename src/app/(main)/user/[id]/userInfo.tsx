import React, { useCallback, useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2, Globe, LinkIcon, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import Search from "@/components/icons/search"
import MagnifyingNegative from "@/components/icons/magnifying-negative"
import MultipleUser from "@/components/icons/multipleUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GetUserByIdQuery, User } from '@/gql/graphql'
import { FollowUser, UnFollowUser } from '@/actions/follow_unfollow'
import { QueryObserverResult, RefetchOptions, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type Props = {
    user: User,
    currentUser: User
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<GetUserByIdQuery | undefined, Error>>
}

export default function UserInfo({ user, currentUser, refetch }: Props) {
    const queryClient = useQueryClient();
    const [buttonLoading, setButtonLoading] = useState(false)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [followersSearch, setFollowersSearch] = useState("")
    const [followingSearch, setFollowingSearch] = useState("")

    const filteredFollowers = useMemo(() => {
        return user?.followers?.filter((follower) => {
            const fullName = `${follower?.name}`.toLowerCase()
            const username = follower?.userName?.toLowerCase()
            const searchTerm = followersSearch.toLowerCase()
            return fullName.includes(searchTerm) || username?.includes(searchTerm)
        })
    }, [user?.followers, followersSearch])

    const filteredFollowing = useMemo(() => {
        return user?.following?.filter((following) => {
            const fullName = `${following?.name}`.toLowerCase()
            const username = following?.userName?.toLowerCase()
            const searchTerm = followingSearch.toLowerCase()
            return fullName.includes(searchTerm) || username?.includes(searchTerm)
        })
    }, [user?.following, followingSearch])

    const amIFollowing = useMemo(() => {
        const ind = currentUser?.following?.findIndex((el: { __typename?: "User"; id: string } | null) => {
            return el?.id === user?.id
        })
        if (ind == null) return false
        return ind >= 0
    }, [currentUser?.following, user])


    const handleFollowUser = useCallback(async () => await FollowUser(user?.id ?? "", setButtonLoading, queryClient), [user])

    const handleUnfollowUser = useCallback(async () => await UnFollowUser(user, setButtonLoading, queryClient), [user])

    const handleRemoveFollower = async (followerId: string) => {
        try {
            setActionLoading(followerId)

            // WIP: remove follower from the list of followers in the user object


            if (user && user.followers) {
                const updatedFollowers = user.followers.filter((follower) => follower?.id !== followerId)
            }

            toast.success("Follower removed successfully", {
                duration: 1000,
            })
        } catch (error) {
            toast.error("Failed to remove follower", {
                duration: 2000,
                description: "Please try again later",
            })
            console.log(error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleUnfollowFromList = async (followingId: string) => {
        try {
            setActionLoading(followingId)

            const userToUnfollow = user?.following?.find((following) => following?.id === followingId)

            if (userToUnfollow) {
                await UnFollowUser(userToUnfollow as User, () => { }, queryClient)
                refetch()
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to unfollow user.", {
                duration: 2000,
                description: "Please try again later",
            })
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <div className="p-4 border border-zinc-800 space-y-4 bg-zinc-950">
            <Avatar className="h-24 w-24 border-2 border-zinc-700 rounded-full overflow-hidden">
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

            <div>
                <h1 className="text-xl font-bold text-zinc-100">{user?.name}</h1>
                <p className="text-zinc-500">@{user?.userName}</p>
            </div>

            {user.bio && (
                <p className="text-zinc-300 line-clamp-1 hover:line-clamp-none transition-all cursor-pointer">{user.bio}</p>
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
                <div className="flex items-center gap-6 text-zinc-500">
                    <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
                        <DialogTrigger asChild>
                            <button className="flex flex-col items-center hover:text-orange-500 transition-colors">
                                <p className="font-bold text-white">{user.following?.length || 0}</p>
                                <span className="text-sm">Following</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-md max-h-[80vh]">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-zinc-100">Following</DialogTitle>
                            </DialogHeader>
                            <div className="relative mb-4 mt-2">
                                <input
                                    type="text"
                                    placeholder="Search following..."
                                    value={followingSearch}
                                    onChange={(e) => setFollowingSearch(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 pl-10"
                                />
                                <div className="absolute left-3 top-2.5 text-zinc-400">
                                    <Search />
                                </div>
                            </div>
                            <ScrollArea className="h-[60vh] pr-4">
                                <div className="space-y-3 mt-2">
                                    {filteredFollowing && filteredFollowing.length > 0 ? (
                                        filteredFollowing.map((following) => (
                                            <div
                                                key={following?.id}
                                                className="flex items-center justify-between p-3 hover:bg-zinc-800/70 rounded-xl transition-colors"
                                            >
                                                <Link
                                                    href={`/user/${following?.id}`}
                                                    onClick={() => setShowFollowing(false)}
                                                    className="flex items-center gap-3 flex-1"
                                                >
                                                    <Avatar className="h-12 w-12 border-2 border-zinc-700 rounded-full overflow-hidden">
                                                        <AvatarImage
                                                            src={following?.profileImageUrl?.startsWith("/") ? process.env.NEXT_PUBLIC_CDN_URL + following.profileImageUrl : following?.profileImageUrl || "/user.png"}
                                                            alt="Profile"
                                                            className="object-cover"
                                                        />
                                                        <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl flex items-center justify-center">
                                                            {following?.userName?.slice(1)[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-zinc-100 truncate">{following?.name}</p>
                                                        <p className="text-sm text-zinc-400 truncate">@{following?.userName}</p>
                                                        {following?.bio && (
                                                            <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{following.bio}</p>
                                                        )}
                                                    </div>
                                                </Link>
                                                {currentUser?.id === user.id && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="ml-2 border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-full"
                                                        onClick={() => handleUnfollowFromList(following?.id || "")}
                                                        disabled={actionLoading === following?.id}
                                                    >
                                                        {actionLoading === following?.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            "Unfollow"
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-zinc-400 py-8 flex flex-col items-center">
                                            {followingSearch ? (
                                                <>
                                                    <MagnifyingNegative />
                                                    <p>No results found for "{followingSearch}"</p>
                                                </>
                                            ) : (
                                                <>
                                                    <MultipleUser />
                                                    <p className="font-medium">Not following anyone yet</p>
                                                    <p className="text-sm text-zinc-500 mt-1">
                                                        When this account follows people, they'll appear here.
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
                        <DialogTrigger asChild>
                            <button className="flex flex-col items-center hover:text-orange-500 transition-colors">
                                <p className="font-bold text-white">{user.followers?.length || 0}</p>
                                <span className="text-sm">
                                    {user.followers?.length && user.followers?.length > 1 ? "Followers" : "Follower"}
                                </span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-md max-h-[80vh]">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-zinc-100">Followers</DialogTitle>
                            </DialogHeader>
                            <div className="relative mb-4 mt-2">
                                <input
                                    type="text"
                                    placeholder="Search followers..."
                                    value={followersSearch}
                                    onChange={(e) => setFollowersSearch(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 pl-10"
                                />
                                <div className="absolute left-3 top-2.5 text-zinc-400">
                                    <Search />

                                </div>
                            </div>
                            <ScrollArea className="h-[60vh] pr-4">
                                <div className="space-y-3 mt-2">
                                    {filteredFollowers && filteredFollowers.length > 0 ? (
                                        filteredFollowers.map((follower) => (
                                            <div
                                                key={follower?.id}
                                                className="flex items-center justify-between p-3 hover:bg-zinc-800/70 rounded-xl transition-colors"
                                            >
                                                <Link
                                                    href={`/user/${follower?.id}`}
                                                    onClick={() => setShowFollowers(false)}
                                                    className="flex items-center gap-3 flex-1"
                                                >
                                                    <Avatar className="h-12 w-12 border-2 border-zinc-700 rounded-full overflow-hidden">
                                                        <AvatarImage
                                                            src={follower?.profileImageUrl?.startsWith("/") ? process.env.NEXT_PUBLIC_CDN_URL + follower.profileImageUrl : follower?.profileImageUrl || "/user.png"}

                                                            alt="Profile"
                                                            className="object-cover"
                                                        />
                                                        <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl flex items-center justify-center">
                                                            {follower?.userName?.slice(1)[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-zinc-100 truncate">{follower?.name}</p>
                                                        <p className="text-sm text-zinc-400 truncate">@{follower?.userName}</p>
                                                        {follower?.bio && (
                                                            <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{follower.bio}</p>
                                                        )}
                                                    </div>
                                                </Link>
                                                {currentUser?.id === user.id && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="ml-2 border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-full"
                                                        onClick={() => handleRemoveFollower(follower?.id || "")}
                                                        disabled={actionLoading === follower?.id}
                                                    >
                                                        {actionLoading === follower?.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            "Remove"
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-zinc-400 py-8 flex flex-col items-center">
                                            {followersSearch ? (
                                                <>
                                                    <MagnifyingNegative />
                                                    <p>No results found for "{followersSearch}"</p>
                                                </>
                                            ) : (
                                                <>
                                                    <MultipleUser />
                                                    <p className="font-medium">No followers yet</p>
                                                    <p className="text-sm text-zinc-500 mt-1">
                                                        When people follow this account, they'll appear here.
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
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