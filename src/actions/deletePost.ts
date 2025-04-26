import { apolloClient } from "@/clients/api";
import { Tweet } from "@/gql/graphql";
import { deleteTweetMutation } from "@/graphql/mutation/tweet";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const deletePost = async (tweet: Tweet, queryclient: QueryClient) => {
  const { errors, data } = await apolloClient.mutate({
    mutation: deleteTweetMutation,
    variables: { tweetId: tweet.id },
  });
  if (errors || !data?.deleteTweet) {
    toast.error(
      (errors && errors[0].message) ||
        "Something went wrong. Please try again later.",
      {
        duration: 2000,
        description: "Could not bookmark tweet",
      }
    );
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
  toast.success("Tweet deleted successfully", {
    duration: 2000,
  });
};
