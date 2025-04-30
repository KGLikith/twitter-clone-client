"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import Search from "@/components/icons/search"
import MagnifyingNegative from "@/components/icons/magnifying-negative"
import MultipleUser from "@/components/icons/multipleUser"
import { useGetFollowers, useGetFollowing } from "@/hooks/user"
import { toast } from "sonner"
import { UnFollowUser } from "@/actions/follow_unfollow"
import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Skel from "../global/Skeleton/Skeleton"

type Props = {
  userId: string
  currentUserId: string
}

export default function DialogFollow({ userId, currentUserId }: Props) {
  const {
    data: fwers,
    fetchNextPage: followersFetchNextPage,
    hasNextPage: followersHasNextPage,
    isFetchingNextPage: isFetchingFollowersNextPage,
    isLoading: followerLoading,
  } = useGetFollowers(userId)
  const {
    data: fwing,
    fetchNextPage: followingsFetchNextPage,
    hasNextPage: followingsHasNextPage,
    isFetchingNextPage: IsFetchingFollowingsNextPage,
    isLoading: followingLoading,
  } = useGetFollowing(userId)
  const queryClient = useQueryClient()
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followersSearch, setFollowersSearch] = useState("")
  const [followingSearch, setFollowingSearch] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const followersScrollRef = useRef<HTMLDivElement | null>(null)
  const followingScrollRef = useRef<HTMLDivElement | null>(null)

  const followers = fwers?.pages.flatMap((page) => page.users) ?? []
  const following = fwing?.pages.flatMap((page) => page.users) ?? []

  useEffect(() => {
    const container = followingScrollRef.current
    const handleScroll = () => {
      if (
        container &&
        container.scrollTop + container.clientHeight >= container.scrollHeight - 300 &&
        followingsHasNextPage &&
        !IsFetchingFollowingsNextPage
      ) {
        followingsFetchNextPage()
      }
    }

    container?.addEventListener("scroll", handleScroll)
    return () => container?.removeEventListener("scroll", handleScroll)
  }, [followingsHasNextPage, followingsFetchNextPage, IsFetchingFollowingsNextPage])

  useEffect(() => {
    const container = followersScrollRef.current
    const handleScroll = () => {
      if (
        container &&
        container.scrollTop + container.clientHeight >= container.scrollHeight - 300 &&
        followersHasNextPage &&
        !isFetchingFollowersNextPage
      ) {
        followersFetchNextPage()
      }
    }

    container?.addEventListener("scroll", handleScroll)
    return () => container?.removeEventListener("scroll", handleScroll)
  }, [followersHasNextPage, followersFetchNextPage, isFetchingFollowersNextPage])

  const filteredFollowers = useMemo(() => {
    return followers?.filter((follower) => {
      const fullName = `${follower?.name}`.toLowerCase()
      const username = follower?.userName?.toLowerCase()
      const searchTerm = followersSearch.toLowerCase()
      return fullName.includes(searchTerm) || username?.includes(searchTerm)
    })
  }, [followers, followersSearch])

  const filteredFollowing = useMemo(() => {
    return following?.filter((following) => {
      const fullName = `${following?.name}`.toLowerCase()
      const username = following?.userName?.toLowerCase()
      const searchTerm = followingSearch.toLowerCase()
      return fullName.includes(searchTerm) || username?.includes(searchTerm)
    })
  }, [following, followingSearch])

  const handleRemoveFollower = async (followerId: string) => {
    try {
      setActionLoading(followerId)
      await UnFollowUser(followerId, currentUserId, () => {}, queryClient)

    //   toast.success("Follower removed successfully", {
    //     duration: 1000,
    //   })
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

      await UnFollowUser(currentUserId, followingId, () => {}, queryClient)
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
    <div className="flex items-center gap-6 text-zinc-500">
      <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
        <DialogTrigger asChild>
          <button className="flex flex-col items-center hover:text-orange-500 transition-colors">
            <p className="font-bold text-white">{following?.length || 0}</p>
            <span className="text-sm">Following</span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-950 border border-zinc-700 text-white max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-100">Following</DialogTitle>
          </DialogHeader>
          <div className="relative mb-1 mt-1">
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
          <ScrollArea className="h-[60vh] pr-4" ref={followingScrollRef}>
            <div className="space-y-1 mt-2">
              {filteredFollowing && filteredFollowing.length > 0 ? (
                filteredFollowing.map((following) => (
                  <div
                    key={following?.id}
                    className="flex items-center justify-between p-2 hover:bg-zinc-800/70 rounded-xl transition-colors"
                  >
                    <Link
                      href={`/user/${following?.id}`}
                      onClick={() => setShowFollowing(false)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <Avatar className="h-10 w-10 border-2 border-zinc-700 rounded-full overflow-hidden">
                        <AvatarImage
                          src={
                            following.profileImageUrl
                              ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${following.profileImageUrl}`
                              : "/user.png"
                          }
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
                        {/* {following?.bio && <p className="text-sm text-zinc-500 line-clamp-1 mt-1">{following.bio}</p>} */}
                      </div>
                    </Link>
                    {currentUserId === userId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-full"
                        onClick={() => handleUnfollowFromList(following?.id || "")}
                        disabled={actionLoading === following?.id}
                      >
                        {actionLoading === following?.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Unfollow"}
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
            {(IsFetchingFollowingsNextPage || followingLoading) && (
              <>
                <Skel />
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
        <DialogTrigger asChild>
          <button className="flex flex-col items-center hover:text-orange-500 transition-colors">
            <p className="font-bold text-white">{followers?.length || 0}</p>
            <span className="text-sm">{followers?.length && followers?.length > 1 ? "Followers" : "Follower"}</span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-950 border border-zinc-700 text-white max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-100">Followers</DialogTitle>
          </DialogHeader>
          <div className="relative mb-1 mt-1">
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
          <ScrollArea className="h-[60vh] pr-4" ref={followersScrollRef}>
            <div className="space-y-1 mt-2">
              {filteredFollowers && filteredFollowers.length > 0 ? (
                filteredFollowers.map((follower) => (
                  <div
                    key={follower?.id}
                    className="flex items-center justify-between p-2 hover:bg-zinc-800/70 rounded-xl transition-colors"
                  >
                    <Link
                      href={`/user/${follower?.id}`}
                      onClick={() => setShowFollowers(false)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <Avatar className="h-10 w-10 border-2 border-zinc-700 rounded-full overflow-hidden">
                        <AvatarImage
                          src={
                            follower.profileImageUrl
                              ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${follower.profileImageUrl}`
                              : "/user.png"
                          }
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
                        {/* {follower?.bio && <p className="text-sm text-zinc-500 line-clamp-1 mt-1">{follower.bio}</p>} */}
                      </div>
                    </Link>
                    {currentUserId === userId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-full"
                        onClick={() => handleRemoveFollower(follower?.id || "")}
                        disabled={actionLoading === follower?.id}
                      >
                        {actionLoading === follower?.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Remove"}
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
            {(isFetchingFollowersNextPage || followerLoading) && (
              <>
                <Skel />
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
