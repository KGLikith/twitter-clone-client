"use client"
import { FollowUser, UnFollowUser } from "@/actions/follow_unfollow"
import FeedCard from "@/components/normal_comp/FeedCard"
import Skel from "@/components/global/Skeleton/Skeleton"
import { Button } from "@/components/ui/button"
import type { Tweet, User } from "@/gql/graphql"
import { useCurrentUser, useCurrentUserById } from "@/hooks/user"
import { Loader2, Globe, LinkIcon, Calendar } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FaArrowLeftLong } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { useGetUserTweets } from "@/hooks/tweets"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"

interface UserProfilePageProps {
  id: string
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ id }) => {
  const router = useRouter()
  const queryClient = useQueryClient();
  const { user: USER, isLoading } = useCurrentUser()
  const { user: currentUser, refetch } = useCurrentUserById(id)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | undefined>()
  const [buttonLoading, setButtonLoading] = useState(false)
  const { userTweets } = useGetUserTweets(id)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [followersSearch, setFollowersSearch] = useState("")
  const [followingSearch, setFollowingSearch] = useState("")

  const filteredFollowers = useMemo(() => {
    return user?.followers?.filter((follower) => {
      const fullName = `${follower?.firstName} ${follower?.lastName}`.toLowerCase()
      const username = (follower?.userName || `${follower?.firstName}${follower?.lastName}`).toLowerCase()
      const searchTerm = followersSearch.toLowerCase()
      return fullName.includes(searchTerm) || username.includes(searchTerm)
    })
  }, [user?.followers, followersSearch])

  const filteredFollowing = useMemo(() => {
    return user?.following?.filter((following) => {
      const fullName = `${following?.firstName} ${following?.lastName}`.toLowerCase()
      const username = (following?.userName || `${following?.firstName}${following?.lastName}`).toLowerCase()
      const searchTerm = followingSearch.toLowerCase()
      return fullName.includes(searchTerm) || username.includes(searchTerm)
    })
  }, [user?.following, followingSearch])

  console.log(currentUser)

  const amIFollowing = useMemo(() => {
    const ind = USER?.following?.findIndex((el: { __typename?: "User"; id: string } | null) => {
      return el?.id === user?.id
    })
    if (ind == null) return false
    return ind >= 0
  }, [USER?.following, user])

  useEffect(() => {
    if (!USER && !isLoading) router.push("/not_authorised")
    if (!isLoading) {
      if (USER?.id === id) setUser(USER as User)
    }
    if (currentUser !== undefined) {
      setUser(currentUser as User)
      setLoading(false)
    }
  }, [currentUser, USER, isLoading])

  useEffect(() => {
    if (userTweets) {
      setTweets(userTweets.filter((tweet): tweet is Tweet => tweet !== null))
    }
  }, [userTweets])

  const handleFollowUser = useCallback(() => FollowUser(user?.id ?? "", setButtonLoading, queryClient), [user])

  const handleUnfollowUser = useCallback(() => UnFollowUser(user, setButtonLoading,queryClient), [user])

  const handleRemoveFollower = async (followerId: string) => {
    try {
      setActionLoading(followerId)
      // Implement your remove follower action here
      // This would typically be an API call to remove the follower

      // For demonstration, let's assume we have a function called removeFollower
      // await removeFollower(followerId);

      // Update the UI by filtering out the removed follower
      if (user && user.followers) {
        const updatedFollowers = user.followers.filter((follower) => follower?.id !== followerId)
        setUser({
          ...user,
          followers: updatedFollowers,
        } as User)
      }

      toast({
        title: "Follower removed",
        description: "This user will no longer follow you",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to remove follower",
        description: "Please try again later",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnfollowFromList = async (followingId: string) => {
    try {
      setActionLoading(followingId)

      const userToUnfollow = user?.following?.find((following) => following?.id === followingId)

      if (userToUnfollow) {
        await UnFollowUser(userToUnfollow as User, () => {}, queryClient)
        refetch()
        // if (user && user.following) {
        //   const updatedFollowing = user.following.filter((following) => following?.id !== followingId)
        //   console.log(updatedFollowing)
        //   setUser({
        //     ...user,
        //     following: updatedFollowing,
        //   } as User)
        // }
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Failed to unfollow user",
        description: "Please try again later",
      })
    } finally {
      setActionLoading(null)
    }
  }

  if (loading || isLoading) {
    return <Skel />
  }
  if (!USER || USER == undefined) return null
  if (!user)
    return <h1 className="text-center h-full flex justify-center items-center">Page Not Done Yet or User Not Found</h1>

  return (
    <>
      <div>
        <nav className="border border-zinc-800 flex items-center gap-8 px-3 py-1 bg-zinc-950">
          <div
            className="hover:bg-zinc-800 rounded-full p-3 transition-all cursor-pointer"
            onClick={() => {
              router.push("/")
            }}
          >
            <FaArrowLeftLong size={15} className="text-zinc-300" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-zinc-100">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-zinc-500">
              {tweets?.length ?? 0} {tweets && tweets.length > 1 ? "posts" : "post"}
            </p>
          </div>
        </nav>
        <div className="p-4 border border-zinc-800 space-y-4 bg-zinc-950">
          <div className="flex justify-between">
            {user?.profileImageUrl && (
              <Image
                src={user.profileImageUrl || "/placeholder.svg"}
                alt="Profile Image"
                className="rounded-full border-2 border-zinc-700"
                width={100}
                height={100}
                quality={75}
                priority={true}
                onError={(err) => {
                  console.log(err)
                }}
              />
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-zinc-100">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-zinc-500">@{user?.userName || `${user?.firstName}${user?.lastName}`}</p>
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
                  <button className="flex gap-1 hover:underline">
                    <p className="font-bold text-white">{user.following?.length || 0}</p>
                    Following
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-md max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="text-zinc-200">Following</DialogTitle>
                  </DialogHeader>
                  <div className="mb-4 mt-2">
                    <input
                      type="text"
                      placeholder="Search following..."
                      value={followingSearch}
                      onChange={(e) => setFollowingSearch(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4 mt-2">
                      {filteredFollowing && filteredFollowing.length > 0 ? (
                        filteredFollowing.map((following) => (
                          <div
                            key={following?.id}
                            className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                          >
                            <Link
                              href={`/user/${following?.id}`}
                              onClick={() => setShowFollowing(false)}
                              className="flex items-center gap-3"
                            >
                              {following?.profileImageUrl && (
                                <Image
                                  src={following.profileImageUrl || "/placeholder.svg"}
                                  alt={`${following.firstName} ${following.lastName}`}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              )}
                              <div>
                                <p className="font-semibold text-zinc-100">
                                  {following?.firstName} {following?.lastName}
                                </p>
                                <p className="text-sm text-zinc-400">
                                  @{following?.userName || `${following?.firstName}${following?.lastName}`}
                                </p>
                                {following?.bio && (
                                  <p className="text-sm text-zinc-500 line-clamp-1">{following.bio}</p>
                                )}
                              </div>
                            </Link>
                            {USER?.id === user.id && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-2 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
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
                        <p className="text-center text-zinc-400 py-4">
                          {followingSearch ? "No results found" : "No following yet"}
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
                <DialogTrigger asChild>
                  <button className="flex gap-1 hover:underline">
                    <p className="font-bold text-white">{user.followers?.length || 0}</p>
                    {user.followers?.length && user.followers?.length > 1 ? "Followers" : "Follower"}
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-md max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="text-zinc-200">Followers</DialogTitle>
                  </DialogHeader>
                  <div className="mb-4 mt-2">
                    <input
                      type="text"
                      placeholder="Search followers..."
                      value={followersSearch}
                      onChange={(e) => setFollowersSearch(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4 mt-2">
                      {filteredFollowers && filteredFollowers.length > 0 ? (
                        filteredFollowers.map((follower) => (
                          <div
                            key={follower?.id}
                            className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                          >
                            <Link
                              href={`/user/${follower?.id}`}
                              onClick={() => setShowFollowers(false)}
                              className="flex items-center gap-3"
                            >
                              {follower?.profileImageUrl && (
                                <Image
                                  src={follower.profileImageUrl || "/placeholder.svg"}
                                  alt={`${follower.firstName} ${follower.lastName}`}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-zinc-100">
                                    {follower?.firstName} {follower?.lastName}
                                  </p>
                                  <p className="text-sm text-zinc-400">
                                    @{follower?.userName || `${follower?.firstName}${follower?.lastName}`}
                                  </p>
                                </div>
                                {follower?.bio && <p className="text-sm text-zinc-500 line-clamp-1">{follower.bio}</p>}
                              </div>
                            </Link>
                            {USER?.id === user.id && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-2 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
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
                        <p className="text-center text-zinc-400 py-4">
                          {followersSearch ? "No results found" : "No followers yet"}
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            {USER?.id !== user.id ? (
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

        <div className="border-t border-zinc-800 bg-zinc-950">
          {tweets && tweets.length > 0 ? (
            tweets
              .filter((tweet): tweet is Tweet => tweet !== null)
              .map((tweet: Tweet) => {
                return <FeedCard key={tweet.id} tweet={tweet} user={USER as User} />
              })
          ) : (
            <div className="py-10 text-center text-zinc-500">
              <p className="text-xl font-semibold">No posts yet</p>
              <p className="mt-2">When they post, their posts will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default UserProfilePage
