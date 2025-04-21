import { apolloClient } from "@/clients/api";
import { Tweet } from "@/gql/graphql";
import {
  likeCommentMutation,
  likeTweetMutation,
  unlikeCommentMutation,
  unlikeTweetMutation,
} from "@/graphql/mutation/tweet";
import { createNotificationMutation } from "@/graphql/mutation/user";
import { toast } from "@/hooks/use-toast";
import { QueryClient } from "@tanstack/react-query";
import { runTypedMutation } from "./helperFxns";

export const dislike = async (
  userId: string,
  tweet: Tweet,
  setLiked: (liked: boolean) => void,
  liked: boolean,
  queryclient: QueryClient
) => {
  if (!userId) {
    return toast({
      variant: "destructive",
      description: "Please login to like the tweet",
    });
  }

  try {
    if (!liked) return;
    setLiked(false);
    const { data, errors } = await apolloClient.mutate({
      mutation: unlikeTweetMutation,
      variables: { tweetId: tweet.id },
    });
    if (!data?.UnlikeTweet || errors) {
      setLiked(true);
      return;
    }
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["tweets"] });
    await queryclient.invalidateQueries({
      queryKey: ["userTweets", tweet.user.id],
    });
    await queryclient.invalidateQueries({
      queryKey: ["tweet", tweet.id],
    });
    await queryclient.invalidateQueries({
      queryKey: ["bookmarks"],
    });
  } catch (error) {
    toast({
      variant: "destructive",
      description: "There was an error. Please try again",
    });
  }
};

export const like = async (
  userId: string,
  tweet: Tweet,
  setLiked: (liked: boolean) => void,
  liked: boolean,
  queryclient: QueryClient
) => {
  if (!userId) {
    return toast({
      variant: "destructive",
      description: "Please login to like the tweet",
      duration: 1000,
    });
  }
  try {
    if (liked) return;

    setLiked(true);
    const { data, errors } = await apolloClient.mutate({
      mutation: likeTweetMutation,
      variables: { tweetId: tweet.id },
    });
    if (!data?.LikeTweet || errors) {
      setLiked(false);
      return;
    }
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["tweets"] });
    await queryclient.invalidateQueries({
      queryKey: ["userTweets", tweet.user.id],
    });
    await queryclient.invalidateQueries({
      queryKey: ["bookmarks"],
    });
    await queryclient.invalidateQueries({
      queryKey: ["tweet", tweet.id],
    });

    runTypedMutation(apolloClient, createNotificationMutation, {
      payload: {
        userId: tweet.user.id,
        tweetId: tweet.id,
        type: "LIKE",
      },
    });
  } catch (error) {
    toast({
      variant: "destructive",
      description: "There was an error. Please try again",
      duration: 1000,
    });
  }
};

export const likeComment = async (
  commentId: string,
  userId: string,
  tweetId: string,
  setLiked: (liked: boolean) => void,
  liked: boolean,
  queryclient: QueryClient
) => {
  try {
    if (liked) return;
    setLiked(true);
    const { errors } = await apolloClient.mutate({
      mutation: likeCommentMutation,
      variables: {
        commentId: commentId,
      },
    });
    if (errors) {
      setLiked(false);
      return;
    }
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["comments", tweetId] });
    queryclient.invalidateQueries({ queryKey: ["tweets"] });
    await queryclient.invalidateQueries({
      queryKey: ["bookmarks"],
    });
    runTypedMutation(apolloClient, createNotificationMutation, {
      payload: {
        userId: userId,
        type: "LIKE_COMMENT",
        tweetId: tweetId,
        commentId: commentId,
      },
    });
  } catch (err) {
    toast({
      variant: "destructive",
      description: "There was an error. Please try again",
      duration: 1000,
    });
  }
};

export const dislikeComment = async (
  commentId: string,
  tweetId: string,
  setLiked: (liked: boolean) => void,
  liked: boolean,
  queryclient: QueryClient
) => {
  try {
    if (!liked) return;
    setLiked(false);
    const { errors } = await apolloClient.mutate({
      mutation: unlikeCommentMutation,
      variables: {
        commentId: commentId,
      },
    });
    if (errors) {
      setLiked(true);
      return;
    }
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["comments", tweetId] });
    queryclient.invalidateQueries({ queryKey: ["tweets"] });
    await queryclient.invalidateQueries({
      queryKey: ["bookmarks"],
    });
  } catch (err) {
    toast({
      variant: "destructive",
      description: "There was an error. Please try again",
      duration: 1000,
    });
  }
};
