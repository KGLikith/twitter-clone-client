import { apolloClient } from "@/clients/api";
import { User } from "@/gql/graphql";
import {
  createNotificationMutation,
  followUserMutation,
  unfollowUserMutation,
} from "@/graphql/mutation/user";
import { QueryClient } from "@tanstack/react-query";
import { runTypedMutation } from "./helperFxns";
import { toast } from "sonner";

export const FollowUser = async (
  currentUserId: string,
  userId: string,
  setButtonLoading: (loading: boolean) => void,
  queryclient: QueryClient
) => {
  if (!userId) return;
  setButtonLoading(true);
  const { data } = await apolloClient.mutate({
    mutation: followUserMutation,
    variables: { to: userId },
  });
  if (!data?.followUser) {
    toast.error("Sorry for the inconvenience. Please try again", {
      duration: 2000,
      description: "Could not follow user",
    });
    setButtonLoading(false);
    return;
  }
  await apolloClient.resetStore();
  await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
  await queryclient.invalidateQueries({ queryKey: ["followers", userId] });
  await queryclient.invalidateQueries({ queryKey: ["following", currentUserId] });
  await queryclient.invalidateQueries({ queryKey: ["recommendedUsers"] });

  runTypedMutation(apolloClient, createNotificationMutation, {
    payload: {
      userId: userId,
      type: "FOLLOW",
    },
  });
  setButtonLoading(false);
};

export const UnFollowUser = async (
  from: string,
  to: string,
  setButtonLoading: (loading: boolean) => void,
  queryclient: QueryClient
) => {
  setButtonLoading(true);
  if (!to || !from) return;
  const { data } = await apolloClient.mutate({
    mutation: unfollowUserMutation,
    variables: { from: from,to: to },
  });
  if (!data?.unfollowUser) {
    toast.error("Sorry for the inconvenience. Please try again", {
      duration: 2000,
      description: "Could not unfollow user",
    });
    setButtonLoading(false);
    return;
  }

  await apolloClient.resetStore();

  await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
  await queryclient.invalidateQueries({ queryKey: ["followers", to] });
  await queryclient.invalidateQueries({ queryKey: ["following", from] });
  await queryclient.invalidateQueries({ queryKey: ["recommendedUsers"] });
  setButtonLoading(false);
};
