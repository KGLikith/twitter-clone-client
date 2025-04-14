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
      userName
      createdAt
      profileImageUrl
      bio
      location
      website
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

export const getUserByIdQuery = graphql(`
  #graphql
  query getUserById($id: ID!) {
    getUserById(id: $id) {
      id
      email
      firstName
      lastName
      profileImageUrl
      userName
      bio
      location
      website
      createdAt
      followers{
        id
        profileImageUrl
        firstName
        lastName
        userName
        bio
      }
      following{
        id
        profileImageUrl
        firstName
        lastName
        userName
        bio
      }
    }
  }
`);


