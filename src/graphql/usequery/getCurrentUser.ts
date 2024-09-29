// import { useQuery } from "@apollo/client";
import { getCurrentUserQuery } from "../query/user";
import { apolloClient } from "@/clients/api";

export const getCurrentUser = async () => {
  try {
      const { data } = await apolloClient.query({
        query: getCurrentUserQuery,
      });
      return data;
  } catch (error) {
    console.log(error)
  }
};
