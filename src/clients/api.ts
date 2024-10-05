import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const isServer = () => typeof window === 'undefined';

 const getClientToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('__twitter_token') : null;
};

// Initialize Apollo Client
 const initializeApollo = () => {
  const token = isServer() ? null : getClientToken(); // Use cookies on the server if needed
  return createApolloClient(token);
};

const createApolloClient = (token : string | null) => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql',
  });
  const authLink = setContext(() => {
    console.log(" apollo client",token)
    return {
      headers: {
        // ...headers,
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

export const apolloClient = initializeApollo();
