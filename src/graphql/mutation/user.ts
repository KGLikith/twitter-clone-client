import { graphql } from "@/gql";

export const followUserMutation = graphql(`
  #graphql
  mutation followUser($to: ID!) {
    followUser(to: $to)
  }
`);
export const unfollowUserMutation = graphql(`
  #graphql
  mutation unfollowUser($to: ID!) {
    unfollowUser(to: $to)
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