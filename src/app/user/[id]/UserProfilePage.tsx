"use client"
import type React from "react"
import FeedCard from "@/components/_components/FeedCard"
import type { Tweet, User } from "@/gql/graphql"
import { useCurrentUser, useCurrentUserById } from "@/hooks/user"
import { useEffect, useState } from "react"
import { FaArrowLeftLong } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import {  useUserPaginatedTweets } from "@/hooks/tweets"
import UserInfo from "./userInfo" 
import { Skeleton } from "@/components/ui/skeleton"
import UserSkel from "@/components/global/Skeleton/UserSkeleton"

interface UserProfilePageProps {
  id: string
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ id }) => {
  const router = useRouter()
  const { user: USER, isLoading } = useCurrentUser()
  const { user: currentUser, refetch } = useCurrentUserById(id)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: TweetsLoading } = useUserPaginatedTweets(id)
  const [user, setUser] = useState<User | undefined>()

  const userTweets = data?.pages.flatMap((page) => page.tweets) ?? []

  useEffect(() => {
    const scrollContainer = document.getElementById("scrollable-middle");

    const onScroll = () => {
      if (
        scrollContainer &&
        scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight  &&
        hasNextPage
      ) {
        fetchNextPage();
      }
    };

    scrollContainer?.addEventListener("scroll", onScroll);

    return () => scrollContainer?.removeEventListener("scroll", onScroll);
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser as User)
    }
  }, [currentUser])

  useEffect(() => {
    if (!USER && !isLoading) router.push("/not_authorised")
  }, [USER, isLoading])

  if (isLoading) {
    return <>
      <UserSkel />
    </>
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
            <h1 className="font-bold text-xl text-zinc-100">{user?.name}</h1>
            <p className="text-sm text-zinc-500">
              {userTweets?.length ?? 0} {userTweets && userTweets.length > 1 ? "posts" : "post"}
            </p>
          </div>
        </nav>

        <UserInfo user={user} currentUser={USER as User} refetch={refetch}></UserInfo>

        {
          TweetsLoading &&
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        }

        <div className="border-t border-zinc-800 bg-zinc-950">
          {userTweets && userTweets.length > 0 ? (
            userTweets
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
          {(isFetchingNextPage || hasNextPage) && (
            <>
              <Skeleton />
              <Skeleton />
            </>
          )}
          {!hasNextPage && !isFetchingNextPage && userTweets.length > 0 && (
            <div className="text-center text-gray-500 py-6">
              You’ve reached the end of the feed!
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default UserProfilePage
