import { apolloClient } from "@/clients/api";
import { CreateCommentData, CreateTweetData } from "@/gql/graphql";
import {
  createCommentMutation,
  createTweetMutation,
} from "@/graphql/mutation/tweet";
import {
  getPaginatedCommentsByTweetIdQuery,
  getPaginatedTweetsQuery,
  getPaginatedUserTweetsQuery,
  getTweetByIdQuery,
} from "@/graphql/query/tweet";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { runTypedMutation } from "@/actions/helperFxns";
import { createNotificationMutation } from "@/graphql/mutation/user";
import { toast } from "sonner";

export const usePaginatedTweets = () => {
  return useInfiniteQuery({
    queryKey: ["tweets"],
    queryFn: async ({ pageParam = null }:{
      pageParam?: string | null
    }) => {
      const { data } = await apolloClient.query({
        query: getPaginatedTweetsQuery,
        variables: { cursor: pageParam, limit: 10 },
        fetchPolicy: "network-only",
      });
      return data.getPaginatedTweets;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  });
};

export const useUserPaginatedTweets = (userId: string)=>{
  return useInfiniteQuery({
    queryKey: ["userTweets", userId],
    queryFn: async({pageParam = null}:{
      pageParam?: string | null
    })=>{
        const { data } =await apolloClient.query({
          query: getPaginatedUserTweetsQuery,
          variables: {userId, cursor: pageParam,limit: 10},
          fetchPolicy: "network-only"
        });
        return data.getPaginatedUserTweets
    },
    initialPageParam: null,
    getNextPageParam: (lastPage)=> lastPage.nextCursor ?? undefined
  })
}

export const useGetTweet = (tweetid: string) => {
  const query = useQuery({
    queryKey: ["tweet", tweetid],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getTweetByIdQuery,
          variables: { tweetid },
        });
        return data;
      } catch (error) {
        console.log("Error fetching tweet", error);
      }
    },
  });
  return { ...query, tweet: query.data?.getTweet };
};


export const usePaginatedCommentsByTweetId = (tweetId: string) => {
  return useInfiniteQuery({
    queryKey: ["comments", tweetId],
    queryFn: async ({ pageParam = null }: { pageParam?: string | null }) => {
      const { data } = await apolloClient.query({
        query: getPaginatedCommentsByTweetIdQuery,
        variables: { tweetId, cursor: pageParam, limit: 10 },
        fetchPolicy: "network-only",
      });
      return data.getPaginatedCommentsByTweetId;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}

export const useCreateTweet = () => {
  const queryclient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: CreateTweetData) => {
      const { data } = await apolloClient.mutate({
        mutation: createTweetMutation,
        variables: { payload },
      });
      return data;
    },
    onSuccess: async () => {
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["tweets"] });
      toast.success("Posted Successfully",{
        duration: 2000,
      });
    },
    onError: (error) => {
      toast.error("Error creating tweet",{
        description: "Please try again",
        duration: 2000,
      });
    },
  });
  return { ...mutation, createTweet: mutation.data?.createTweet };
};

export const useCreateComment = () => {
  const queryclient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateCommentData) => {
      const { data } = await apolloClient.mutate({
        mutation: createCommentMutation,
        variables: { payload },
      });
      return data;
    },
    onSuccess: async (data) => {
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({
        queryKey: ["tweets"],
      });
      await queryclient.invalidateQueries({ queryKey: ["comments", data?.createComment?.tweet.id] });
      if(!data?.createComment) return;
      runTypedMutation(apolloClient, createNotificationMutation, {
        payload: {
          userId: data.createComment.tweet.user.id,
          type: "COMMENT",
          tweetId: data.createComment.tweet.id,
          commentId: data.createComment.id,
        },
      });
      toast.success( "Commented Successfully",{
        duration: 2000,
      });
    },
    onError: (error) => {
      toast.error("Error creating comment",{
        description: "Please try again later. Sorry for the inconvenience.",
        duration: 2000,
      });
    },
  });
  return { ...mutation, comment: mutation.data?.createComment };
};
