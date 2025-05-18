import { graphql } from "@/gql";

export const messageSubscription = graphql(`
  subscription MessageSent($conversationId: ID!) {
    messageSent(conversationId: $conversationId) {
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
  }
`);

export const USER_TYPING_SUBSCRIPTION = graphql(`
  subscription UserTyping($conversationId: ID!) {
    userTyping(conversationId: $conversationId) {
      userId
      conversationId
      typing
    }
  }
`);

// export const USER_ONLINE_SUBSCRIPTION = graphql(`
//   subscription IsOnline($userId: ID!) {
//     isOnline(userId: $userId) {
//       online
//       userId
//     }
//   }
// `);

export const ONLINE_STATUS_SUBSCRIPTION = graphql(`
  subscription onlineStatusUpdated($userIds: [ID!]!) {
    onlineStatusUpdated(userIds: $userIds) {
      online
      userId
    }
  }
`);


export const seenSusbcription = graphql(`
  subscription SeenMessage($conversationId: ID!) {
    seenMessage(conversationId: $conversationId) {
      conversationId
      userId
      readAt
    }
  }
`);

export const messageNotificationUpdatedSubscripiton = graphql(`
  subscription MessageNotificationUpdated($userId: ID!) {
    messageNotificationUpdated(userId: $userId) {
      userId
      conversationId
      timeStamp
    }
  }
`);