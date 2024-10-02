import { gql } from "@apollo/client";
import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  #graphql
  query verifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  #graphql
  query getCurrentUser {
    getCurrentUser {
      id
      email
      firstName
      lastName
      profileImageUrl
      tweets {
        id
        content
        imageUrl
        user {
          id
          firstName
          lastName
          profileImageUrl
        }
      }
    }
  }
`);

export const getCurrentUserByIdQuery = graphql(`
  #graphql
  query getCurrentUserById($id: ID!) {
    getCurrentUserById(id: $id) {
      id
      email
      firstName
      lastName
      profileImageUrl
      tweets {
        id
        content
        imageUrl
        user {
          id
          firstName
          lastName
          profileImageUrl
        }
      }
    }
  }
`);
