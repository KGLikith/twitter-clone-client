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
        userId
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
        profileImageUrl
        email
        location
      }
    }
  }
`);

export const getConversationsQuery = graphql(`
  #graphql
  query GetConversations($limit: Int, $cursor: ID) {
    getConversations(limit: $limit, cursor: $cursor) {
      conversations {
        id
        name
        lastMessageAt
        lastMessage
        createdAt
        numberOfUnreadMessages
        lastMessageSenderId
        readBy
        admin {
          id
          name
          userName
          profileImageUrl
        }
        participants {
          id
          name
          userName
          profileImageUrl
        }
      }
      nextCursor
    }
  }
`);

export const getConversationByIdQuery = graphql(`
  #graphql
  query GetConversation($conversationId: ID!) {
    getConversation(conversationId: $conversationId) {
      id
      name
      lastMessageAt
      lastMessage
      createdAt
      numberOfUnreadMessages
      lastMessageSenderId
      readBy
      admin {
        id
        name
        userName
        profileImageUrl
      }
      participants {
        id
        name
        userName
        profileImageUrl
      }
    }
  }
`);

export const getConversationByUserIdQuery = graphql(`
  #graphql
  query GetConversationByUserId($userId: ID!) {
    getConversationByUserId(userId: $userId) {
      id
    }
  }
`);

export const getMessaagesQuery = graphql(`
  #graphql
  query GetMessages($conversationId: ID!, $limit: Int, $cursor: ID) {
    getMessages(
      conversationId: $conversationId
      limit: $limit
      cursor: $cursor
    ) {
      messages {
        id
        content
        createdAt
        updatedAt
        deletedAt
        sender {
          id
          name
          userName
          profileImageUrl
        }
        deletedBy {
          id
          name
          userName
          profileImageUrl
        }
      }
      nextCursor
    }
  }
`);

export const getUsersForConversationQuery = graphql(`
  #graphql
  query GetUsersForConversation($limit: Int, $cursor: ID, $search: String) {
    getUsersForConversation(limit: $limit, cursor: $cursor, search: $search) {
      users {
        id
        name
        userName
        profileImageUrl
      }
      nextCursor
    }
  }
`);

export const onlineUsersQuery = graphql(`
  #graphql
  query OnlineUsers($userIds: [ID!]!) {
    onlineUsers(userIds: $userIds) {
      userId
      online
    }
  }
`);

export const getMessageNotificationQuery = graphql(`
  #graphql
  query getMessageNotification {
    getMessageNotification
  }
`);

export const getCallDetailsQuery = graphql(`
  #graphql
  query getCallDetails($callId: String!) {
    getCallDetails(callId: $callId) {
      id
      type
      status
      startedAt
      callerId
      endedAt
      callPickedAt
      conversationId
      conversation{
        name
        id
        
      }
      participants {
        callId
        userId
        joinedAt
        leftAt
        audioEnabled
        videoEnabled
        accepted
        user {
          id
          name
          userName
          profileImageUrl
        }
      }
    }
  }
`);
