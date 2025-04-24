"use client";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useSession } from "next-auth/react";

const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
  });
  const authLink = setContext(() => {
    const token = window.localStorage.getItem("__twitter_token");
    // console.log(" apollo client",token)
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return client;
};

export const apolloClient = createApolloClient();
