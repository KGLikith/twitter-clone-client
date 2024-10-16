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
        user {
          id
        }
      }
      followers{
        id
        firstName
        lastName
        profileImageUrl
      }
      following{
        id
        firstName
        lastName
        profileImageUrl
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
        user {
          id
          firstName
          lastName
          profileImageUrl
        }
      }
      followers{
        id
        firstName
        lastName
        profileImageUrl
      }
      following{
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`);
