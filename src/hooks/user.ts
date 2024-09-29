"use client";
import { apolloClient } from "@/clients/api";
import { getCurrentUserQuery } from "@/graphql/query/user";
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
        console.error("Error fetching current user:", error);
        throw error; 
      }
    },

  });
  return { ...query, user: query.data?.getCurrentUser };
};
