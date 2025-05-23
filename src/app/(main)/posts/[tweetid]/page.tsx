"use client";
import { Comment, Tweet, User } from "@/gql/graphql";
import { useGetTweet, usePaginatedCommentsByTweetId } from "@/hooks/tweets";
import { useCurrentUser } from "@/hooks/user";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import TweetPage from "./tweetPage";
import PostSkel from "@/components/global/Skeleton/PostSkeleton";

const Page: NextPage = ({ }) => {

  const { user: USER, isLoading } = useCurrentUser();
  const { tweetid } = useParams();
  const router = useRouter();
  const { tweet: currentTweet } = useGetTweet(tweetid as string || "");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loadingComments,
  } = usePaginatedCommentsByTweetId(tweetid as string || "");
  const [loading, setLoading] = useState(true);
  const [tweet, setTweet] = useState<Tweet | undefined>();
  const [user, setUser] = useState<User | undefined>();

  const fetchedComments = data?.pages.flatMap((page) => page.comments) ?? [];

  useEffect(() => {
    const scrollContainer = document.getElementById("scrollable-middle");

    const onScroll = () => {
      if (
        scrollContainer &&
        scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 300 &&
        hasNextPage
      ) {
        fetchNextPage();
      }
    };

    scrollContainer?.addEventListener("scroll", onScroll);

    return () => scrollContainer?.removeEventListener("scroll", onScroll);
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (USER == undefined && !isLoading) {
      router.push("/not_authorised");
    }
    if (currentTweet !== undefined) {
      setTweet(currentTweet as Tweet);
      setLoading(false);
    }
    if (USER !== undefined) {
      setUser(USER as User);
    }
  }, [currentTweet, USER, router, loading]);

  if (loading ) {
    return <PostSkel />;
  }
  if (!user) return null

  if (!tweet)
    return (
      <h1 className="text-center h-full flex justify-center items-center">
        Tweet Not Found
      </h1>
    );

  return (
    <div>
      <nav className="border flex items-center gap-8 px-3 py-2">
        <div
          className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-3 transition-all"
          onClick={() => {
            router.push("/");
          }}
        >
          <FaArrowLeftLong size={15} />
        </div>
        <div>
          <h1 className="font-bold text-xl">Post</h1>
        </div>
      </nav>
      <TweetPage hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage || loadingComments} comments={fetchedComments as Comment[]} tweet={tweet as Tweet} user={user as User} />
    </div>
  );
};
export default Page;
