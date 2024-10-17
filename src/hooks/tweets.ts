import { apolloClient } from "@/clients/api";
import queryclient from "@/clients/queryClient";
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation } from "@/graphql/mutation/tweet";
import { getAllTweetsQuery, getTweetByIdQuery } from "@/graphql/query/tweet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "./use-toast";

export const useGetAllTweets = () => {
  const query = useQuery({
    queryKey: ["tweets"],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getAllTweetsQuery,
        });
        // console.log(data);
        return data;
      } catch (error) {
        console.log("Error fetching tweets", error);
      }
    },
  });
  return { ...query, tweets: query.data?.getAllTweets };
};

export const useCreateTweet = () => {

  const mutation = useMutation({
    mutationFn: async (payload: CreateTweetData) => {
      const { data } = await apolloClient.mutate({
        mutation: createTweetMutation,
        variables: { payload },
      });
      return data;
    },
    onMutate: () => {
        toast({
            title: "Creating Tweet",
            duration: 1000
        });
    },
    onSuccess:async()=>{
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["tweets"] });
      toast({
        title: "Tweeted Successfully",
        duration: 2000
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating tweet",
        description: error.message,
        variant: "destructive",
        duration: 2000
      });
    },
  });
  return { ...mutation, createTweet: mutation.data?.createTweet };
};

export const useGetTweet =(tweetid: string)=>{
  const query = useQuery({
    queryKey: ["tweet",tweetid],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getTweetByIdQuery,
          variables:{tweetid}
        });
        return data;
      } catch (error) {
        console.log("Error fetching tweet", error);
      }
    },
  });
  return { ...query, tweet: query.data?.getTweet };
}
