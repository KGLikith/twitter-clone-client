import { apolloClient } from "@/clients/api";
import queryclient from "@/clients/queryClient";
import { CreateCommentData, CreateTweetData } from "@/gql/graphql";
import { createCommentMutation, createTweetMutation } from "@/graphql/mutation/tweet";
import { getAllTweetsQuery, getTweetByIdQuery, getUserTweetsQuery } from "@/graphql/query/tweet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "./use-toast";

export const useGetAllTweets = (userId: string) => {
  const query = useQuery({
    queryKey: ["tweets"],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getAllTweetsQuery,
        });
        return data;
      } catch (error) {
        console.log("Error fetching tweets", error);
      }
    },
  });
  return { ...query, tweets: query.data?.getAllTweets };
};

export const useGetUserTweets=(userId:string)=>{
  const query = useQuery({
    queryKey: ["userTweets",userId],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getUserTweetsQuery,
          variables: { userId },
        });
        return data;
      } catch (error) {
        console.error("Error fetching user tweets:", error);
      }
    },
  })
  return {...query, userTweets: query.data?.getUserTweets}
}

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
        duration: 2000
      });
    },
  });
  return { ...mutation, createTweet: mutation.data?.createTweet };
};


export const useGetTweet =(tweetid: string,currentUserId:string)=>{
  const query = useQuery({
    queryKey: ["tweet",tweetid,currentUserId],
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

export const useCreateComment=()=>{
  const mutation = useMutation({
    mutationFn: async(payload: CreateCommentData)=>{
      const { data } = await apolloClient.mutate({
        mutation: createCommentMutation,
        variables: { payload },
      });
      return data;
    },
    onSuccess:async(data)=>{
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["tweets"] });
      await queryclient.invalidateQueries({ queryKey: ["tweet",data?.createComment?.tweet.id] });
      toast({
        title: "Commented Successfully",
        duration: 2000
      });
    },
    onError:(error)=>{
      toast({
        title: "Error creating comment",
        description: error.message,
        variant: "destructive",
        duration: 2000
      });
    }
  })
  return {...mutation, createComment: mutation.data?.createComment}
}