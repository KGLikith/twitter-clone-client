import { graphql } from "@/gql";

export const createUserMutation = graphql(`
  #graphql
  mutation createUser($email: String!, $password: String!, $name: String!) {
    createUser(email: $email, password: $password, name: $name) {
      success
      message
    }
  }
`);

export const followUserMutation = graphql(`
  #graphql
  mutation followUser($to: ID!) {
    followUser(to: $to)
  }
`);
export const unfollowUserMutation = graphql(`
  #graphql
  mutation unfollowUser($from: ID!, $to: ID!) {
    unfollowUser(from: $from, to: $to)
  }
`);

export const createNotificationMutation = graphql(`
  #graphql
  mutation createNotification($payload: createNotificationData!) {
    createNotification(payload: $payload)
  }
`);

export const updateNotificatonMutation = graphql(`
  #graphql
  mutation updateNotification($id: ID!) {
    updateNotification(id: $id)
  }
`);

export const updateAllNotificationsMutation = graphql(`
  #graphql
  mutation updateAllNotifications {
    updateAllNotifications
  }
`);

export const updateUserMutation = graphql(`
  #graphql
  mutation updateUser($payload: updateUserData!) {
    updateUser(payload: $payload) {
      success
      message
      updated
    }
  }
`);

export const createBookmarkMutation = graphql(`
  #graphql
  mutation createBookmark($tweetId: ID, $commentId: ID) {
    createBookmark(tweetId: $tweetId, commentId: $commentId)
  }
`);

export const removeBookmarkMutation = graphql(`
  #graphql
  mutation removeBookmark($tweetId: ID, $commentId: ID) {
    removeBookmark(tweetId: $tweetId, commentId: $commentId)
  }
`);

export const createSubscriptionMutation = graphql(`
  #graphql
  mutation createSubscription(
    $payload: createSubscriptionPayload!
  ) {
    createSubscription(payload: $payload) 
  }
`);


export const cancelSubscriptionMutation = graphql(`
  #graphql
  mutation cancelSubscription($subscriptionId: String, $option: Int!) {
    cancelSubscription(subscriptionId: $subscriptionId, option: $option)
  }
`);

export const updateSubscriptionMutation = graphql(`
  #graphql
  mutation updateSubscription($payload: updateSubscriptionPayload!) {
    updateSubscription(payload: $payload) 
  }
`);


export const createConversationMutation = graphql(`
  #graphql
  mutation CreateConversation($userIds: [ID!]!, $name: String) {
    createConversation(userIds: $userIds, name: $name) {
      id
      existing
    }
  }
`);

export const handleUserTyping = graphql(`
  #graphql
  mutation handleUserTyping($userId: ID!, $conversationId: ID!) {
    handleUserTyping(userId: $userId, conversationId: $conversationId)
  }
`);
