"use client"
import React, { useEffect } from "react";
import FeedCard from "../_components/FeedCard";
import { usePaginatedTweets } from "@/hooks/tweets";
import { Tweet, User } from "@/gql/graphql";
import Skeleton from "../global/Skeleton/Skeleton";
import { useCurrentUser } from "@/hooks/user";

const UseFeedCard = () => {
  const { user: currentUser } = useCurrentUser();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePaginatedTweets();

  const allTweets = data?.pages.flatMap((page) => page.tweets) ?? [];

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

  if (isLoading) {
    return <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  }

  if (!isLoading && allTweets && allTweets.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10 h-full w-full flex items-center justify-center p-2">
        🐦 No posts to show just yet. Share something to get started!
      </div>
    );
  }

  return (
    <div className="h-full">
      {allTweets?.map((tweet) => (
        tweet && <FeedCard key={tweet.id} tweet={tweet as Tweet} user={currentUser as User} />
      ))}
      {(isFetchingNextPage || hasNextPage) && (
        <>
          <Skeleton />
          <Skeleton />
        </>
      )}
      {!hasNextPage && !isFetchingNextPage && allTweets.length > 5 && (
        <div className="text-center text-gray-500 py-6">
          You’ve reached the end of the feed!
        </div>
      )}
    </div>
  );
};

export default UseFeedCard;
