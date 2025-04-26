import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  #graphql
  query verifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token){
      token
      id
      email
    }
  }
`);

export const verifyUserCredentialQuery = graphql(`
  #graphql
  query verifyUserCredential($email: String!, $password: String!) {
    verifyUserCredential(email: $email, password: $password){
      id 
      email
      token
    }
  }
`);

export const UserLoginErrorsQuery = graphql(`
  #graphql
  query UserLoginErrors($email: String!, $password: String!) {
    checkLoginCredentials(email: $email, password: $password) {
      success
      message
    }
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
      bookmark {
        id
        bookmarks {
          id
          type
          tweetId
          commentId
        }
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

export const getUserBookmarksQuery = graphql(`
  #graphql
  query getUserBookmarks($cursor: String, $limit: Int) {
    getUserBookmarks(cursor: $cursor, limit: $limit) {
      bookmarks {
        id
        type
        createdAt
        tweet {
          id
          content
          createdAt
          mediaUrl
          mediaType
          likes
          commentsLength
          user {
            id
            name
            profileImageUrl
            userName
          }
        }
        comment {
          id
          content
          createdAt
          mediaUrl
          mediaType
          likes
          user {
            id
            name
            profileImageUrl
            userName
          }
          tweet {
            id
            user {
              id
              name
              userName
            }
          }
        }
      }
      nextCursor
    }
  }
`);
