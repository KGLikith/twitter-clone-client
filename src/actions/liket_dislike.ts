import { apolloClient } from "@/clients/api";
import queryclient from "@/clients/queryClient";
import { Tweet, User } from "@/gql/graphql";
import {
  likeTweetMutation,
  unlikeTweetMutation,
} from "@/graphql/mutation/tweet";
import { toast } from "@/hooks/use-toast";

export const dislike = async (
  user: User,
  tweet: Tweet,
  setLiked: (liked: boolean) => void,
  liked: boolean
) => {
  if (!user) {
    return toast({
      variant: "destructive",
      description: "Please login to like the tweet",
    });
  }
  try {

    if(!liked) return ;
    await apolloClient.mutate({
      mutation: unlikeTweetMutation,
      variables: { tweetId: tweet.id },
    });
    setLiked(false);
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["tweets"] });
    await queryclient.invalidateQueries({ queryKey: ["userTweets",tweet.user.id] });
    await queryclient.invalidateQueries({
      queryKey: ["tweet", tweet.id],
    });
  } catch (error) {
    toast({
      variant: "destructive",
      description: (error as Error).message,
    });
  }
};

export const like = async (
  user: User,
  tweet: Tweet,
  setLiked: (liked: boolean) => void,
  liked: boolean
) => {
  if (!user) {
    return toast({
      variant: "destructive",
      description: "Please login to like the tweet",
      duration: 1000,
    });
  }
  try {
    if (liked) return;
    await apolloClient.mutate({
      mutation: likeTweetMutation,
      variables: { tweetId: tweet.id },
    });
    setLiked(true);
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["tweets"] });
    await queryclient.invalidateQueries({ queryKey: ["userTweets",tweet.user.id] });
    await queryclient.invalidateQueries({
      queryKey: ["tweet", tweet.id],
    });
  } catch (error) {
    toast({
      variant: "destructive",
      description: (error as Error).message,
      duration: 1000,
    });
  }
};
