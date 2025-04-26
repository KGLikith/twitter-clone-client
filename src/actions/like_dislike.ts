import { apolloClient } from "@/clients/api";
import { Tweet } from "@/gql/graphql";
import {
  likeCommentMutation,
  likeTweetMutation,
  unlikeCommentMutation,
  unlikeTweetMutation,
} from "@/graphql/mutation/tweet";
import { createNotificationMutation } from "@/graphql/mutation/user";
import { QueryClient } from "@tanstack/react-query";
import { runTypedMutation } from "./helperFxns";
import { toast } from "sonner";

export const dislike = async (
  userId: string,
  tweet: Tweet,
  setLiked: (liked: boolean) => void,
  liked: boolean,
  queryclient: QueryClient
) => {
  if (!userId) {
    toast.error("Sorry for the inconvenience. Please try again later", {
      duration: 1000,
      description: "Error removing the like",
    });
    return;
  }

  if (!liked) return;
  setLiked(false);
  const { data, errors } = await apolloClient.mutate({
    mutation: unlikeTweetMutation,
    variables: { tweetId: tweet.id },
  });
  if (!data?.UnlikeTweet || errors) {
    setLiked(true);
    toast.error("Sorry for the inconvenience. Please try again later", {
      duration: 1000,
      description: "Error removing the like",
    });
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
};

export const like = async (
  userId: string,
  tweet: Tweet,
  setLiked: (liked: boolean) => void,
  liked: boolean,
  queryclient: QueryClient
) => {
  if (!userId) {
    toast.error("Please login to like the tweet", {
      duration: 1000,
    });
    return;
  }
  if (liked) return;

  setLiked(true);
  const { data, errors } = await apolloClient.mutate({
    mutation: likeTweetMutation,
    variables: { tweetId: tweet.id },
  });
  if (!data?.LikeTweet || errors) {
    setLiked(false);
    toast.error("Sorry for the inconvenience. Please try again later", {
      duration: 1000,
      description: "Error liking the tweet",
    });
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
};

export const likeComment = async (
  commentId: string,
  userId: string,
  tweetId: string,
  setLiked: (liked: boolean) => void,
  liked: boolean,
  queryclient: QueryClient
) => {
  if (!userId) {
    toast.error("Please login to like the comment", {
      duration: 1000,
    });
    return;
  }
  if (liked) return;
  setLiked(true);
  const { errors,data } = await apolloClient.mutate({
    mutation: likeCommentMutation,
    variables: {
      commentId: commentId,
    },
  });
  if (errors || !data?.likeComment) {
    setLiked(false);
    toast.error("Sorry for the inconvenience. Please try again", {
      duration: 1000,
      description: "Error liking the comment",
    });
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
};

export const dislikeComment = async (
  commentId: string,
  tweetId: string,
  setLiked: (liked: boolean) => void,
  liked: boolean,
  queryclient: QueryClient
) => {
    if (!liked) return;
    setLiked(false);
    const { errors , data } = await apolloClient.mutate({
      mutation: unlikeCommentMutation,
      variables: {
        commentId: commentId,
      },
    });
    if (errors ||!data?.unlikeComment ) {
      setLiked(true);
      toast.error("Sorry for the inconvenience. Please try again", {
        duration: 1000,
        description: "Error removing the like on the comment",
      });
      return;
    }
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["comments", tweetId] });
    queryclient.invalidateQueries({ queryKey: ["tweets"] });
    await queryclient.invalidateQueries({
      queryKey: ["bookmarks"],
    });
};
