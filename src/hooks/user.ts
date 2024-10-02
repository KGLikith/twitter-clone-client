import { apolloClient } from "@/clients/api";
import { getCurrentUserByIdQuery, getCurrentUserQuery } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: getCurrentUserQuery,
        });
        console.log(data)
        return data;
      } catch (error) {
        console.error("Error fetching current user:", error);
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
          query: getCurrentUserByIdQuery,
          variables: { id },
        });
        return data;
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    },
  });
  return { ...query, user: query.data?.getCurrentUserById };
}