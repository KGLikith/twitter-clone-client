import { graphql } from "@/gql";

export const messageSubscription = graphql(`
  subscription MessageSent($conversationId: ID!) {
    messageSent(conversationId: $conversationId) {
      id
      content
      createdAt
      sender {
        id
        name
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
    }
  }
`);
