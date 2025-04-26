import { apolloClient } from "@/clients/api";
import {
  createBookmarkMutation,
  removeBookmarkMutation,
} from "@/graphql/mutation/user";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const bookmark = async (
  tweetId: string | undefined,
  commentId: string | undefined,
  userId: string,
  setBookmarked: (bookmark: boolean) => void,
  bookmarked: boolean,
  queryclient: QueryClient
) => {
  if ((!tweetId && !commentId) || !userId) {
    return;
  }
  try {
    if (bookmarked) return;
    setBookmarked(true);
    const { data } = await apolloClient.mutate({
      mutation: createBookmarkMutation,
      variables: { tweetId, commentId },
    });
    if (data?.createBookmark) {
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
      await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryclient.invalidateQueries({
        queryKey: ["currentUserById", userId],
      });
    } else {
      setBookmarked(false);
      toast.error('Sorry for the inconvenience. Please try again', {
        duration: 2000,
        description: "Could not bookmark tweet",
      });
    }
  } catch (error) {
    toast.error('Sorry for the inconvenience. Please try again', {
      duration: 2000,
      description: "Could not bookmark tweet",
    });
    console.error("Error bookmarking tweet:", error);
    throw error;
  }
};

export const unBookmark = async (
  tweetId: string | undefined,
  commentId: string | undefined,
  userId: string,
  setBookmarked: (bookmark: boolean) => void,
  bookmarked: boolean,
  queryclient: QueryClient
) => {
  if ((!tweetId && !commentId) || !userId) {
    return;
  }
  try {
    if (!bookmarked) return;
    setBookmarked(false);
    const { data } = await apolloClient.mutate({
      mutation: removeBookmarkMutation,
      variables: { tweetId, commentId },
    });
    if (data?.removeBookmark) {
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
      await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
    } else {
      setBookmarked(true);
      toast.error('Sorry for the inconvenience. Please try again', {
        duration: 2000,
        description: "Could not remove bookmark",
      });
    }
  } catch (error) {
    toast.error('Sorry for the inconvenience. Please try again', {
      duration: 2000,
      description: "Could not remove bookmark",
    });
  }
};
