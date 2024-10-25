import { apolloClient } from "@/clients/api";
import queryclient from "@/clients/queryClient";
import { Tweet } from "@/gql/graphql";
import { deleteTweetMutation } from "@/graphql/mutation/tweet";
import { toast } from "@/hooks/use-toast";

export const deletePost = async (tweet: Tweet) => {
  const { errors } = await apolloClient.mutate({
    mutation: deleteTweetMutation,
    variables: { tweetId: tweet.id },
  });
  if (errors) {
    return toast({
      variant: "destructive",
      description: errors[0].message,
      duration: 1000,
    });
  }
  await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["tweets"] });
    await queryclient.invalidateQueries({ queryKey: ["userTweets",tweet.user.id] });
    await queryclient.invalidateQueries({
      queryKey: ["tweet", tweet.id],
    });
  return toast({
    description: "Tweet Deleted Successfully",
    duration: 2000,
  });
};
