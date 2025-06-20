/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    #graphql\n    mutation createTweet($payload: CreateTweetData!){\n        createTweet(payload: $payload)\n    }\n": types.CreateTweetDocument,
    "\n    #graphql\n    mutation LikeTweet($tweetId: ID!){\n        LikeTweet(tweetId: $tweetId)\n    }\n": types.LikeTweetDocument,
    "\n    #graphql\n    mutation UnlikeTweet($tweetId: ID!){\n        UnlikeTweet(tweetId: $tweetId)\n    }\n": types.UnlikeTweetDocument,
    "\n    #graphql\n    mutation deleteTweet($tweetId: ID!){\n        deleteTweet(tweetId: $tweetId)\n    }\n": types.DeleteTweetDocument,
    "\n    #graphql\n    mutation deleteComment($commentId: ID!){\n        deleteComment(commentId: $commentId)\n    }\n": types.DeleteCommentDocument,
    "\n    #graphql\n    mutation createComment($payload: CreateCommentData!){\n        createComment(payload: $payload){\n            id\n            user{\n                id\n                name\n            }\n            tweet{\n                id\n                user{\n                    id\n                    name\n                }\n            }\n        }\n    }\n": types.CreateCommentDocument,
    "\n    #graphql\n    mutation likeComment($commentId: ID!){\n        likeComment(commentId: $commentId)\n    }\n": types.LikeCommentDocument,
    "\n    #graphql\n    mutation unlikeComment($commentId: ID!){\n        unlikeComment(commentId: $commentId)\n    }\n": types.UnlikeCommentDocument,
    "\n    #graphql\n    mutation deleteMedia($mediaUrl: String!){\n        deleteMedia(mediaUrl: $mediaUrl)\n    }\n": types.DeleteMediaDocument,
    "\n  #graphql\n  mutation createUser($email: String!, $password: String!, $name: String!) {\n    createUser(email: $email, password: $password, name: $name) {\n      success\n      message\n    }\n  }\n": types.CreateUserDocument,
    "\n  #graphql\n  mutation followUser($to: ID!) {\n    followUser(to: $to)\n  }\n": types.FollowUserDocument,
    "\n  #graphql\n  mutation unfollowUser($from: ID!, $to: ID!) {\n    unfollowUser(from: $from, to: $to)\n  }\n": types.UnfollowUserDocument,
    "\n  #graphql\n  mutation createNotification($payload: createNotificationData!) {\n    createNotification(payload: $payload)\n  }\n": types.CreateNotificationDocument,
    "\n  #graphql\n  mutation updateNotification($id: ID!) {\n    updateNotification(id: $id)\n  }\n": types.UpdateNotificationDocument,
    "\n  #graphql\n  mutation updateAllNotifications {\n    updateAllNotifications\n  }\n": types.UpdateAllNotificationsDocument,
    "\n  #graphql\n  mutation updateUser($payload: updateUserData!) {\n    updateUser(payload: $payload) {\n      success\n      message\n      updated\n    }\n  }\n": types.UpdateUserDocument,
    "\n  #graphql\n  mutation createBookmark($tweetId: ID, $commentId: ID) {\n    createBookmark(tweetId: $tweetId, commentId: $commentId)\n  }\n": types.CreateBookmarkDocument,
    "\n  #graphql\n  mutation removeBookmark($tweetId: ID, $commentId: ID) {\n    removeBookmark(tweetId: $tweetId, commentId: $commentId)\n  }\n": types.RemoveBookmarkDocument,
    "\n  #graphql\n  mutation createSubscription(\n    $payload: createSubscriptionPayload!\n  ) {\n    createSubscription(payload: $payload) \n  }\n": types.CreateSubscriptionDocument,
    "\n  #graphql\n  mutation cancelSubscription($subscriptionId: String, $option: Int!) {\n    cancelSubscription(subscriptionId: $subscriptionId, option: $option)\n  }\n": types.CancelSubscriptionDocument,
    "\n  #graphql\n  mutation updateSubscription($payload: updateSubscriptionPayload!) {\n    updateSubscription(payload: $payload) \n  }\n": types.UpdateSubscriptionDocument,
    "\n  #graphql\n  mutation CreateConversation($userIds: [ID!]!, $name: String) {\n    createConversation(userIds: $userIds, name: $name) {\n      id\n      existing\n    }\n  }\n": types.CreateConversationDocument,
    "\n  #graphql\n  mutation handleUserTypingStatus($userId: ID!, $conversationId: ID!, $typingStatus: Boolean!) {\n    handleUserTypingStatus(userId: $userId, conversationId: $conversationId, typingStatus: $typingStatus) \n  }\n": types.HandleUserTypingStatusDocument,
    "\n  #graphql\n  mutation SendMessage($conversationId: ID!, $content: String!) {\n    sendMessage(conversationId: $conversationId, content: $content)\n  }\n": types.SendMessageDocument,
    "\n  #graphql\n  mutation MarkConversationAsRead($conversationId: ID!) {\n    markConversationAsRead(conversationId: $conversationId)\n  }\n": types.MarkConversationAsReadDocument,
    "\n  #graphql\n  mutation StartCall($participants: [ID]!, $conversationId: String!, $type: CallType!) {\n    startCall(participants: $participants, conversationId: $conversationId, type: $type){\n      callId\n      success\n      error\n    }\n  }\n": types.StartCallDocument,
    "\n  #graphql\n  mutation AcceptCall($callId: String!) {\n    acceptCall(callId: $callId)\n  }\n": types.AcceptCallDocument,
    "\n  #graphql\n  mutation DeclineCall($callId: String!) {\n    declineCall(callId: $callId)\n  }\n": types.DeclineCallDocument,
    "\n  #graphql\n  mutation MissedCall($callId: String!) {\n    missedCall(callId: $callId)\n  }\n": types.MissedCallDocument,
    "\n  #graphql\n  mutation SendOffer($callId: String!, $sdp: String!, $targetUserId: String!) {\n    sendOffer(callId: $callId, sdp: $sdp, targetUserId: $targetUserId)\n  }\n": types.SendOfferDocument,
    "\n  #graphql\n  mutation SendAnswer($callId: String!, $sdp: String!, $targetUserId: String!) {\n    sendAnswer(callId: $callId, sdp: $sdp, targetUserId: $targetUserId)\n  }\n": types.SendAnswerDocument,
    "\n  #graphql\n  mutation SendIceCandidate($callId: String!, $candidate: String!, $targetUserId: String!) {\n    sendIceCandidate(callId: $callId, candidate: $candidate, targetUserId: $targetUserId)\n  }\n": types.SendIceCandidateDocument,
    "\n  #graphql\n  mutation EndCall($callId: String!) {\n    endCall(callId: $callId)\n  }\n": types.EndCallDocument,
    "\n  #graphql\n  mutation MuteAudio($callId: String!) {\n    muteAudio(callId: $callId)\n  }\n": types.MuteAudioDocument,
    "\n  #graphql\n  mutation UnmuteAudio($callId: String!) {\n    unmuteAudio(callId: $callId)\n  }\n": types.UnmuteAudioDocument,
    "\n  #graphql\n  mutation ShowVideo($callId: String!) {\n    showVideo(callId: $callId)\n  }\n": types.ShowVideoDocument,
    "\n  #graphql\n  mutation HideVideo($callId: String!) {\n    hideVideo(callId: $callId)\n  }\n": types.HideVideoDocument,
    "\n  #graphql\n  query GetPaginatedTweets($cursor: String, $limit: Int) {\n    getPaginatedTweets(cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n          isVerified\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetPaginatedTweetsDocument,
    "\n  #graphql\n  query getPaginatedUserTweets($userId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedUserTweets(userId: $userId,cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n          isVerified\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetPaginatedUserTweetsDocument,
    "\n  #graphql\n  query getSignedUrlforTweet($mediaType: String!, $mediaName: String!) {\n    getSignedURLForTweet(mediaType: $mediaType, mediaName: $mediaName)\n  }\n": types.GetSignedUrlforTweetDocument,
    "\n  #graphql\n  query getSignedUrlforComment($mediaType: String!, $mediaName: String!) {\n    getSignedURLForComment(mediaType: $mediaType, mediaName: $mediaName)\n  }\n": types.GetSignedUrlforCommentDocument,
    "\n  #graphql\n  query getTweetById($tweetid: ID!) {\n    getTweet(id: $tweetid) {\n      id\n      content\n      mediaUrl\n      mediaType\n      likes\n      createdAt\n      user {\n        id\n        userName\n        name\n        profileImageUrl\n        isVerified\n      }\n    }\n  }\n": types.GetTweetByIdDocument,
    "\n  #graphql\n  query getPaginatedCommentsByTweetId($tweetId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedCommentsByTweetId(tweetId: $tweetId, cursor: $cursor, limit: $limit) {\n      comments {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n          isVerified\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetPaginatedCommentsByTweetIdDocument,
    "\n  #graphql\n  query verifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token) {\n      token\n      id\n      email\n      name\n      profileImageUrl\n    }\n  }\n": types.VerifyUserGoogleTokenDocument,
    "\n  #graphql\n  query verifyUserCredential($email: String!, $password: String!) {\n    verifyUserCredential(email: $email, password: $password) {\n      id\n      email\n      token\n      name\n      profileImageUrl\n    }\n  }\n": types.VerifyUserCredentialDocument,
    "\n  #graphql\n  query UserLoginErrors($email: String!, $password: String!) {\n    checkLoginCredentials(email: $email, password: $password) {\n      success\n      message\n    }\n  }\n": types.UserLoginErrorsDocument,
    "\n  #graphql\n  query getCurrentUser {\n    getCurrentUser {\n      id\n      email\n      name\n      userName\n      createdAt\n      profileImageUrl\n      bio\n      notificationCount\n      location\n      website\n      followers\n      following\n      isVerified\n      notificationPreference {\n        likes\n        comments\n        follows\n      }\n      bookmark {\n        id\n        userId\n        bookmarks {\n          id\n          type\n          tweetId\n          commentId\n        }\n      }\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      email\n      name\n      profileImageUrl\n      userName\n      bio\n      location\n      website\n      createdAt\n      followers\n      following\n      isVerified\n    }\n  }\n": types.GetUserByIdDocument,
    "\n  #graphql\n  query getSignedUrlForUser($mediaType: String!, $mediaName: String!) {\n    getSignedUrlForUser(mediaType: $mediaType, mediaName: $mediaName)\n  }\n": types.GetSignedUrlForUserDocument,
    "\n  #graphql\n  query getNotifications {\n    getNotifications {\n      id\n      tweetId\n      commentId\n      notifiedUserId\n      type\n      read\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        profileImageUrl\n        userName\n        followers\n        following\n        isVerified\n      }\n      tweet {\n        id\n        content\n      }\n      comment {\n        id\n        content\n      }\n    }\n  }\n": types.GetNotificationsDocument,
    "\n  #graphql\n  query getUserBookmarks($cursor: String, $limit: Int) {\n    getUserBookmarks(cursor: $cursor, limit: $limit) {\n      bookmarks {\n        id\n        type\n        createdAt\n        tweet {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          commentsLength\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n            isVerified\n          }\n        }\n        comment {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n            isVerified\n          }\n          tweet {\n            id\n            user {\n              id\n              name\n              userName\n            }\n          }\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetUserBookmarksDocument,
    "\n  #graphql\n  query getRecommendedUsers($cursor: String, $limit: Int) {\n    getRecommendedUsers(cursor: $cursor, limit: $limit) {\n      users {\n        id\n        name\n        userName\n        bio\n        profileImageUrl\n        followers\n        following\n        isVerified\n      }\n      nextCursor\n    }\n  }\n": types.GetRecommendedUsersDocument,
    "\n  #graphql\n  query getUserFollowers($id: ID!, $cursor: String, $limit: Int) {\n    getUserFollowers(id: $id, cursor: $cursor, limit: $limit) {\n      users {\n        id\n        name\n        userName\n        bio\n        profileImageUrl\n        followers\n        following\n        isVerified\n      }\n      nextCursor\n    }\n  }\n": types.GetUserFollowersDocument,
    "\n  #graphql\n  query getUserFollowing($id: ID!, $cursor: String, $limit: Int) {\n    getUserFollowing(id: $id, cursor: $cursor, limit: $limit) {\n      users {\n        id\n        name\n        userName\n        bio\n        profileImageUrl\n        followers\n        following\n        isVerified\n      }\n      nextCursor\n    }\n  }\n": types.GetUserFollowingDocument,
    "\n  #graphql\n  query getSubscription {\n    getSubscription {\n      id\n      userId\n      plan\n      price\n      planId\n      subscriptionId\n      customerId\n      active\n      autorenew\n      interval\n      shortUrl\n      startDate\n      endDate\n      user {\n        id\n        name\n        userName\n        profileImageUrl\n        email\n        location\n      }\n    }\n  }\n": types.GetSubscriptionDocument,
    "\n  #graphql\n  query GetConversations($limit: Int, $cursor: ID) {\n    getConversations(limit: $limit, cursor: $cursor) {\n      conversations {\n        id\n        name\n        lastMessageAt\n        lastMessage\n        createdAt\n        numberOfUnreadMessages\n        lastMessageSenderId\n        readBy\n        admin {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n        participants {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetConversationsDocument,
    "\n  #graphql\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      id\n      name\n      lastMessageAt\n      lastMessage\n      createdAt\n      numberOfUnreadMessages\n      lastMessageSenderId\n      readBy\n      admin {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n      participants {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n    }\n  }\n": types.GetConversationDocument,
    "\n  #graphql\n  query GetConversationByUserId($userId: ID!) {\n    getConversationByUserId(userId: $userId) {\n      id\n    }\n  }\n": types.GetConversationByUserIdDocument,
    "\n  #graphql\n  query GetMessages($conversationId: ID!, $limit: Int, $cursor: ID) {\n    getMessages(\n      conversationId: $conversationId\n      limit: $limit\n      cursor: $cursor\n    ) {\n      messages {\n        id\n        content\n        createdAt\n        updatedAt\n        deletedAt\n        sender {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n        deletedBy {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetMessagesDocument,
    "\n  #graphql\n  query GetUsersForConversation($limit: Int, $cursor: ID, $search: String) {\n    getUsersForConversation(limit: $limit, cursor: $cursor, search: $search) {\n      users {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n      nextCursor\n    }\n  }\n": types.GetUsersForConversationDocument,
    "\n  #graphql\n  query OnlineUsers($userIds: [ID!]!) {\n    onlineUsers(userIds: $userIds) {\n      userId\n      online\n    }\n  }\n": types.OnlineUsersDocument,
    "\n  #graphql\n  query getMessageNotification {\n    getMessageNotification\n  }\n": types.GetMessageNotificationDocument,
    "\n  #graphql\n  query getCallDetails($callId: String!) {\n    getCallDetails(callId: $callId) {\n      id\n      type\n      status\n      startedAt\n      callerId\n      endedAt\n      callPickedAt\n      conversationId\n      conversation{\n        name\n        id\n        \n      }\n      participants {\n        callId\n        userId\n        joinedAt\n        leftAt\n        audioEnabled\n        videoEnabled\n        accepted\n        user {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n      }\n    }\n  }\n": types.GetCallDetailsDocument,
    "\n  subscription MessageSent($conversationId: ID!) {\n    messageSent(conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      updatedAt\n      deletedAt\n      sender {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n      deletedBy {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n    }\n  }\n": types.MessageSentDocument,
    "\n  subscription UserTyping($conversationId: ID!) {\n    userTyping(conversationId: $conversationId) {\n      userId\n      conversationId\n      typing\n    }\n  }\n": types.UserTypingDocument,
    "\n  subscription onlineStatusUpdated($userIds: [ID!]!) {\n    onlineStatusUpdated(userIds: $userIds) {\n      online\n      userId\n    }\n  }\n": types.OnlineStatusUpdatedDocument,
    "\n  subscription SeenMessage($conversationId: ID!) {\n    seenMessage(conversationId: $conversationId) {\n      conversationId\n      userId\n      readAt\n    }\n  }\n": types.SeenMessageDocument,
    "\n  subscription MessageNotificationUpdated($userId: ID!) {\n    messageNotificationUpdated(userId: $userId) {\n      userId\n      conversationId\n      timeStamp\n    }\n  }\n": types.MessageNotificationUpdatedDocument,
    "\n  subscription OnIncomingCall($userId: String!) {\n    onIncomingCall(userId: $userId) {\n      id\n      type\n      status\n      conversationId\n      callerId\n      startedAt\n      endedAt\n      conversation {\n        id\n        name\n      }\n      participants {\n        user {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n        joinedAt\n        leftAt\n        audioEnabled\n        videoEnabled\n        accepted\n      }\n    }\n  }\n": types.OnIncomingCallDocument,
    "\n  subscription OnCallAnswer($callId: String!) {\n    onCallAnswer(callId: $callId) {\n      userId\n      callId\n      accepted\n      declined\n    }\n  }\n": types.OnCallAnswerDocument,
    "\n  subscription OnOffer($userId: String!) {\n    onOffer(userId: $userId) {\n      sdp\n      fromUserId\n      callId\n    }\n  }\n": types.OnOfferDocument,
    "\n  subscription OnAnswer($userId: String!) {\n    onAnswer(userId: $userId) {\n      sdp\n      fromUserId\n      callId\n    }\n  }\n": types.OnAnswerDocument,
    "\n  subscription OnIceCandidate($userId: String!) {\n    onIceCandidate(userId: $userId) {\n      candidate\n      fromUserId\n      callId\n    }\n  }\n": types.OnIceCandidateDocument,
    "\n  subscription OnCallEnded($callId: String!) {\n    onCallEnded(callId: $callId) {\n      callId\n      host\n    }\n  }\n": types.OnCallEndedDocument,
    "\n  subscription OnParticipantLeft($callId: String!) {\n    onParticipantLeft(callId: $callId) {\n      callId\n      userId\n    }\n  }\n": types.OnParticipantLeftDocument,
    "\n  subscription OnMediaUpdate($callId: String!) {\n    onMediaUpdate(callId: $callId) {\n      callId\n      userId\n      audioEnabled\n      videoEnabled\n    }\n  }\n": types.OnMediaUpdateDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation createTweet($payload: CreateTweetData!){\n        createTweet(payload: $payload)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation createTweet($payload: CreateTweetData!){\n        createTweet(payload: $payload)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation LikeTweet($tweetId: ID!){\n        LikeTweet(tweetId: $tweetId)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation LikeTweet($tweetId: ID!){\n        LikeTweet(tweetId: $tweetId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation UnlikeTweet($tweetId: ID!){\n        UnlikeTweet(tweetId: $tweetId)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation UnlikeTweet($tweetId: ID!){\n        UnlikeTweet(tweetId: $tweetId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation deleteTweet($tweetId: ID!){\n        deleteTweet(tweetId: $tweetId)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation deleteTweet($tweetId: ID!){\n        deleteTweet(tweetId: $tweetId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation deleteComment($commentId: ID!){\n        deleteComment(commentId: $commentId)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation deleteComment($commentId: ID!){\n        deleteComment(commentId: $commentId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation createComment($payload: CreateCommentData!){\n        createComment(payload: $payload){\n            id\n            user{\n                id\n                name\n            }\n            tweet{\n                id\n                user{\n                    id\n                    name\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    #graphql\n    mutation createComment($payload: CreateCommentData!){\n        createComment(payload: $payload){\n            id\n            user{\n                id\n                name\n            }\n            tweet{\n                id\n                user{\n                    id\n                    name\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation likeComment($commentId: ID!){\n        likeComment(commentId: $commentId)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation likeComment($commentId: ID!){\n        likeComment(commentId: $commentId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation unlikeComment($commentId: ID!){\n        unlikeComment(commentId: $commentId)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation unlikeComment($commentId: ID!){\n        unlikeComment(commentId: $commentId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation deleteMedia($mediaUrl: String!){\n        deleteMedia(mediaUrl: $mediaUrl)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation deleteMedia($mediaUrl: String!){\n        deleteMedia(mediaUrl: $mediaUrl)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation createUser($email: String!, $password: String!, $name: String!) {\n    createUser(email: $email, password: $password, name: $name) {\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation createUser($email: String!, $password: String!, $name: String!) {\n    createUser(email: $email, password: $password, name: $name) {\n      success\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation followUser($to: ID!) {\n    followUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation followUser($to: ID!) {\n    followUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation unfollowUser($from: ID!, $to: ID!) {\n    unfollowUser(from: $from, to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation unfollowUser($from: ID!, $to: ID!) {\n    unfollowUser(from: $from, to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation createNotification($payload: createNotificationData!) {\n    createNotification(payload: $payload)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation createNotification($payload: createNotificationData!) {\n    createNotification(payload: $payload)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation updateNotification($id: ID!) {\n    updateNotification(id: $id)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation updateNotification($id: ID!) {\n    updateNotification(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation updateAllNotifications {\n    updateAllNotifications\n  }\n"): (typeof documents)["\n  #graphql\n  mutation updateAllNotifications {\n    updateAllNotifications\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation updateUser($payload: updateUserData!) {\n    updateUser(payload: $payload) {\n      success\n      message\n      updated\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation updateUser($payload: updateUserData!) {\n    updateUser(payload: $payload) {\n      success\n      message\n      updated\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation createBookmark($tweetId: ID, $commentId: ID) {\n    createBookmark(tweetId: $tweetId, commentId: $commentId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation createBookmark($tweetId: ID, $commentId: ID) {\n    createBookmark(tweetId: $tweetId, commentId: $commentId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation removeBookmark($tweetId: ID, $commentId: ID) {\n    removeBookmark(tweetId: $tweetId, commentId: $commentId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation removeBookmark($tweetId: ID, $commentId: ID) {\n    removeBookmark(tweetId: $tweetId, commentId: $commentId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation createSubscription(\n    $payload: createSubscriptionPayload!\n  ) {\n    createSubscription(payload: $payload) \n  }\n"): (typeof documents)["\n  #graphql\n  mutation createSubscription(\n    $payload: createSubscriptionPayload!\n  ) {\n    createSubscription(payload: $payload) \n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation cancelSubscription($subscriptionId: String, $option: Int!) {\n    cancelSubscription(subscriptionId: $subscriptionId, option: $option)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation cancelSubscription($subscriptionId: String, $option: Int!) {\n    cancelSubscription(subscriptionId: $subscriptionId, option: $option)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation updateSubscription($payload: updateSubscriptionPayload!) {\n    updateSubscription(payload: $payload) \n  }\n"): (typeof documents)["\n  #graphql\n  mutation updateSubscription($payload: updateSubscriptionPayload!) {\n    updateSubscription(payload: $payload) \n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation CreateConversation($userIds: [ID!]!, $name: String) {\n    createConversation(userIds: $userIds, name: $name) {\n      id\n      existing\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation CreateConversation($userIds: [ID!]!, $name: String) {\n    createConversation(userIds: $userIds, name: $name) {\n      id\n      existing\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation handleUserTypingStatus($userId: ID!, $conversationId: ID!, $typingStatus: Boolean!) {\n    handleUserTypingStatus(userId: $userId, conversationId: $conversationId, typingStatus: $typingStatus) \n  }\n"): (typeof documents)["\n  #graphql\n  mutation handleUserTypingStatus($userId: ID!, $conversationId: ID!, $typingStatus: Boolean!) {\n    handleUserTypingStatus(userId: $userId, conversationId: $conversationId, typingStatus: $typingStatus) \n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation SendMessage($conversationId: ID!, $content: String!) {\n    sendMessage(conversationId: $conversationId, content: $content)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation SendMessage($conversationId: ID!, $content: String!) {\n    sendMessage(conversationId: $conversationId, content: $content)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation MarkConversationAsRead($conversationId: ID!) {\n    markConversationAsRead(conversationId: $conversationId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation MarkConversationAsRead($conversationId: ID!) {\n    markConversationAsRead(conversationId: $conversationId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation StartCall($participants: [ID]!, $conversationId: String!, $type: CallType!) {\n    startCall(participants: $participants, conversationId: $conversationId, type: $type){\n      callId\n      success\n      error\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation StartCall($participants: [ID]!, $conversationId: String!, $type: CallType!) {\n    startCall(participants: $participants, conversationId: $conversationId, type: $type){\n      callId\n      success\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation AcceptCall($callId: String!) {\n    acceptCall(callId: $callId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation AcceptCall($callId: String!) {\n    acceptCall(callId: $callId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation DeclineCall($callId: String!) {\n    declineCall(callId: $callId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation DeclineCall($callId: String!) {\n    declineCall(callId: $callId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation MissedCall($callId: String!) {\n    missedCall(callId: $callId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation MissedCall($callId: String!) {\n    missedCall(callId: $callId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation SendOffer($callId: String!, $sdp: String!, $targetUserId: String!) {\n    sendOffer(callId: $callId, sdp: $sdp, targetUserId: $targetUserId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation SendOffer($callId: String!, $sdp: String!, $targetUserId: String!) {\n    sendOffer(callId: $callId, sdp: $sdp, targetUserId: $targetUserId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation SendAnswer($callId: String!, $sdp: String!, $targetUserId: String!) {\n    sendAnswer(callId: $callId, sdp: $sdp, targetUserId: $targetUserId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation SendAnswer($callId: String!, $sdp: String!, $targetUserId: String!) {\n    sendAnswer(callId: $callId, sdp: $sdp, targetUserId: $targetUserId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation SendIceCandidate($callId: String!, $candidate: String!, $targetUserId: String!) {\n    sendIceCandidate(callId: $callId, candidate: $candidate, targetUserId: $targetUserId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation SendIceCandidate($callId: String!, $candidate: String!, $targetUserId: String!) {\n    sendIceCandidate(callId: $callId, candidate: $candidate, targetUserId: $targetUserId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation EndCall($callId: String!) {\n    endCall(callId: $callId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation EndCall($callId: String!) {\n    endCall(callId: $callId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation MuteAudio($callId: String!) {\n    muteAudio(callId: $callId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation MuteAudio($callId: String!) {\n    muteAudio(callId: $callId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation UnmuteAudio($callId: String!) {\n    unmuteAudio(callId: $callId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation UnmuteAudio($callId: String!) {\n    unmuteAudio(callId: $callId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation ShowVideo($callId: String!) {\n    showVideo(callId: $callId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation ShowVideo($callId: String!) {\n    showVideo(callId: $callId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation HideVideo($callId: String!) {\n    hideVideo(callId: $callId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation HideVideo($callId: String!) {\n    hideVideo(callId: $callId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetPaginatedTweets($cursor: String, $limit: Int) {\n    getPaginatedTweets(cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n          isVerified\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetPaginatedTweets($cursor: String, $limit: Int) {\n    getPaginatedTweets(cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n          isVerified\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getPaginatedUserTweets($userId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedUserTweets(userId: $userId,cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n          isVerified\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getPaginatedUserTweets($userId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedUserTweets(userId: $userId,cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n          isVerified\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getSignedUrlforTweet($mediaType: String!, $mediaName: String!) {\n    getSignedURLForTweet(mediaType: $mediaType, mediaName: $mediaName)\n  }\n"): (typeof documents)["\n  #graphql\n  query getSignedUrlforTweet($mediaType: String!, $mediaName: String!) {\n    getSignedURLForTweet(mediaType: $mediaType, mediaName: $mediaName)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getSignedUrlforComment($mediaType: String!, $mediaName: String!) {\n    getSignedURLForComment(mediaType: $mediaType, mediaName: $mediaName)\n  }\n"): (typeof documents)["\n  #graphql\n  query getSignedUrlforComment($mediaType: String!, $mediaName: String!) {\n    getSignedURLForComment(mediaType: $mediaType, mediaName: $mediaName)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getTweetById($tweetid: ID!) {\n    getTweet(id: $tweetid) {\n      id\n      content\n      mediaUrl\n      mediaType\n      likes\n      createdAt\n      user {\n        id\n        userName\n        name\n        profileImageUrl\n        isVerified\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getTweetById($tweetid: ID!) {\n    getTweet(id: $tweetid) {\n      id\n      content\n      mediaUrl\n      mediaType\n      likes\n      createdAt\n      user {\n        id\n        userName\n        name\n        profileImageUrl\n        isVerified\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getPaginatedCommentsByTweetId($tweetId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedCommentsByTweetId(tweetId: $tweetId, cursor: $cursor, limit: $limit) {\n      comments {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n          isVerified\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getPaginatedCommentsByTweetId($tweetId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedCommentsByTweetId(tweetId: $tweetId, cursor: $cursor, limit: $limit) {\n      comments {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n          isVerified\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query verifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token) {\n      token\n      id\n      email\n      name\n      profileImageUrl\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query verifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token) {\n      token\n      id\n      email\n      name\n      profileImageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query verifyUserCredential($email: String!, $password: String!) {\n    verifyUserCredential(email: $email, password: $password) {\n      id\n      email\n      token\n      name\n      profileImageUrl\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query verifyUserCredential($email: String!, $password: String!) {\n    verifyUserCredential(email: $email, password: $password) {\n      id\n      email\n      token\n      name\n      profileImageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query UserLoginErrors($email: String!, $password: String!) {\n    checkLoginCredentials(email: $email, password: $password) {\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query UserLoginErrors($email: String!, $password: String!) {\n    checkLoginCredentials(email: $email, password: $password) {\n      success\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getCurrentUser {\n    getCurrentUser {\n      id\n      email\n      name\n      userName\n      createdAt\n      profileImageUrl\n      bio\n      notificationCount\n      location\n      website\n      followers\n      following\n      isVerified\n      notificationPreference {\n        likes\n        comments\n        follows\n      }\n      bookmark {\n        id\n        userId\n        bookmarks {\n          id\n          type\n          tweetId\n          commentId\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getCurrentUser {\n    getCurrentUser {\n      id\n      email\n      name\n      userName\n      createdAt\n      profileImageUrl\n      bio\n      notificationCount\n      location\n      website\n      followers\n      following\n      isVerified\n      notificationPreference {\n        likes\n        comments\n        follows\n      }\n      bookmark {\n        id\n        userId\n        bookmarks {\n          id\n          type\n          tweetId\n          commentId\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      email\n      name\n      profileImageUrl\n      userName\n      bio\n      location\n      website\n      createdAt\n      followers\n      following\n      isVerified\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      email\n      name\n      profileImageUrl\n      userName\n      bio\n      location\n      website\n      createdAt\n      followers\n      following\n      isVerified\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getSignedUrlForUser($mediaType: String!, $mediaName: String!) {\n    getSignedUrlForUser(mediaType: $mediaType, mediaName: $mediaName)\n  }\n"): (typeof documents)["\n  #graphql\n  query getSignedUrlForUser($mediaType: String!, $mediaName: String!) {\n    getSignedUrlForUser(mediaType: $mediaType, mediaName: $mediaName)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getNotifications {\n    getNotifications {\n      id\n      tweetId\n      commentId\n      notifiedUserId\n      type\n      read\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        profileImageUrl\n        userName\n        followers\n        following\n        isVerified\n      }\n      tweet {\n        id\n        content\n      }\n      comment {\n        id\n        content\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getNotifications {\n    getNotifications {\n      id\n      tweetId\n      commentId\n      notifiedUserId\n      type\n      read\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        profileImageUrl\n        userName\n        followers\n        following\n        isVerified\n      }\n      tweet {\n        id\n        content\n      }\n      comment {\n        id\n        content\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getUserBookmarks($cursor: String, $limit: Int) {\n    getUserBookmarks(cursor: $cursor, limit: $limit) {\n      bookmarks {\n        id\n        type\n        createdAt\n        tweet {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          commentsLength\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n            isVerified\n          }\n        }\n        comment {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n            isVerified\n          }\n          tweet {\n            id\n            user {\n              id\n              name\n              userName\n            }\n          }\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getUserBookmarks($cursor: String, $limit: Int) {\n    getUserBookmarks(cursor: $cursor, limit: $limit) {\n      bookmarks {\n        id\n        type\n        createdAt\n        tweet {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          commentsLength\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n            isVerified\n          }\n        }\n        comment {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n            isVerified\n          }\n          tweet {\n            id\n            user {\n              id\n              name\n              userName\n            }\n          }\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getRecommendedUsers($cursor: String, $limit: Int) {\n    getRecommendedUsers(cursor: $cursor, limit: $limit) {\n      users {\n        id\n        name\n        userName\n        bio\n        profileImageUrl\n        followers\n        following\n        isVerified\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getRecommendedUsers($cursor: String, $limit: Int) {\n    getRecommendedUsers(cursor: $cursor, limit: $limit) {\n      users {\n        id\n        name\n        userName\n        bio\n        profileImageUrl\n        followers\n        following\n        isVerified\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getUserFollowers($id: ID!, $cursor: String, $limit: Int) {\n    getUserFollowers(id: $id, cursor: $cursor, limit: $limit) {\n      users {\n        id\n        name\n        userName\n        bio\n        profileImageUrl\n        followers\n        following\n        isVerified\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getUserFollowers($id: ID!, $cursor: String, $limit: Int) {\n    getUserFollowers(id: $id, cursor: $cursor, limit: $limit) {\n      users {\n        id\n        name\n        userName\n        bio\n        profileImageUrl\n        followers\n        following\n        isVerified\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getUserFollowing($id: ID!, $cursor: String, $limit: Int) {\n    getUserFollowing(id: $id, cursor: $cursor, limit: $limit) {\n      users {\n        id\n        name\n        userName\n        bio\n        profileImageUrl\n        followers\n        following\n        isVerified\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getUserFollowing($id: ID!, $cursor: String, $limit: Int) {\n    getUserFollowing(id: $id, cursor: $cursor, limit: $limit) {\n      users {\n        id\n        name\n        userName\n        bio\n        profileImageUrl\n        followers\n        following\n        isVerified\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getSubscription {\n    getSubscription {\n      id\n      userId\n      plan\n      price\n      planId\n      subscriptionId\n      customerId\n      active\n      autorenew\n      interval\n      shortUrl\n      startDate\n      endDate\n      user {\n        id\n        name\n        userName\n        profileImageUrl\n        email\n        location\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getSubscription {\n    getSubscription {\n      id\n      userId\n      plan\n      price\n      planId\n      subscriptionId\n      customerId\n      active\n      autorenew\n      interval\n      shortUrl\n      startDate\n      endDate\n      user {\n        id\n        name\n        userName\n        profileImageUrl\n        email\n        location\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetConversations($limit: Int, $cursor: ID) {\n    getConversations(limit: $limit, cursor: $cursor) {\n      conversations {\n        id\n        name\n        lastMessageAt\n        lastMessage\n        createdAt\n        numberOfUnreadMessages\n        lastMessageSenderId\n        readBy\n        admin {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n        participants {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetConversations($limit: Int, $cursor: ID) {\n    getConversations(limit: $limit, cursor: $cursor) {\n      conversations {\n        id\n        name\n        lastMessageAt\n        lastMessage\n        createdAt\n        numberOfUnreadMessages\n        lastMessageSenderId\n        readBy\n        admin {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n        participants {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      id\n      name\n      lastMessageAt\n      lastMessage\n      createdAt\n      numberOfUnreadMessages\n      lastMessageSenderId\n      readBy\n      admin {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n      participants {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      id\n      name\n      lastMessageAt\n      lastMessage\n      createdAt\n      numberOfUnreadMessages\n      lastMessageSenderId\n      readBy\n      admin {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n      participants {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetConversationByUserId($userId: ID!) {\n    getConversationByUserId(userId: $userId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetConversationByUserId($userId: ID!) {\n    getConversationByUserId(userId: $userId) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetMessages($conversationId: ID!, $limit: Int, $cursor: ID) {\n    getMessages(\n      conversationId: $conversationId\n      limit: $limit\n      cursor: $cursor\n    ) {\n      messages {\n        id\n        content\n        createdAt\n        updatedAt\n        deletedAt\n        sender {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n        deletedBy {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetMessages($conversationId: ID!, $limit: Int, $cursor: ID) {\n    getMessages(\n      conversationId: $conversationId\n      limit: $limit\n      cursor: $cursor\n    ) {\n      messages {\n        id\n        content\n        createdAt\n        updatedAt\n        deletedAt\n        sender {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n        deletedBy {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetUsersForConversation($limit: Int, $cursor: ID, $search: String) {\n    getUsersForConversation(limit: $limit, cursor: $cursor, search: $search) {\n      users {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetUsersForConversation($limit: Int, $cursor: ID, $search: String) {\n    getUsersForConversation(limit: $limit, cursor: $cursor, search: $search) {\n      users {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query OnlineUsers($userIds: [ID!]!) {\n    onlineUsers(userIds: $userIds) {\n      userId\n      online\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query OnlineUsers($userIds: [ID!]!) {\n    onlineUsers(userIds: $userIds) {\n      userId\n      online\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getMessageNotification {\n    getMessageNotification\n  }\n"): (typeof documents)["\n  #graphql\n  query getMessageNotification {\n    getMessageNotification\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getCallDetails($callId: String!) {\n    getCallDetails(callId: $callId) {\n      id\n      type\n      status\n      startedAt\n      callerId\n      endedAt\n      callPickedAt\n      conversationId\n      conversation{\n        name\n        id\n        \n      }\n      participants {\n        callId\n        userId\n        joinedAt\n        leftAt\n        audioEnabled\n        videoEnabled\n        accepted\n        user {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getCallDetails($callId: String!) {\n    getCallDetails(callId: $callId) {\n      id\n      type\n      status\n      startedAt\n      callerId\n      endedAt\n      callPickedAt\n      conversationId\n      conversation{\n        name\n        id\n        \n      }\n      participants {\n        callId\n        userId\n        joinedAt\n        leftAt\n        audioEnabled\n        videoEnabled\n        accepted\n        user {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription MessageSent($conversationId: ID!) {\n    messageSent(conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      updatedAt\n      deletedAt\n      sender {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n      deletedBy {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription MessageSent($conversationId: ID!) {\n    messageSent(conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      updatedAt\n      deletedAt\n      sender {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n      deletedBy {\n        id\n        name\n        userName\n        profileImageUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription UserTyping($conversationId: ID!) {\n    userTyping(conversationId: $conversationId) {\n      userId\n      conversationId\n      typing\n    }\n  }\n"): (typeof documents)["\n  subscription UserTyping($conversationId: ID!) {\n    userTyping(conversationId: $conversationId) {\n      userId\n      conversationId\n      typing\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription onlineStatusUpdated($userIds: [ID!]!) {\n    onlineStatusUpdated(userIds: $userIds) {\n      online\n      userId\n    }\n  }\n"): (typeof documents)["\n  subscription onlineStatusUpdated($userIds: [ID!]!) {\n    onlineStatusUpdated(userIds: $userIds) {\n      online\n      userId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription SeenMessage($conversationId: ID!) {\n    seenMessage(conversationId: $conversationId) {\n      conversationId\n      userId\n      readAt\n    }\n  }\n"): (typeof documents)["\n  subscription SeenMessage($conversationId: ID!) {\n    seenMessage(conversationId: $conversationId) {\n      conversationId\n      userId\n      readAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription MessageNotificationUpdated($userId: ID!) {\n    messageNotificationUpdated(userId: $userId) {\n      userId\n      conversationId\n      timeStamp\n    }\n  }\n"): (typeof documents)["\n  subscription MessageNotificationUpdated($userId: ID!) {\n    messageNotificationUpdated(userId: $userId) {\n      userId\n      conversationId\n      timeStamp\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription OnIncomingCall($userId: String!) {\n    onIncomingCall(userId: $userId) {\n      id\n      type\n      status\n      conversationId\n      callerId\n      startedAt\n      endedAt\n      conversation {\n        id\n        name\n      }\n      participants {\n        user {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n        joinedAt\n        leftAt\n        audioEnabled\n        videoEnabled\n        accepted\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription OnIncomingCall($userId: String!) {\n    onIncomingCall(userId: $userId) {\n      id\n      type\n      status\n      conversationId\n      callerId\n      startedAt\n      endedAt\n      conversation {\n        id\n        name\n      }\n      participants {\n        user {\n          id\n          name\n          userName\n          profileImageUrl\n        }\n        joinedAt\n        leftAt\n        audioEnabled\n        videoEnabled\n        accepted\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription OnCallAnswer($callId: String!) {\n    onCallAnswer(callId: $callId) {\n      userId\n      callId\n      accepted\n      declined\n    }\n  }\n"): (typeof documents)["\n  subscription OnCallAnswer($callId: String!) {\n    onCallAnswer(callId: $callId) {\n      userId\n      callId\n      accepted\n      declined\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription OnOffer($userId: String!) {\n    onOffer(userId: $userId) {\n      sdp\n      fromUserId\n      callId\n    }\n  }\n"): (typeof documents)["\n  subscription OnOffer($userId: String!) {\n    onOffer(userId: $userId) {\n      sdp\n      fromUserId\n      callId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription OnAnswer($userId: String!) {\n    onAnswer(userId: $userId) {\n      sdp\n      fromUserId\n      callId\n    }\n  }\n"): (typeof documents)["\n  subscription OnAnswer($userId: String!) {\n    onAnswer(userId: $userId) {\n      sdp\n      fromUserId\n      callId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription OnIceCandidate($userId: String!) {\n    onIceCandidate(userId: $userId) {\n      candidate\n      fromUserId\n      callId\n    }\n  }\n"): (typeof documents)["\n  subscription OnIceCandidate($userId: String!) {\n    onIceCandidate(userId: $userId) {\n      candidate\n      fromUserId\n      callId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription OnCallEnded($callId: String!) {\n    onCallEnded(callId: $callId) {\n      callId\n      host\n    }\n  }\n"): (typeof documents)["\n  subscription OnCallEnded($callId: String!) {\n    onCallEnded(callId: $callId) {\n      callId\n      host\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription OnParticipantLeft($callId: String!) {\n    onParticipantLeft(callId: $callId) {\n      callId\n      userId\n    }\n  }\n"): (typeof documents)["\n  subscription OnParticipantLeft($callId: String!) {\n    onParticipantLeft(callId: $callId) {\n      callId\n      userId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription OnMediaUpdate($callId: String!) {\n    onMediaUpdate(callId: $callId) {\n      callId\n      userId\n      audioEnabled\n      videoEnabled\n    }\n  }\n"): (typeof documents)["\n  subscription OnMediaUpdate($callId: String!) {\n    onMediaUpdate(callId: $callId) {\n      callId\n      userId\n      audioEnabled\n      videoEnabled\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;