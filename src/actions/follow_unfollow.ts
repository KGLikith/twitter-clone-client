import { apolloClient } from "@/clients/api";
import queryclient from "@/clients/queryClient";
import { User } from "@/gql/graphql";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user";
import { toast } from "@/hooks/use-toast";

export const FollowUser = (user: User | undefined, setButtonLoading: any) => {
  return async () => {
    if (!user?.id) return;
    setButtonLoading(true);
    await apolloClient.mutate({
      mutation: followUserMutation,
      variables: { to: user?.id },
    });
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({
      queryKey: ["currentUserById", user.id],
    });
    await queryclient.invalidateQueries({ queryKey: ["currentUser"] });

    toast({
      title: "Followed Successfully",
      duration: 1000,
    });
    setButtonLoading(false);
  };
};

export const UnFollowUser = (user: User | undefined, setButtonLoading: any) => {
  return async () => {
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
};
