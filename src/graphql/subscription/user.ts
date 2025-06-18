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

export const incomingCallSubscription = graphql(`
  subscription OnIncomingCall($userId: String!) {
    onIncomingCall(userId: $userId) {
      id
      type
      status
      conversationId
      callerId
      startedAt
      endedAt
      conversation {
        id
        name
      }
      participants {
        user {
          id
          name
          userName
          profileImageUrl
        }
        joinedAt
        leftAt
        audioEnabled
        videoEnabled
        accepted
      }
    }
  }
`);

export const callAnswerSubscription = graphql(`
  subscription OnCallAnswer($callId: String!) {
    onCallAnswer(callId: $callId) {
      userId
      callId
      accepted
      declined
    }
  }
`);

export const getOfferSubscription = graphql(`
  subscription OnOffer($userId: String!) {
    onOffer(userId: $userId) {
      sdp
      fromUserId
      callId
    }
  }
`);

export const getAnswerSubscription = graphql(`
  subscription OnAnswer($userId: String!) {
    onAnswer(userId: $userId) {
      sdp
      fromUserId
      callId
    }
  }
`);

export const getIceCandidateSubscription = graphql(`
  subscription OnIceCandidate($userId: String!) {
    onIceCandidate(userId: $userId) {
      candidate
      fromUserId
      callId
    }
  }
`);

export const callEndedSubscription = graphql(`
  subscription OnCallEnded($callId: String!) {
    onCallEnded(callId: $callId) {
      callId
      host
    }
  }
`);

export const callParticipantLeftSubscription = graphql(`
  subscription OnParticipantLeft($callId: String!) {
    onParticipantLeft(callId: $callId) {
      callId
      userId
    }
  }
`);

export const callMediaUpdateSubscription = graphql(`
  subscription OnMediaUpdate($callId: String!) {
    onMediaUpdate(callId: $callId) {
      callId
      userId
      audioEnabled
      videoEnabled
    }
  }
`);
