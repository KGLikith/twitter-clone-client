// import { gql } from "@apollo/client";
import { gql } from "@apollo/client";
import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  #graphql
  query verifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = gql(`
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
      followers{
        id
      }
      following{
        id
      }
    }
  }
`);

export const getUserByIdQuery = gql(`
  #graphql
  query getUserById($id: ID!) {
    getUserById(id: $id) {
      id
      email
      firstName
      lastName
      profileImageUrl
      followers{
        id
      }
      following{
        id
      }
    }
  }
`);


