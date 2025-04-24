import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import fetch from "cross-fetch";

export const createServerApolloClient = () =>
  new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL,
      fetch,
    }),
    cache: new InMemoryCache(),
  });
