import { useSubscription } from "@apollo/client";
import type {
  MessageSentSubscription,
  MessageSentSubscriptionVariables,
  UserTypingSubscription,
  UserTypingSubscriptionVariables,
} from "@/gql/graphql";
import {
  messageNotificationUpdatedSubscripiton,
  messageSubscription,
  ONLINE_STATUS_SUBSCRIPTION,
  seenSusbcription,
  USER_TYPING_SUBSCRIPTION,
} from "@/graphql/subscription/user";

export const useMessageSubscription = (conversationId: string) => {
  return useSubscription<
    MessageSentSubscription,
    MessageSentSubscriptionVariables
  >(messageSubscription, {
    variables: { conversationId },
    skip: !conversationId,
    onError: (error) => {
      console.error("Messaging subscription error:", error);
    },
  });
};

export const useSeenConversationSubscription = (conversationId: string) => {
  return useSubscription(seenSusbcription, {
    variables: { conversationId },
    skip: !conversationId,
    onError: (error) => {
      console.error("Seen subscription error:", error);
    },
  });
};

export const useTypingSubscription = (conversationId: string) => {
  return useSubscription<
    UserTypingSubscription,
    UserTypingSubscriptionVariables
  >(USER_TYPING_SUBSCRIPTION, {
    variables: { conversationId },
    skip: !conversationId,
    onError: (error) => {
      console.error("Typing subscription error:", error);
      return null;
    },
  });
};

export function useOnlineSubscription(userIds: string[]) {
  return useSubscription(ONLINE_STATUS_SUBSCRIPTION, {
    variables: { userIds },
    skip: userIds.length === 0,
  });
}

export function useNotificationUpdateSubscription(userId: string) {
  return useSubscription(messageNotificationUpdatedSubscripiton, {
    variables: { userId },
    skip: !userId,
  });
}