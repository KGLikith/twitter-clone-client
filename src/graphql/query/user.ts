import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  #graphql
  query verifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token) {
      token
      id
      email
      name 
      profileImageUrl
    }
  }
`);

export const verifyUserCredentialQuery = graphql(`
  #graphql
  query verifyUserCredential($email: String!, $password: String!) {
    verifyUserCredential(email: $email, password: $password) {
      id
      email
      token
      name
      profileImageUrl
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
      followers
      following
      isVerified
      notificationPreference {
        likes
        comments
        follows
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
      followers
      following
      isVerified
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
        followers
        following
        isVerified
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
            isVerified
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
            isVerified
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

export const getRecommendedUsersQuery = graphql(`
  #graphql
  query getRecommendedUsers($cursor: String, $limit: Int) {
    getRecommendedUsers(cursor: $cursor, limit: $limit) {
      users {
        id
        name
        userName
        bio
        profileImageUrl
        followers
        following
        isVerified
      }
      nextCursor
    }
  }
`);

export const getUserFollowersQuery = graphql(`
  #graphql
  query getUserFollowers($id: ID!, $cursor: String, $limit: Int) {
    getUserFollowers(id: $id, cursor: $cursor, limit: $limit) {
      users {
        id
        name
        userName
        bio
        profileImageUrl
        followers
        following
        isVerified
      }
      nextCursor
    }
  }
`);

export const getUserFollowingQuery = graphql(`
  #graphql
  query getUserFollowing($id: ID!, $cursor: String, $limit: Int) {
    getUserFollowing(id: $id, cursor: $cursor, limit: $limit) {
      users {
        id
        name
        userName
        bio
        profileImageUrl
        followers
        following
        isVerified
      }
      nextCursor
    }
  }
`);

export const getSubscriptionQuery = graphql(`
  #graphql
  query getSubscription {
    getSubscription {
      id
      userId
      plan
      price
      planId
      subscriptionId
      customerId
      active
      autorenew
      interval
      shortUrl
      startDate
      endDate
      user {
        id 
        name 
        userName
        email
        location
      }
    }
  }
`);