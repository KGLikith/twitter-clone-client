"use client"

import PostSkel from "@/components/global/Skeleton/PostSkeleton"
import type { Bookmark, BookmarkEntry, Comment, User } from "@/gql/graphql"
import { useCurrentUser, useGetBookmarks } from "@/hooks/user"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, BookmarkIcon } from "lucide-react"
import CommentFile from "@/components/_components/Comment/Comment_card"
import FeedCard from "@/components/_components/FeedCard"
import { useRouter } from "next/navigation"
import Skel from "@/components/global/Skeleton/Skeleton"

export default function Bookmarks() {
  const { user, isLoading: userLoading } = useCurrentUser()
  const { bookmarks, isLoading, refetch } = useGetBookmarks()
  const [bmarks, setBmarks] = useState<Bookmark | undefined>()
  const router = useRouter();

  useEffect(() => {
    if (bookmarks) {
      setBmarks(bookmarks as Bookmark)
    }
  }, [bookmarks])

  if (isLoading || userLoading) {
    return (
      <>
        <Skel />
        <Skel />
        <Skel />
        <Skel />
      </>
    )
  }

  if (!user) {
    return (
      <div className="h-screen w-full my-2 mx-2 flex justify-center items-center">
        <h1 className="font-bold text-2xl">
          You are not logged in. Go to{" "}
          <Link className="text-blue-600" href={"/"}>
            home
          </Link>
        </h1>
      </div>
    )
  }

  return (
    <div className="w-full">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 py-3 sticky top-0 bg-white dark:bg-black z-10">
        <div className="flex items-center gap-4">
          <div
            className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-2 transition-all cursor-pointer"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={18} className="text-zinc-800 dark:text-zinc-300" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl text-zinc-900 dark:text-zinc-100">Bookmarks</h1>
          </div>
        </div>

      </nav>

      {bmarks?.bookmarks?.length === 0 ? (
        <div className="h-screen flex flex-col items-center justify-center py-16 px-4 text-center">
          <BookmarkIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-white">You haven't added any Bookmarks yet</h2>
          <p className="text-gray-400 max-w-sm">When you do, they'll show up here for easy access.</p>
        </div>
      ) : (
        <div className="">
          {bmarks?.bookmarks?.filter((bookmark): bookmark is BookmarkEntry => bookmark !== null).map((bookmark) => (
            <div key={bookmark.id}>
              {bookmark?.type === "TWEET" && bookmark.tweet && <FeedCard tweet={bookmark.tweet} user={user as User} />}
              {bookmark?.type === "COMMENT" && bookmark.comment && bookmark.comment.tweet && (
                <BookmarkedComment comment={bookmark.comment} user={user as User} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BookmarkedComment({ comment, user }: { comment: Comment, user: User }) {
  if (!comment.tweet) {
    return null
  }

  return (
    <div className="">
      <CommentFile isBookmark={true} comment={comment} user={user} tweet={comment.tweet} />
    </div>
  )
}
