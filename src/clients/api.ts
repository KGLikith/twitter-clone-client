"use client";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";

const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
  });

  const authLink = setContext(() => {
    const token = window.localStorage.getItem("__twitter_token");
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const wsLink = typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_WS_URL!, // e.g., ws://localhost:4000/graphql
          connectionParams: () => {
            const token = window.localStorage.getItem("__twitter_token");
            return {
              headers: {
                authorization: token ? `Bearer ${token}` : "",
              },
            };
          },
        })
      )
    : null;

  const splitLink = wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        authLink.concat(httpLink)
      )
    : authLink.concat(httpLink);

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return client;
};

export const apolloClient = createApolloClient();
