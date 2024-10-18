// import { gql } from "@apollo/client";
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
      recommendedUsers{
        id
        email
        firstName
        lastName
        profileImageUrl
      }
      tweets {
        id
        content
        imageUrl
        comments{
          id
        }
        user {
          id
        }
      }
      followers{
        id
      }
      following{
        id
      }
    }
  }
`);

export const getUserByIdQuery = graphql(`
  #graphql
  query getUserById($id: ID!) {
    getUserById(id: $id) {
      id
      email
      firstName
      lastName
      profileImageUrl
      tweets {
        id
        content
        imageUrl
        likes
        comments{
          id
        }
        user {
          id
          firstName
          lastName
          profileImageUrl
        }
      }
      followers{
        id
      }
      following{
        id
      }
    }
  }
`);
