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

export const handleUserTypingStatusMutation = graphql(`
  #graphql
  mutation handleUserTypingStatus($userId: ID!, $conversationId: ID!, $typingStatus: Boolean!) {
    handleUserTypingStatus(userId: $userId, conversationId: $conversationId, typingStatus: $typingStatus) 
  }
`);

export const sendMessageMutation = graphql(`
  #graphql
  mutation SendMessage($conversationId: ID!, $content: String!) {
    sendMessage(conversationId: $conversationId, content: $content)
  }
`);

export const markConversationAsReadMutation = graphql(`
  #graphql
  mutation MarkConversationAsRead($conversationId: ID!) {
    markConversationAsRead(conversationId: $conversationId)
  }
`);

export const startCallMutation = graphql(`
  #graphql
  mutation StartCall($participants: [ID]!, $conversationId: String!, $type: CallType!) {
    startCall(participants: $participants, conversationId: $conversationId, type: $type){
      callId
      success
      error
    }
  }
`);

export const acceptCallMutation = graphql(`
  #graphql
  mutation AcceptCall($callId: String!) {
    acceptCall(callId: $callId)
  }
`);

export const declineCallMutation = graphql(`
  #graphql
  mutation DeclineCall($callId: String!) {
    declineCall(callId: $callId)
  }
`);

export const missedCallMutation = graphql(`
  #graphql
  mutation MissedCall($callId: String!) {
    missedCall(callId: $callId)
  }
`);
export const sendOfferMutation = graphql(`
  #graphql
  mutation SendOffer($callId: String!, $sdp: String!, $targetUserId: String!) {
    sendOffer(callId: $callId, sdp: $sdp, targetUserId: $targetUserId)
  }
`);

export const sendAnswerMutation = graphql(`
  #graphql
  mutation SendAnswer($callId: String!, $sdp: String!, $targetUserId: String!) {
    sendAnswer(callId: $callId, sdp: $sdp, targetUserId: $targetUserId)
  }
`);

export const sendIceCandidateMutation = graphql(`
  #graphql
  mutation SendIceCandidate($callId: String!, $candidate: String!, $targetUserId: String!) {
    sendIceCandidate(callId: $callId, candidate: $candidate, targetUserId: $targetUserId)
  }
`);

export const endCallMutation = graphql(`
  #graphql
  mutation EndCall($callId: String!) {
    endCall(callId: $callId)
  }
`);

export const muteAudioMutation = graphql(`
  #graphql
  mutation MuteAudio($callId: String!) {
    muteAudio(callId: $callId)
  }
`);

export const unmuteAudioMutation = graphql(`
  #graphql
  mutation UnmuteAudio($callId: String!) {
    unmuteAudio(callId: $callId)
  }
`);

export const showVideoMutation = graphql(`
  #graphql
  mutation ShowVideo($callId: String!) {
    showVideo(callId: $callId)
  }
`);

export const hideVideoMutation = graphql(`
  #graphql
  mutation HideVideo($callId: String!) {
    hideVideo(callId: $callId)
  }
`);