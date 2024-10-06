"use client"
import React, { useEffect, useState } from "react";
import FeedCard from "../normal_comp/FeedCard";
import { useGetAllTweets } from "@/hooks/tweets";
import { Tweet } from "@/gql/graphql";
import Skeleton from "../normal_comp/Skeleton";

const UseFeedCard = () => {
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState<Tweet[] | undefined>();
  const { tweets: currentTweets } = useGetAllTweets();

  useEffect(()=>{
    if(currentTweets ){
        setTweets(currentTweets as Tweet[]);
        setLoading(false);
    }
  },[currentTweets])
  if(loading){
    return <Skeleton />
  }

  return (
    <div className="min-h-screen ">
      {tweets?.map((tweet) => (
        tweet && <FeedCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};

export default UseFeedCard;