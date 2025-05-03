"use client";
import { apolloClient } from "@/clients/api";
import {
  getUserByIdQuery,
  getCurrentUserQuery,
  getNotificationsQuery,
  getUserBookmarksQuery,
  getUserFollowersQuery,
  getUserFollowingQuery,
  getRecommendedUsersQuery,
  getSubscriptionQuery,
} from "@/graphql/query/user";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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
        console.log("Error fetching current user:", (error as Error).message);
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
          query: getNotificationsQuery,
        });
        return data;
      } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
      }
    },
  });
  return { ...query, notifications: query.data?.getNotifications };
};

export const usePaginatedBookmarks = () => {
  return useInfiniteQuery({
    queryKey: ["bookmarks"],
    queryFn: async ({ pageParam = null }: { pageParam?: string | null }) => {
      const { data } = await apolloClient.query({
        query: getUserBookmarksQuery,
        variables: { cursor: pageParam, limit: 10 },
        fetchPolicy: "network-only",
      });
      return data.getUserBookmarks;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useGetFollowers = (id: string) => {
  return useInfiniteQuery({
    queryKey: ["followers", id],
    queryFn: async ({ pageParam = null }: { pageParam?: string | null }) => {
      const { data } = await apolloClient.query({
        query: getUserFollowersQuery,
        variables: { id, cursor: pageParam, limit: 10 },
        fetchPolicy: "network-only",
      });
      return data.getUserFollowers
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useGetFollowing = (id: string) => {
  return useInfiniteQuery({
    queryKey: ["following", id],
    queryFn: async ({ pageParam = null }: { pageParam?: string | null }) => {
      const { data } = await apolloClient.query({
        query: getUserFollowingQuery,
        variables: { id, cursor: pageParam, limit: 10 },
        fetchPolicy: "network-only",
      });
      return data.getUserFollowing;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useGetRecommendedUsers = () => {
  return useInfiniteQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async ({ pageParam = null }: { pageParam?: string | null }) => {
      const { data } = await apolloClient.query({
        query: getRecommendedUsersQuery,
        variables: { cursor: pageParam, limit: 10 },
        fetchPolicy: "network-only",
      });
      return data.getRecommendedUsers;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export const useGetSubscription = ()=>{
  const query = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getSubscriptionQuery,
          fetchPolicy: "network-only",
        });
        return data;
      } catch (error) {
        return null;
      }
    },
    refetchInterval: 30000
  })
  return { ...query, subscription: query.data?.getSubscription };
}