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
      name
      userName
      createdAt
      profileImageUrl
      bio
      notificationCount
      location
      website
      notificationPreference {
        likes
        comments
        follows
      }
      recommendedUsers {
        id
        email
        name
        userName
        profileImageUrl
      }
      followers {
        id
      }
      following {
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
      name
      profileImageUrl
      userName
      bio
      location
      website
      createdAt
      followers {
        id
        profileImageUrl
        name
        userName
        bio
      }
      following {
        id
        profileImageUrl
        name
        userName
        bio
      }
    }
  }
`);

export const getSignedUrlForUserQuery = graphql(`
  #graphql
  query getSignedUrlForUser($mediaType: String!, $mediaName: String!) {
    getSignedUrlForUser(mediaType: $mediaType, mediaName: $mediaName)
  }
`);

export const getNotificationsQuery = graphql(`
  #graphql
  query getNotifications {
    getNotifications {
      id
      tweetId
      commentId
      notifiedUserId
      type
      read
      createdAt
      updatedAt
      user {
        id
        name
        profileImageUrl
        userName
        followers {
          id
        }
      }
      tweet {
        id
        content
      }
      comment {
        id
        content
      }
    }
  }
`);
