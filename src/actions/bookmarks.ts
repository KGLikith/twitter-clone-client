import { apolloClient } from "@/clients/api";
import {
  createBookmarkMutation,
  removeBookmarkMutation,
} from "@/graphql/mutation/user";
import { toast } from "@/hooks/use-toast";
import { QueryClient } from "@tanstack/react-query";

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
      toast({
        title: "Sorry for the inconvenience. Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  } catch (error) {
    toast({
      title: "Error bookmarking tweet. Please try again",
      variant: "destructive",
      duration: 2000,
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
      toast({
        title: "Sorry for the inconvenience. Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  } catch (error) {
    toast({
      title: "Could not remove bookmark. Please try again",
      variant: "destructive",
      duration: 2000,
    });
  }
};
