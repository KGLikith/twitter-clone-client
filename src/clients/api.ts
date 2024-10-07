'use client'
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';



const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql',
  });
  const authLink = setContext(() => {
    const token = window.localStorage.getItem("__twitter_token")
    // console.log(" apollo client",token)
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
  return client;
};

export const apolloClient = createApolloClient();
