"use client";
import { apolloClient } from "@/clients/api";
import { getUserByIdQuery, getCurrentUserQuery, getNotificationsQuery, getUserBookmarksQuery } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getCurrentUserQuery,
        });
        return data;
      } catch (error) {
        console.error("Error fetching current user:", (error as Error).message);
        return null;
      }
    },
  });
  return { ...query, user: query.data?.getCurrentUser };
};

export const useCurrentUserById = (id: string) => {
  const query = useQuery({
    queryKey: ["currentUserById", id],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getUserByIdQuery,
          variables: { id },
        });
        return data;
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    },
  });
  return { ...query, user: query.data?.getUserById };
};

export const useGetNotifications = () => {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getNotificationsQuery
        });
        return data;
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    },
  });
  return { ...query, notifications: query.data?.getNotifications };
}

export const useGetBookmarks = () => {
  const query = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getUserBookmarksQuery,
        });
        return data;
      } catch (error) {
        console.error("Error fetching user bookmarks:", error);
        return null;
      }
    },
  })
  return { ...query, bookmarks: query.data?.getUserBookmarks };
}
