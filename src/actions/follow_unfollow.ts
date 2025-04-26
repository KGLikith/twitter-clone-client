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
  await queryclient.invalidateQueries({
    queryKey: ["currentUserById", userId],
  });
  await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
  runTypedMutation(apolloClient, createNotificationMutation, {
    payload: {
      userId: userId,
      type: "FOLLOW",
    },
  });
  toast.success("Followed successfully successfully", {
    duration: 1000,
  });
  setButtonLoading(false);
};

export const UnFollowUser = async (
  user: User | undefined,
  setButtonLoading: (loading: boolean) => void,
  queryclient: QueryClient
) => {
  setButtonLoading(true);
  if (!user?.id) return;
  const { data } = await apolloClient.mutate({
    mutation: unfollowUserMutation,
    variables: { to: user?.id },
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
  await queryclient.invalidateQueries({
    queryKey: ["currentUserById", user.id],
  });
  await queryclient.invalidateQueries({ queryKey: ["currentUser"] });

  toast.success("Unfollowed successfully", {
    duration: 1000,
  });
  setButtonLoading(false);
};
