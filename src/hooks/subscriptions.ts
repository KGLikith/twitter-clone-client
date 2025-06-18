import { useSubscription } from "@apollo/client";
import type {
  CallEndedEvent,
  MessageSentSubscription,
  MessageSentSubscriptionVariables,
  UserTypingSubscription,
  UserTypingSubscriptionVariables,
} from "@/gql/graphql";
import {
  callAnswerSubscription,
  callEndedSubscription,
  callMediaUpdateSubscription,
  callParticipantLeftSubscription,
  getAnswerSubscription,
  getIceCandidateSubscription,
  getOfferSubscription,
  incomingCallSubscription,
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

export function useOnIcomingCallSubscription(userId: string) {
  return useSubscription(incomingCallSubscription, {
    variables: { userId },
    skip: !userId,
    onError: (error) => {
      console.error("Incoming call subscription error:", error);
    },
  });
}

export function useOnCallAnswerSubscription(callId: string) {
  if (!callId) {
    return { data: null, loading: false, error: null };
  }
  return useSubscription(callAnswerSubscription, {
    variables: {callId},
    skip: !callId,
    onError: (error) => {
      console.error("Call answer subscription error:", error);
    },
  });
}

export function useOnOfferSubscription(userId: string) {
  if (!userId) {
    return { data: null, loading: false, error: null };
  }
  return useSubscription(getOfferSubscription, {
    variables: { userId },
    skip: !userId,
    onError: (error) => {
      console.error("Offer subscription error:", error);
    },
  });
}

export function useOnAnswerSubscription(userId: string) {
  if (!userId) {
    return { data: null, loading: false, error: null };
  }
  return useSubscription(getAnswerSubscription, {
    variables: { userId },
    skip: !userId,
    onError: (error) => {
      console.error("Answer subscription error:", error);
    },
  });
}

export function useOnIceCandidateSubscription(userId: string) {
  if (!userId) {
    return { data: null, loading: false, error: null };
  }
  return useSubscription(getIceCandidateSubscription, {
    variables: { userId },
    skip: !userId,
    onError: (error) => {
      console.error("Ice candidate subscription error:", error);
    },
  });
}

export function useOnCallEndedSubscription(callId: string | null) {
  // if (!callId) {
  //   return { data: null, loading: false, error: null };
  // }
  return useSubscription<{ onCallEnded: CallEndedEvent }>(callEndedSubscription, {
    variables: { callId },
    skip: !callId,
    onError: (error) => {
      console.error("Call ended subscription error:", error);
    },
  });
}

export function useOnParticipantLeftSubscription(callId: string) {
  if (!callId) {
    return { data: null, loading: false, error: null };
  }
  return useSubscription(callParticipantLeftSubscription, {
    variables: { callId },
    skip: !callId,
    onError: (error) => {
      console.error("Participant left subscription error:", error);
    },
  });
}

export function useOnCallMediaUpdateSubscription(callId: string) {
  if (!callId) {
    return { data: null, loading: false, error: null };
  }
  return useSubscription(callMediaUpdateSubscription, {
    variables: { callId },
    skip: !callId,
    onError: (error) => {
      console.error("Call media update subscription error:", error);
    },
  });
}