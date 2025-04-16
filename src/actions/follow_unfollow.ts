import { apolloClient } from "@/clients/api";
import { User } from "@/gql/graphql";
import {
  createNotificationMutation,
  followUserMutation,
  unfollowUserMutation,
} from "@/graphql/mutation/user";
import { toast } from "@/hooks/use-toast";
import { QueryClient } from "@tanstack/react-query";
import { runTypedMutation } from "./helperFxns";

export const FollowUser = async (
  userId: string,
  setButtonLoading: (loading: boolean) => void,
  queryclient: QueryClient
) => {
  if (!userId) return;
  try {
    setButtonLoading(true);
    await apolloClient.mutate({
      mutation: followUserMutation,
      variables: { to: userId },
    });
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
    toast({
      title: "Followed Successfully",
      duration: 1000,
    });
    setButtonLoading(false);
  } catch (e) {
    toast({
      title: "Error Following",
      description: (e as Error).message,
      variant: "destructive",
      duration: 2000,
    });
    setButtonLoading(false);
  }
};

export const UnFollowUser = async (
  user: User | undefined,
  setButtonLoading: (loading: boolean) => void,
  queryclient: QueryClient
) => {
  setButtonLoading(true);
  if (!user?.id) return;
  await apolloClient.mutate({
    mutation: unfollowUserMutation,
    variables: { to: user?.id },
  });

  await apolloClient.resetStore();
  await queryclient.invalidateQueries({
    queryKey: ["currentUserById", user.id],
  });
  await queryclient.invalidateQueries({ queryKey: ["currentUser"] });

  toast({
    title: "Unfollowed successfully",
    duration: 1000,
  });
  setButtonLoading(false);
};
