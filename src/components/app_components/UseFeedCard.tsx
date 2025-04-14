"use client"
import React, { useEffect, useState } from "react";
import FeedCard from "../normal_comp/FeedCard";
import { useGetAllTweets } from "@/hooks/tweets";
import { Tweet, User } from "@/gql/graphql";
import Skeleton from "../global/Skeleton/Skeleton";
import { useCurrentUser } from "@/hooks/user";

const UseFeedCard = () => {
  const { user: currentUser } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState<Tweet[] | undefined>();
  const { tweets: currentTweets, isLoading } = useGetAllTweets(currentUser?.id ?? "");
  useEffect(() => {
    if (currentTweets) {
      setTweets(currentTweets as Tweet[]);
    } else {
      setTweets([]);
    }
    setLoading(false);
  }, [currentTweets])

  if (loading) {
    return <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  }

  if (!isLoading && currentTweets && currentTweets.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10 h-full w-full flex items-center justify-center p-2">
        🐦 No posts to show just yet. Follow others or share something to get started!
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {tweets?.map((tweet) => (
        tweet && <FeedCard key={tweet.id} tweet={tweet} user={currentUser as User} />
      ))}
    </div>
  );
};

export default UseFeedCard;
