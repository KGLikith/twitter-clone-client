/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
};

export type Bookmark = {
  __typename?: 'Bookmark';
  bookmarks?: Maybe<Array<Maybe<BookmarkEntry>>>;
  id: Scalars['ID']['output'];
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type BookmarkEntry = {
  __typename?: 'BookmarkEntry';
  comment?: Maybe<Comment>;
  commentId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  tweet?: Maybe<Tweet>;
  tweetId?: Maybe<Scalars['ID']['output']>;
  type: BookmarkType;
};

export type BookmarkPagination = {
  __typename?: 'BookmarkPagination';
  bookmarks: Array<BookmarkEntry>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export enum BookmarkType {
  Comment = 'COMMENT',
  Tweet = 'TWEET'
}

export type Call = {
  __typename?: 'Call';
  callPickedAt?: Maybe<Scalars['DateTime']['output']>;
  callerId: Scalars['ID']['output'];
  conversation?: Maybe<Conversation>;
  conversationId: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  participants: Array<CallParticipants>;
  startedAt: Scalars['DateTime']['output'];
  status: CallStatus;
  type: CallType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CallAnswer = {
  __typename?: 'CallAnswer';
  accepted: Scalars['Boolean']['output'];
  callId: Scalars['String']['output'];
  declined?: Maybe<Scalars['Boolean']['output']>;
  userId: Scalars['String']['output'];
};

export type CallEndedEvent = {
  __typename?: 'CallEndedEvent';
  callId: Scalars['String']['output'];
  host: Scalars['Boolean']['output'];
};

export type CallIceCandidate = {
  __typename?: 'CallIceCandidate';
  callId: Scalars['String']['output'];
  candidate: Scalars['String']['output'];
  fromUserId: Scalars['String']['output'];
};

export type CallMediaUpdateEvent = {
  __typename?: 'CallMediaUpdateEvent';
  audioEnabled?: Maybe<Scalars['Boolean']['output']>;
  callId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  videoEnabled?: Maybe<Scalars['Boolean']['output']>;
};

export type CallParticipantLeftEvent = {
  __typename?: 'CallParticipantLeftEvent';
  callId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type CallParticipants = {
  __typename?: 'CallParticipants';
  accepted: Scalars['Boolean']['output'];
  audioEnabled: Scalars['Boolean']['output'];
  callId: Scalars['ID']['output'];
  joinedAt?: Maybe<Scalars['DateTime']['output']>;
  leftAt?: Maybe<Scalars['DateTime']['output']>;
  participantStatus?: Maybe<ParticipantStatus>;
  user: UserInfo;
  userId: Scalars['ID']['output'];
  videoEnabled: Scalars['Boolean']['output'];
};

export type CallSdp = {
  __typename?: 'CallSdp';
  callId: Scalars['String']['output'];
  fromUserId: Scalars['String']['output'];
  sdp: Scalars['String']['output'];
};

export enum CallStatus {
  Declined = 'DECLINED',
  Ended = 'ENDED',
  Missed = 'MISSED',
  Ongoing = 'ONGOING',
  Standby = 'STANDBY'
}

export enum CallType {
  Audio = 'AUDIO',
  Video = 'VIDEO'
}

export type Comment = {
  __typename?: 'Comment';
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  likes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  mediaType?: Maybe<Scalars['String']['output']>;
  mediaUrl?: Maybe<Scalars['String']['output']>;
  tweet: Tweet;
  user: User;
};

export type CommentPagination = {
  __typename?: 'CommentPagination';
  comments: Array<Comment>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type Conversation = {
  __typename?: 'Conversation';
  ConversationReadStatus: ConversationReadStatus;
  admin?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lastMessage?: Maybe<Scalars['String']['output']>;
  lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  lastMessageSenderId?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  numberOfUnreadMessages: Scalars['Int']['output'];
  participants: Array<User>;
  readBy: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ConversationOut = {
  __typename?: 'ConversationOut';
  existing: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
};

export type ConversationReadStatus = {
  __typename?: 'ConversationReadStatus';
  conversationId: Scalars['ID']['output'];
  readAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type CreateCommentData = {
  content: Scalars['String']['input'];
  mediaType?: InputMaybe<Scalars['String']['input']>;
  mediaUrl?: InputMaybe<Scalars['String']['input']>;
  tweetId: Scalars['ID']['input'];
};

export type CreateTweetData = {
  content: Scalars['String']['input'];
  mediaType?: InputMaybe<Scalars['String']['input']>;
  mediaUrl?: InputMaybe<Scalars['String']['input']>;
};

export type Message = {
  __typename?: 'Message';
  callId?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  conversation?: Maybe<Conversation>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  deletedBy?: Maybe<User>;
  id: Scalars['ID']['output'];
  mediaUrl?: Maybe<Scalars['String']['output']>;
  sender: User;
  type: MessageType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum MessageType {
  AudioCall = 'AUDIO_CALL',
  Image = 'IMAGE',
  Text = 'TEXT',
  Video = 'VIDEO',
  VideoCall = 'VIDEO_CALL'
}

export type Mutation = {
  __typename?: 'Mutation';
  LikeTweet?: Maybe<Scalars['Boolean']['output']>;
  UnlikeTweet?: Maybe<Scalars['Boolean']['output']>;
  acceptCall?: Maybe<Scalars['Boolean']['output']>;
  cancelSubscription?: Maybe<Scalars['Boolean']['output']>;
  createBookmark?: Maybe<Scalars['Boolean']['output']>;
  createComment?: Maybe<Comment>;
  createConversation?: Maybe<ConversationOut>;
  createNotification?: Maybe<Scalars['Boolean']['output']>;
  createSubscription?: Maybe<Scalars['Boolean']['output']>;
  createTweet?: Maybe<Scalars['Boolean']['output']>;
  createUser?: Maybe<UserOut>;
  declineCall?: Maybe<Scalars['Boolean']['output']>;
  deleteComment?: Maybe<Scalars['Boolean']['output']>;
  deleteMedia?: Maybe<Scalars['Boolean']['output']>;
  deleteTweet?: Maybe<Scalars['Boolean']['output']>;
  endCall?: Maybe<Scalars['Boolean']['output']>;
  followUser?: Maybe<Scalars['Boolean']['output']>;
  handleUserTypingStatus?: Maybe<Scalars['Boolean']['output']>;
  hideVideo?: Maybe<Scalars['Boolean']['output']>;
  likeComment?: Maybe<Scalars['Boolean']['output']>;
  markConversationAsRead?: Maybe<Scalars['Boolean']['output']>;
  missedCall?: Maybe<Scalars['Boolean']['output']>;
  muteAudio?: Maybe<Scalars['Boolean']['output']>;
  removeBookmark?: Maybe<Scalars['Boolean']['output']>;
  sendAnswer?: Maybe<Scalars['Boolean']['output']>;
  sendIceCandidate?: Maybe<Scalars['Boolean']['output']>;
  sendMessage?: Maybe<Scalars['Boolean']['output']>;
  sendOffer?: Maybe<Scalars['Boolean']['output']>;
  showVideo?: Maybe<Scalars['Boolean']['output']>;
  startCall: StartCallEvent;
  unfollowUser?: Maybe<Scalars['Boolean']['output']>;
  unlikeComment?: Maybe<Scalars['Boolean']['output']>;
  unmuteAudio?: Maybe<Scalars['Boolean']['output']>;
  updateAllNotifications?: Maybe<Scalars['Boolean']['output']>;
  updateNotification?: Maybe<Scalars['Boolean']['output']>;
  updateSubscription?: Maybe<Scalars['Boolean']['output']>;
  updateUser?: Maybe<UpdateUserOut>;
};


export type MutationLikeTweetArgs = {
  tweetId: Scalars['ID']['input'];
};


export type MutationUnlikeTweetArgs = {
  tweetId: Scalars['ID']['input'];
};


export type MutationAcceptCallArgs = {
  callId: Scalars['String']['input'];
};


export type MutationCancelSubscriptionArgs = {
  option: Scalars['Int']['input'];
  subscriptionId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateBookmarkArgs = {
  commentId?: InputMaybe<Scalars['ID']['input']>;
  tweetId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationCreateCommentArgs = {
  payload: CreateCommentData;
};


export type MutationCreateConversationArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  userIds: Array<Scalars['ID']['input']>;
};


export type MutationCreateNotificationArgs = {
  payload: CreateNotificationData;
};


export type MutationCreateSubscriptionArgs = {
  payload?: InputMaybe<CreateSubscriptionPayload>;
};


export type MutationCreateTweetArgs = {
  payload: CreateTweetData;
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationDeclineCallArgs = {
  callId: Scalars['String']['input'];
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationDeleteMediaArgs = {
  mediaUrl: Scalars['String']['input'];
};


export type MutationDeleteTweetArgs = {
  tweetId: Scalars['ID']['input'];
};


export type MutationEndCallArgs = {
  callId: Scalars['String']['input'];
};


export type MutationFollowUserArgs = {
  to: Scalars['ID']['input'];
};


export type MutationHandleUserTypingStatusArgs = {
  conversationId: Scalars['ID']['input'];
  typingStatus: Scalars['Boolean']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationHideVideoArgs = {
  callId: Scalars['String']['input'];
};


export type MutationLikeCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationMarkConversationAsReadArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationMissedCallArgs = {
  callId: Scalars['String']['input'];
};


export type MutationMuteAudioArgs = {
  callId: Scalars['String']['input'];
};


export type MutationRemoveBookmarkArgs = {
  commentId?: InputMaybe<Scalars['ID']['input']>;
  tweetId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationSendAnswerArgs = {
  callId: Scalars['String']['input'];
  sdp: Scalars['String']['input'];
  targetUserId: Scalars['String']['input'];
};


export type MutationSendIceCandidateArgs = {
  callId: Scalars['String']['input'];
  candidate: Scalars['String']['input'];
  targetUserId: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  content: Scalars['String']['input'];
  conversationId: Scalars['ID']['input'];
};


export type MutationSendOfferArgs = {
  callId: Scalars['String']['input'];
  sdp: Scalars['String']['input'];
  targetUserId: Scalars['String']['input'];
};


export type MutationShowVideoArgs = {
  callId: Scalars['String']['input'];
};


export type MutationStartCallArgs = {
  conversationId: Scalars['String']['input'];
  participants: Array<InputMaybe<Scalars['ID']['input']>>;
  type: CallType;
};


export type MutationUnfollowUserArgs = {
  from: Scalars['ID']['input'];
  to: Scalars['ID']['input'];
};


export type MutationUnlikeCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationUnmuteAudioArgs = {
  callId: Scalars['String']['input'];
};


export type MutationUpdateNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateSubscriptionArgs = {
  payload?: InputMaybe<UpdateSubscriptionPayload>;
};


export type MutationUpdateUserArgs = {
  payload: UpdateUserData;
};

export type Notification = {
  __typename?: 'Notification';
  comment?: Maybe<Comment>;
  commentId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notifiedUserId: Scalars['ID']['output'];
  read: Scalars['Boolean']['output'];
  tweet?: Maybe<Tweet>;
  tweetId?: Maybe<Scalars['ID']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  user?: Maybe<Array<Maybe<User>>>;
};

export type NotificationEvent = {
  __typename?: 'NotificationEvent';
  conversationId: Scalars['ID']['output'];
  timeStamp: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type OnlineEvent = {
  __typename?: 'OnlineEvent';
  online: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
};

export type PaginatedConversationUsers = {
  __typename?: 'PaginatedConversationUsers';
  nextCursor?: Maybe<Scalars['ID']['output']>;
  users: Array<User>;
};

export type PaginatedConversations = {
  __typename?: 'PaginatedConversations';
  conversations: Array<Conversation>;
  nextCursor?: Maybe<Scalars['ID']['output']>;
};

export type PaginatedMessages = {
  __typename?: 'PaginatedMessages';
  messages: Array<Message>;
  nextCursor?: Maybe<Scalars['ID']['output']>;
};

export enum Plan {
  Basic = 'BASIC',
  Free = 'FREE',
  Premium = 'PREMIUM'
}

export type Query = {
  __typename?: 'Query';
  checkLoginCredentials?: Maybe<UserOut>;
  getCallDetails?: Maybe<Call>;
  getConversation?: Maybe<Conversation>;
  getConversationByUserId?: Maybe<Conversation>;
  getConversations: PaginatedConversations;
  getCurrentUser?: Maybe<User>;
  getMessageNotification?: Maybe<Scalars['Int']['output']>;
  getMessages: PaginatedMessages;
  getNotifications?: Maybe<Array<Maybe<Notification>>>;
  getPaginatedCommentsByTweetId: CommentPagination;
  getPaginatedTweets: TweetPagination;
  getPaginatedUserTweets: TweetPagination;
  getRecommendedUsers: UserPagination;
  getSignedURLForComment?: Maybe<Scalars['String']['output']>;
  getSignedURLForTweet?: Maybe<Scalars['String']['output']>;
  getSignedUrlForUser?: Maybe<Scalars['String']['output']>;
  getSubscription?: Maybe<Subscription>;
  getTweet?: Maybe<Tweet>;
  getUserBookmarks: BookmarkPagination;
  getUserById?: Maybe<User>;
  getUserFollowers: UserPagination;
  getUserFollowing: UserPagination;
  getUsersForConversation?: Maybe<PaginatedConversationUsers>;
  onlineUsers: Array<OnlineEvent>;
  verifyGoogleToken?: Maybe<SessionData>;
  verifyUserCredential?: Maybe<SessionData>;
};


export type QueryCheckLoginCredentialsArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type QueryGetCallDetailsArgs = {
  callId: Scalars['String']['input'];
};


export type QueryGetConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type QueryGetConversationByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetConversationsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetMessagesArgs = {
  conversationId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPaginatedCommentsByTweetIdArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  tweetId: Scalars['ID']['input'];
};


export type QueryGetPaginatedTweetsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPaginatedUserTweetsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryGetRecommendedUsersArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetSignedUrlForCommentArgs = {
  mediaName: Scalars['String']['input'];
  mediaType: Scalars['String']['input'];
};


export type QueryGetSignedUrlForTweetArgs = {
  mediaName: Scalars['String']['input'];
  mediaType: Scalars['String']['input'];
};


export type QueryGetSignedUrlForUserArgs = {
  mediaName: Scalars['String']['input'];
  mediaType: Scalars['String']['input'];
};


export type QueryGetTweetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserBookmarksArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserFollowersArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUserFollowingArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUsersForConversationArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOnlineUsersArgs = {
  userIds: Array<Scalars['ID']['input']>;
};


export type QueryVerifyGoogleTokenArgs = {
  token: Scalars['String']['input'];
};


export type QueryVerifyUserCredentialArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SeenEvent = {
  __typename?: 'SeenEvent';
  conversationId: Scalars['ID']['output'];
  readAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type StartCallEvent = {
  __typename?: 'StartCallEvent';
  callId?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  active: Scalars['Boolean']['output'];
  autorenew?: Maybe<Scalars['Boolean']['output']>;
  customerId?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  interval?: Maybe<Scalars['String']['output']>;
  messageNotificationUpdated: NotificationEvent;
  messageSent: Message;
  onAnswer: CallSdp;
  onCallAnswer: CallAnswer;
  onCallEnded: CallEndedEvent;
  onIceCandidate: CallIceCandidate;
  onIncomingCall: Call;
  onMediaUpdate: CallMediaUpdateEvent;
  onOffer: CallSdp;
  onParticipantLeft: CallParticipantLeftEvent;
  onlineStatusUpdated: OnlineEvent;
  plan: Plan;
  planId?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  seenMessage: SeenEvent;
  shortUrl?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  subscriptionId?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
  userTyping: TypingEvent;
};


export type SubscriptionMessageNotificationUpdatedArgs = {
  userId: Scalars['ID']['input'];
};


export type SubscriptionMessageSentArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionOnAnswerArgs = {
  userId: Scalars['String']['input'];
};


export type SubscriptionOnCallAnswerArgs = {
  callId: Scalars['String']['input'];
};


export type SubscriptionOnCallEndedArgs = {
  callId: Scalars['String']['input'];
};


export type SubscriptionOnIceCandidateArgs = {
  userId: Scalars['String']['input'];
};


export type SubscriptionOnIncomingCallArgs = {
  userId: Scalars['String']['input'];
};


export type SubscriptionOnMediaUpdateArgs = {
  callId: Scalars['String']['input'];
};


export type SubscriptionOnOfferArgs = {
  userId: Scalars['String']['input'];
};


export type SubscriptionOnParticipantLeftArgs = {
  callId: Scalars['String']['input'];
};


export type SubscriptionOnlineStatusUpdatedArgs = {
  userIds: Array<Scalars['ID']['input']>;
};


export type SubscriptionSeenMessageArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionUserTypingArgs = {
  conversationId: Scalars['ID']['input'];
};

export type Tweet = {
  __typename?: 'Tweet';
  commentsLength: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  likes: Array<Maybe<Scalars['String']['output']>>;
  mediaType?: Maybe<Scalars['String']['output']>;
  mediaUrl?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type TweetPagination = {
  __typename?: 'TweetPagination';
  nextCursor?: Maybe<Scalars['String']['output']>;
  tweets: Array<Tweet>;
};

export type TypingEvent = {
  __typename?: 'TypingEvent';
  conversationId: Scalars['ID']['output'];
  typing: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
};

export type UpdateUserOut = {
  __typename?: 'UpdateUserOut';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  updated: Scalars['Boolean']['output'];
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']['output']>;
  bookmark?: Maybe<Bookmark>;
  createdAt?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  followers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  following?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id: Scalars['ID']['output'];
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notificationCount?: Maybe<Scalars['Int']['output']>;
  notificationPreference: NotificationPreference;
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export type UserOut = {
  __typename?: 'UserOut';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UserPagination = {
  __typename?: 'UserPagination';
  nextCursor?: Maybe<Scalars['String']['output']>;
  users: Array<User>;
};

export type CreateNotificationData = {
  commentId?: InputMaybe<Scalars['String']['input']>;
  tweetId?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateSubscriptionPayload = {
  interval: Scalars['String']['input'];
  plan: Plan;
  planId: Scalars['String']['input'];
  price: Scalars['String']['input'];
  shortUrl: Scalars['String']['input'];
  subscriptionId: Scalars['String']['input'];
};

export type NotificationPreference = {
  __typename?: 'notificationPreference';
  comments?: Maybe<Scalars['Boolean']['output']>;
  follows?: Maybe<Scalars['Boolean']['output']>;
  likes?: Maybe<Scalars['Boolean']['output']>;
};

export type NotificationPreferenceInput = {
  comments?: InputMaybe<Scalars['Boolean']['input']>;
  follows?: InputMaybe<Scalars['Boolean']['input']>;
  likes?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum ParticipantStatus {
  Declined = 'DECLINED',
  Joined = 'JOINED',
  Left = 'LEFT',
  Missed = 'MISSED',
  Standby = 'STANDBY'
}

export type SessionData = {
  __typename?: 'sessionData';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
};

export type UpdateSubscriptionPayload = {
  active: Scalars['Boolean']['input'];
  customerId?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  planId: Scalars['String']['input'];
  price?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  subscriptionId: Scalars['String']['input'];
};

export type UpdateUserData = {
  bio?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notificationPreference: NotificationPreferenceInput;
  profileImageUrl?: InputMaybe<Scalars['String']['input']>;
  userName: Scalars['String']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTweetMutationVariables = Exact<{
  payload: CreateTweetData;
}>;


export type CreateTweetMutation = { __typename?: 'Mutation', createTweet?: boolean | null };

export type LikeTweetMutationVariables = Exact<{
  tweetId: Scalars['ID']['input'];
}>;


export type LikeTweetMutation = { __typename?: 'Mutation', LikeTweet?: boolean | null };

export type UnlikeTweetMutationVariables = Exact<{
  tweetId: Scalars['ID']['input'];
}>;


export type UnlikeTweetMutation = { __typename?: 'Mutation', UnlikeTweet?: boolean | null };

export type DeleteTweetMutationVariables = Exact<{
  tweetId: Scalars['ID']['input'];
}>;


export type DeleteTweetMutation = { __typename?: 'Mutation', deleteTweet?: boolean | null };

export type DeleteCommentMutationVariables = Exact<{
  commentId: Scalars['ID']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment?: boolean | null };

export type CreateCommentMutationVariables = Exact<{
  payload: CreateCommentData;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment?: { __typename?: 'Comment', id: string, user: { __typename?: 'User', id: string, name: string }, tweet: { __typename?: 'Tweet', id: string, user: { __typename?: 'User', id: string, name: string } } } | null };

export type LikeCommentMutationVariables = Exact<{
  commentId: Scalars['ID']['input'];
}>;


export type LikeCommentMutation = { __typename?: 'Mutation', likeComment?: boolean | null };

export type UnlikeCommentMutationVariables = Exact<{
  commentId: Scalars['ID']['input'];
}>;


export type UnlikeCommentMutation = { __typename?: 'Mutation', unlikeComment?: boolean | null };

export type DeleteMediaMutationVariables = Exact<{
  mediaUrl: Scalars['String']['input'];
}>;


export type DeleteMediaMutation = { __typename?: 'Mutation', deleteMedia?: boolean | null };

export type CreateUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'UserOut', success: boolean, message?: string | null } | null };

export type FollowUserMutationVariables = Exact<{
  to: Scalars['ID']['input'];
}>;


export type FollowUserMutation = { __typename?: 'Mutation', followUser?: boolean | null };

export type UnfollowUserMutationVariables = Exact<{
  from: Scalars['ID']['input'];
  to: Scalars['ID']['input'];
}>;


export type UnfollowUserMutation = { __typename?: 'Mutation', unfollowUser?: boolean | null };

export type CreateNotificationMutationVariables = Exact<{
  payload: CreateNotificationData;
}>;


export type CreateNotificationMutation = { __typename?: 'Mutation', createNotification?: boolean | null };

export type UpdateNotificationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UpdateNotificationMutation = { __typename?: 'Mutation', updateNotification?: boolean | null };

export type UpdateAllNotificationsMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateAllNotificationsMutation = { __typename?: 'Mutation', updateAllNotifications?: boolean | null };

export type UpdateUserMutationVariables = Exact<{
  payload: UpdateUserData;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'UpdateUserOut', success: boolean, message?: string | null, updated: boolean } | null };

export type CreateBookmarkMutationVariables = Exact<{
  tweetId?: InputMaybe<Scalars['ID']['input']>;
  commentId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateBookmarkMutation = { __typename?: 'Mutation', createBookmark?: boolean | null };

export type RemoveBookmarkMutationVariables = Exact<{
  tweetId?: InputMaybe<Scalars['ID']['input']>;
  commentId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type RemoveBookmarkMutation = { __typename?: 'Mutation', removeBookmark?: boolean | null };

export type CreateSubscriptionMutationVariables = Exact<{
  payload: CreateSubscriptionPayload;
}>;


export type CreateSubscriptionMutation = { __typename?: 'Mutation', createSubscription?: boolean | null };

export type CancelSubscriptionMutationVariables = Exact<{
  subscriptionId?: InputMaybe<Scalars['String']['input']>;
  option: Scalars['Int']['input'];
}>;


export type CancelSubscriptionMutation = { __typename?: 'Mutation', cancelSubscription?: boolean | null };

export type UpdateSubscriptionMutationVariables = Exact<{
  payload: UpdateSubscriptionPayload;
}>;


export type UpdateSubscriptionMutation = { __typename?: 'Mutation', updateSubscription?: boolean | null };

export type CreateConversationMutationVariables = Exact<{
  userIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateConversationMutation = { __typename?: 'Mutation', createConversation?: { __typename?: 'ConversationOut', id: string, existing: boolean } | null };

export type HandleUserTypingStatusMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  conversationId: Scalars['ID']['input'];
  typingStatus: Scalars['Boolean']['input'];
}>;


export type HandleUserTypingStatusMutation = { __typename?: 'Mutation', handleUserTypingStatus?: boolean | null };

export type SendMessageMutationVariables = Exact<{
  conversationId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage?: boolean | null };

export type MarkConversationAsReadMutationVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type MarkConversationAsReadMutation = { __typename?: 'Mutation', markConversationAsRead?: boolean | null };

export type StartCallMutationVariables = Exact<{
  participants: Array<InputMaybe<Scalars['ID']['input']>> | InputMaybe<Scalars['ID']['input']>;
  conversationId: Scalars['String']['input'];
  type: CallType;
}>;


export type StartCallMutation = { __typename?: 'Mutation', startCall: { __typename?: 'StartCallEvent', callId?: string | null, success: boolean, error?: string | null } };

export type AcceptCallMutationVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type AcceptCallMutation = { __typename?: 'Mutation', acceptCall?: boolean | null };

export type DeclineCallMutationVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type DeclineCallMutation = { __typename?: 'Mutation', declineCall?: boolean | null };

export type MissedCallMutationVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type MissedCallMutation = { __typename?: 'Mutation', missedCall?: boolean | null };

export type SendOfferMutationVariables = Exact<{
  callId: Scalars['String']['input'];
  sdp: Scalars['String']['input'];
  targetUserId: Scalars['String']['input'];
}>;


export type SendOfferMutation = { __typename?: 'Mutation', sendOffer?: boolean | null };

export type SendAnswerMutationVariables = Exact<{
  callId: Scalars['String']['input'];
  sdp: Scalars['String']['input'];
  targetUserId: Scalars['String']['input'];
}>;


export type SendAnswerMutation = { __typename?: 'Mutation', sendAnswer?: boolean | null };

export type SendIceCandidateMutationVariables = Exact<{
  callId: Scalars['String']['input'];
  candidate: Scalars['String']['input'];
  targetUserId: Scalars['String']['input'];
}>;


export type SendIceCandidateMutation = { __typename?: 'Mutation', sendIceCandidate?: boolean | null };

export type EndCallMutationVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type EndCallMutation = { __typename?: 'Mutation', endCall?: boolean | null };

export type MuteAudioMutationVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type MuteAudioMutation = { __typename?: 'Mutation', muteAudio?: boolean | null };

export type UnmuteAudioMutationVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type UnmuteAudioMutation = { __typename?: 'Mutation', unmuteAudio?: boolean | null };

export type ShowVideoMutationVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type ShowVideoMutation = { __typename?: 'Mutation', showVideo?: boolean | null };

export type HideVideoMutationVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type HideVideoMutation = { __typename?: 'Mutation', hideVideo?: boolean | null };

export type GetPaginatedTweetsQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPaginatedTweetsQuery = { __typename?: 'Query', getPaginatedTweets: { __typename?: 'TweetPagination', nextCursor?: string | null, tweets: Array<{ __typename?: 'Tweet', id: string, content: string, mediaUrl?: string | null, mediaType?: string | null, likes: Array<string | null>, createdAt: string, commentsLength: number, user: { __typename?: 'User', id: string, userName?: string | null, name: string, profileImageUrl?: string | null, isVerified?: boolean | null } }> } };

export type GetPaginatedUserTweetsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPaginatedUserTweetsQuery = { __typename?: 'Query', getPaginatedUserTweets: { __typename?: 'TweetPagination', nextCursor?: string | null, tweets: Array<{ __typename?: 'Tweet', id: string, content: string, mediaUrl?: string | null, mediaType?: string | null, likes: Array<string | null>, createdAt: string, commentsLength: number, user: { __typename?: 'User', id: string, userName?: string | null, name: string, profileImageUrl?: string | null, isVerified?: boolean | null } }> } };

export type GetSignedUrlforTweetQueryVariables = Exact<{
  mediaType: Scalars['String']['input'];
  mediaName: Scalars['String']['input'];
}>;


export type GetSignedUrlforTweetQuery = { __typename?: 'Query', getSignedURLForTweet?: string | null };

export type GetSignedUrlforCommentQueryVariables = Exact<{
  mediaType: Scalars['String']['input'];
  mediaName: Scalars['String']['input'];
}>;


export type GetSignedUrlforCommentQuery = { __typename?: 'Query', getSignedURLForComment?: string | null };

export type GetTweetByIdQueryVariables = Exact<{
  tweetid: Scalars['ID']['input'];
}>;


export type GetTweetByIdQuery = { __typename?: 'Query', getTweet?: { __typename?: 'Tweet', id: string, content: string, mediaUrl?: string | null, mediaType?: string | null, likes: Array<string | null>, createdAt: string, user: { __typename?: 'User', id: string, userName?: string | null, name: string, profileImageUrl?: string | null, isVerified?: boolean | null } } | null };

export type GetPaginatedCommentsByTweetIdQueryVariables = Exact<{
  tweetId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPaginatedCommentsByTweetIdQuery = { __typename?: 'Query', getPaginatedCommentsByTweetId: { __typename?: 'CommentPagination', nextCursor?: string | null, comments: Array<{ __typename?: 'Comment', id: string, content: string, mediaUrl?: string | null, mediaType?: string | null, likes?: Array<string | null> | null, createdAt: string, user: { __typename?: 'User', id: string, userName?: string | null, name: string, profileImageUrl?: string | null, isVerified?: boolean | null } }> } };

export type VerifyUserGoogleTokenQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyUserGoogleTokenQuery = { __typename?: 'Query', verifyGoogleToken?: { __typename?: 'sessionData', token: string, id: string, email: string, name: string, profileImageUrl?: string | null } | null };

export type VerifyUserCredentialQueryVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type VerifyUserCredentialQuery = { __typename?: 'Query', verifyUserCredential?: { __typename?: 'sessionData', id: string, email: string, token: string, name: string, profileImageUrl?: string | null } | null };

export type UserLoginErrorsQueryVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type UserLoginErrorsQuery = { __typename?: 'Query', checkLoginCredentials?: { __typename?: 'UserOut', success: boolean, message?: string | null } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', id: string, email: string, name: string, userName?: string | null, createdAt?: string | null, profileImageUrl?: string | null, bio?: string | null, notificationCount?: number | null, location?: string | null, website?: string | null, followers?: Array<string | null> | null, following?: Array<string | null> | null, isVerified?: boolean | null, notificationPreference: { __typename?: 'notificationPreference', likes?: boolean | null, comments?: boolean | null, follows?: boolean | null }, bookmark?: { __typename?: 'Bookmark', id: string, userId: string, bookmarks?: Array<{ __typename?: 'BookmarkEntry', id: string, type: BookmarkType, tweetId?: string | null, commentId?: string | null } | null> | null } | null } | null };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById?: { __typename?: 'User', id: string, email: string, name: string, profileImageUrl?: string | null, userName?: string | null, bio?: string | null, location?: string | null, website?: string | null, createdAt?: string | null, followers?: Array<string | null> | null, following?: Array<string | null> | null, isVerified?: boolean | null } | null };

export type GetSignedUrlForUserQueryVariables = Exact<{
  mediaType: Scalars['String']['input'];
  mediaName: Scalars['String']['input'];
}>;


export type GetSignedUrlForUserQuery = { __typename?: 'Query', getSignedUrlForUser?: string | null };

export type GetNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotificationsQuery = { __typename?: 'Query', getNotifications?: Array<{ __typename?: 'Notification', id: string, tweetId?: string | null, commentId?: string | null, notifiedUserId: string, type: string, read: boolean, createdAt: string, updatedAt: string, user?: Array<{ __typename?: 'User', id: string, name: string, profileImageUrl?: string | null, userName?: string | null, followers?: Array<string | null> | null, following?: Array<string | null> | null, isVerified?: boolean | null } | null> | null, tweet?: { __typename?: 'Tweet', id: string, content: string } | null, comment?: { __typename?: 'Comment', id: string, content: string } | null } | null> | null };

export type GetUserBookmarksQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUserBookmarksQuery = { __typename?: 'Query', getUserBookmarks: { __typename?: 'BookmarkPagination', nextCursor?: string | null, bookmarks: Array<{ __typename?: 'BookmarkEntry', id: string, type: BookmarkType, createdAt: string, tweet?: { __typename?: 'Tweet', id: string, content: string, createdAt: string, mediaUrl?: string | null, mediaType?: string | null, likes: Array<string | null>, commentsLength: number, user: { __typename?: 'User', id: string, name: string, profileImageUrl?: string | null, userName?: string | null, isVerified?: boolean | null } } | null, comment?: { __typename?: 'Comment', id: string, content: string, createdAt: string, mediaUrl?: string | null, mediaType?: string | null, likes?: Array<string | null> | null, user: { __typename?: 'User', id: string, name: string, profileImageUrl?: string | null, userName?: string | null, isVerified?: boolean | null }, tweet: { __typename?: 'Tweet', id: string, user: { __typename?: 'User', id: string, name: string, userName?: string | null } } } | null }> } };

export type GetRecommendedUsersQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecommendedUsersQuery = { __typename?: 'Query', getRecommendedUsers: { __typename?: 'UserPagination', nextCursor?: string | null, users: Array<{ __typename?: 'User', id: string, name: string, userName?: string | null, bio?: string | null, profileImageUrl?: string | null, followers?: Array<string | null> | null, following?: Array<string | null> | null, isVerified?: boolean | null }> } };

export type GetUserFollowersQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUserFollowersQuery = { __typename?: 'Query', getUserFollowers: { __typename?: 'UserPagination', nextCursor?: string | null, users: Array<{ __typename?: 'User', id: string, name: string, userName?: string | null, bio?: string | null, profileImageUrl?: string | null, followers?: Array<string | null> | null, following?: Array<string | null> | null, isVerified?: boolean | null }> } };

export type GetUserFollowingQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUserFollowingQuery = { __typename?: 'Query', getUserFollowing: { __typename?: 'UserPagination', nextCursor?: string | null, users: Array<{ __typename?: 'User', id: string, name: string, userName?: string | null, bio?: string | null, profileImageUrl?: string | null, followers?: Array<string | null> | null, following?: Array<string | null> | null, isVerified?: boolean | null }> } };

export type GetSubscriptionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSubscriptionQuery = { __typename?: 'Query', getSubscription?: { __typename?: 'Subscription', id: string, userId: string, plan: Plan, price?: string | null, planId?: string | null, subscriptionId?: string | null, customerId?: string | null, active: boolean, autorenew?: boolean | null, interval?: string | null, shortUrl?: string | null, startDate?: any | null, endDate?: any | null, user?: { __typename?: 'User', id: string, name: string, userName?: string | null, profileImageUrl?: string | null, email: string, location?: string | null } | null } | null };

export type GetConversationsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetConversationsQuery = { __typename?: 'Query', getConversations: { __typename?: 'PaginatedConversations', nextCursor?: string | null, conversations: Array<{ __typename?: 'Conversation', id: string, name?: string | null, lastMessageAt?: any | null, lastMessage?: string | null, createdAt: any, numberOfUnreadMessages: number, lastMessageSenderId?: string | null, readBy: Array<string>, admin?: { __typename?: 'User', id: string, name: string, userName?: string | null, profileImageUrl?: string | null } | null, participants: Array<{ __typename?: 'User', id: string, name: string, userName?: string | null, profileImageUrl?: string | null }> }> } };

export type GetConversationQueryVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type GetConversationQuery = { __typename?: 'Query', getConversation?: { __typename?: 'Conversation', id: string, name?: string | null, lastMessageAt?: any | null, lastMessage?: string | null, createdAt: any, numberOfUnreadMessages: number, lastMessageSenderId?: string | null, readBy: Array<string>, admin?: { __typename?: 'User', id: string, name: string, userName?: string | null, profileImageUrl?: string | null } | null, participants: Array<{ __typename?: 'User', id: string, name: string, userName?: string | null, profileImageUrl?: string | null }> } | null };

export type GetConversationByUserIdQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetConversationByUserIdQuery = { __typename?: 'Query', getConversationByUserId?: { __typename?: 'Conversation', id: string } | null };

export type GetMessagesQueryVariables = Exact<{
  conversationId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetMessagesQuery = { __typename?: 'Query', getMessages: { __typename?: 'PaginatedMessages', nextCursor?: string | null, messages: Array<{ __typename?: 'Message', id: string, content: string, createdAt: any, updatedAt?: any | null, deletedAt?: any | null, sender: { __typename?: 'User', id: string, name: string, userName?: string | null, profileImageUrl?: string | null }, deletedBy?: { __typename?: 'User', id: string, name: string, userName?: string | null, profileImageUrl?: string | null } | null }> } };

export type GetUsersForConversationQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUsersForConversationQuery = { __typename?: 'Query', getUsersForConversation?: { __typename?: 'PaginatedConversationUsers', nextCursor?: string | null, users: Array<{ __typename?: 'User', id: string, name: string, userName?: string | null, profileImageUrl?: string | null }> } | null };

export type OnlineUsersQueryVariables = Exact<{
  userIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type OnlineUsersQuery = { __typename?: 'Query', onlineUsers: Array<{ __typename?: 'OnlineEvent', userId: string, online: boolean }> };

export type GetMessageNotificationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMessageNotificationQuery = { __typename?: 'Query', getMessageNotification?: number | null };

export type GetCallDetailsQueryVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type GetCallDetailsQuery = { __typename?: 'Query', getCallDetails?: { __typename?: 'Call', id: string, type: CallType, status: CallStatus, startedAt: any, callerId: string, endedAt?: any | null, callPickedAt?: any | null, conversationId: string, conversation?: { __typename?: 'Conversation', name?: string | null, id: string } | null, participants: Array<{ __typename?: 'CallParticipants', callId: string, userId: string, joinedAt?: any | null, leftAt?: any | null, audioEnabled: boolean, videoEnabled: boolean, accepted: boolean, user: { __typename?: 'UserInfo', id: string, name: string, userName?: string | null, profileImageUrl?: string | null } }> } | null };

export type MessageSentSubscriptionVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type MessageSentSubscription = { __typename?: 'Subscription', messageSent: { __typename?: 'Message', id: string, content: string, createdAt: any, updatedAt?: any | null, deletedAt?: any | null, sender: { __typename?: 'User', id: string, name: string, userName?: string | null, profileImageUrl?: string | null }, deletedBy?: { __typename?: 'User', id: string, name: string, userName?: string | null, profileImageUrl?: string | null } | null } };

export type UserTypingSubscriptionVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type UserTypingSubscription = { __typename?: 'Subscription', userTyping: { __typename?: 'TypingEvent', userId: string, conversationId: string, typing: boolean } };

export type OnlineStatusUpdatedSubscriptionVariables = Exact<{
  userIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type OnlineStatusUpdatedSubscription = { __typename?: 'Subscription', onlineStatusUpdated: { __typename?: 'OnlineEvent', online: boolean, userId: string } };

export type SeenMessageSubscriptionVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type SeenMessageSubscription = { __typename?: 'Subscription', seenMessage: { __typename?: 'SeenEvent', conversationId: string, userId: string, readAt: any } };

export type MessageNotificationUpdatedSubscriptionVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type MessageNotificationUpdatedSubscription = { __typename?: 'Subscription', messageNotificationUpdated: { __typename?: 'NotificationEvent', userId: string, conversationId: string, timeStamp: any } };

export type OnIncomingCallSubscriptionVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type OnIncomingCallSubscription = { __typename?: 'Subscription', onIncomingCall: { __typename?: 'Call', id: string, type: CallType, status: CallStatus, conversationId: string, callerId: string, startedAt: any, endedAt?: any | null, conversation?: { __typename?: 'Conversation', id: string, name?: string | null } | null, participants: Array<{ __typename?: 'CallParticipants', joinedAt?: any | null, leftAt?: any | null, audioEnabled: boolean, videoEnabled: boolean, accepted: boolean, user: { __typename?: 'UserInfo', id: string, name: string, userName?: string | null, profileImageUrl?: string | null } }> } };

export type OnCallAnswerSubscriptionVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type OnCallAnswerSubscription = { __typename?: 'Subscription', onCallAnswer: { __typename?: 'CallAnswer', userId: string, callId: string, accepted: boolean, declined?: boolean | null } };

export type OnOfferSubscriptionVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type OnOfferSubscription = { __typename?: 'Subscription', onOffer: { __typename?: 'CallSdp', sdp: string, fromUserId: string, callId: string } };

export type OnAnswerSubscriptionVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type OnAnswerSubscription = { __typename?: 'Subscription', onAnswer: { __typename?: 'CallSdp', sdp: string, fromUserId: string, callId: string } };

export type OnIceCandidateSubscriptionVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type OnIceCandidateSubscription = { __typename?: 'Subscription', onIceCandidate: { __typename?: 'CallIceCandidate', candidate: string, fromUserId: string, callId: string } };

export type OnCallEndedSubscriptionVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type OnCallEndedSubscription = { __typename?: 'Subscription', onCallEnded: { __typename?: 'CallEndedEvent', callId: string, host: boolean } };

export type OnParticipantLeftSubscriptionVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type OnParticipantLeftSubscription = { __typename?: 'Subscription', onParticipantLeft: { __typename?: 'CallParticipantLeftEvent', callId: string, userId: string } };

export type OnMediaUpdateSubscriptionVariables = Exact<{
  callId: Scalars['String']['input'];
}>;


export type OnMediaUpdateSubscription = { __typename?: 'Subscription', onMediaUpdate: { __typename?: 'CallMediaUpdateEvent', callId: string, userId: string, audioEnabled?: boolean | null, videoEnabled?: boolean | null } };


export const CreateTweetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTweet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTweetData"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}]}]}}]} as unknown as DocumentNode<CreateTweetMutation, CreateTweetMutationVariables>;
export const LikeTweetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LikeTweet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LikeTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tweetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}}}]}]}}]} as unknown as DocumentNode<LikeTweetMutation, LikeTweetMutationVariables>;
export const UnlikeTweetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnlikeTweet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UnlikeTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tweetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}}}]}]}}]} as unknown as DocumentNode<UnlikeTweetMutation, UnlikeTweetMutationVariables>;
export const DeleteTweetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTweet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tweetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}}}]}]}}]} as unknown as DocumentNode<DeleteTweetMutation, DeleteTweetMutationVariables>;
export const DeleteCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}]}]}}]} as unknown as DocumentNode<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommentData"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tweet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const LikeCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"likeComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likeComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}]}]}}]} as unknown as DocumentNode<LikeCommentMutation, LikeCommentMutationVariables>;
export const UnlikeCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unlikeComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlikeComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}]}]}}]} as unknown as DocumentNode<UnlikeCommentMutation, UnlikeCommentMutationVariables>;
export const DeleteMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mediaUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaUrl"}}}]}]}}]} as unknown as DocumentNode<DeleteMediaMutation, DeleteMediaMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const FollowUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"followUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}]}}]} as unknown as DocumentNode<FollowUserMutation, FollowUserMutationVariables>;
export const UnfollowUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unfollowUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unfollowUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}]}}]} as unknown as DocumentNode<UnfollowUserMutation, UnfollowUserMutationVariables>;
export const CreateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createNotificationData"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}]}]}}]} as unknown as DocumentNode<CreateNotificationMutation, CreateNotificationMutationVariables>;
export const UpdateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UpdateNotificationMutation, UpdateNotificationMutationVariables>;
export const UpdateAllNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateAllNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAllNotifications"}}]}}]} as unknown as DocumentNode<UpdateAllNotificationsMutation, UpdateAllNotificationsMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateUserData"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const CreateBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tweetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}]}]}}]} as unknown as DocumentNode<CreateBookmarkMutation, CreateBookmarkMutationVariables>;
export const RemoveBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tweetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}]}]}}]} as unknown as DocumentNode<RemoveBookmarkMutation, RemoveBookmarkMutationVariables>;
export const CreateSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createSubscriptionPayload"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}]}]}}]} as unknown as DocumentNode<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>;
export const CancelSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"cancelSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"option"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"subscriptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"option"},"value":{"kind":"Variable","name":{"kind":"Name","value":"option"}}}]}]}}]} as unknown as DocumentNode<CancelSubscriptionMutation, CancelSubscriptionMutationVariables>;
export const UpdateSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateSubscriptionPayload"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}]}]}}]} as unknown as DocumentNode<UpdateSubscriptionMutation, UpdateSubscriptionMutationVariables>;
export const CreateConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"existing"}}]}}]}}]} as unknown as DocumentNode<CreateConversationMutation, CreateConversationMutationVariables>;
export const HandleUserTypingStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"handleUserTypingStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"typingStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"handleUserTypingStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"typingStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"typingStatus"}}}]}]}}]} as unknown as DocumentNode<HandleUserTypingStatusMutation, HandleUserTypingStatusMutationVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}]}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const MarkConversationAsReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkConversationAsRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markConversationAsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}]}]}}]} as unknown as DocumentNode<MarkConversationAsReadMutation, MarkConversationAsReadMutationVariables>;
export const StartCallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartCall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"participants"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CallType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"participants"},"value":{"kind":"Variable","name":{"kind":"Name","value":"participants"}}},{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"callId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<StartCallMutation, StartCallMutationVariables>;
export const AcceptCallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptCall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}]}]}}]} as unknown as DocumentNode<AcceptCallMutation, AcceptCallMutationVariables>;
export const DeclineCallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeclineCall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"declineCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}]}]}}]} as unknown as DocumentNode<DeclineCallMutation, DeclineCallMutationVariables>;
export const MissedCallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MissedCall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"missedCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}]}]}}]} as unknown as DocumentNode<MissedCallMutation, MissedCallMutationVariables>;
export const SendOfferDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendOffer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sdp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendOffer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sdp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sdp"}}},{"kind":"Argument","name":{"kind":"Name","value":"targetUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetUserId"}}}]}]}}]} as unknown as DocumentNode<SendOfferMutation, SendOfferMutationVariables>;
export const SendAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sdp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sdp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sdp"}}},{"kind":"Argument","name":{"kind":"Name","value":"targetUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetUserId"}}}]}]}}]} as unknown as DocumentNode<SendAnswerMutation, SendAnswerMutationVariables>;
export const SendIceCandidateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendIceCandidate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"candidate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendIceCandidate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}},{"kind":"Argument","name":{"kind":"Name","value":"candidate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"candidate"}}},{"kind":"Argument","name":{"kind":"Name","value":"targetUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetUserId"}}}]}]}}]} as unknown as DocumentNode<SendIceCandidateMutation, SendIceCandidateMutationVariables>;
export const EndCallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EndCall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}]}]}}]} as unknown as DocumentNode<EndCallMutation, EndCallMutationVariables>;
export const MuteAudioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MuteAudio"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"muteAudio"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}]}]}}]} as unknown as DocumentNode<MuteAudioMutation, MuteAudioMutationVariables>;
export const UnmuteAudioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnmuteAudio"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unmuteAudio"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}]}]}}]} as unknown as DocumentNode<UnmuteAudioMutation, UnmuteAudioMutationVariables>;
export const ShowVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ShowVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}]}]}}]} as unknown as DocumentNode<ShowVideoMutation, ShowVideoMutationVariables>;
export const HideVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"HideVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}]}]}}]} as unknown as DocumentNode<HideVideoMutation, HideVideoMutationVariables>;
export const GetPaginatedTweetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaginatedTweets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPaginatedTweets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tweets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mediaType"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"commentsLength"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetPaginatedTweetsQuery, GetPaginatedTweetsQueryVariables>;
export const GetPaginatedUserTweetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPaginatedUserTweets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPaginatedUserTweets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tweets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mediaType"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"commentsLength"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetPaginatedUserTweetsQuery, GetPaginatedUserTweetsQueryVariables>;
export const GetSignedUrlforTweetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSignedUrlforTweet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSignedURLForTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mediaType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}}},{"kind":"Argument","name":{"kind":"Name","value":"mediaName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}}}]}]}}]} as unknown as DocumentNode<GetSignedUrlforTweetQuery, GetSignedUrlforTweetQueryVariables>;
export const GetSignedUrlforCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSignedUrlforComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSignedURLForComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mediaType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}}},{"kind":"Argument","name":{"kind":"Name","value":"mediaName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}}}]}]}}]} as unknown as DocumentNode<GetSignedUrlforCommentQuery, GetSignedUrlforCommentQueryVariables>;
export const GetTweetByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTweetById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mediaType"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}}]}}]}}]} as unknown as DocumentNode<GetTweetByIdQuery, GetTweetByIdQueryVariables>;
export const GetPaginatedCommentsByTweetIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPaginatedCommentsByTweetId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPaginatedCommentsByTweetId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tweetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mediaType"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetPaginatedCommentsByTweetIdQuery, GetPaginatedCommentsByTweetIdQueryVariables>;
export const VerifyUserGoogleTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"verifyUserGoogleToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyGoogleToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}}]} as unknown as DocumentNode<VerifyUserGoogleTokenQuery, VerifyUserGoogleTokenQueryVariables>;
export const VerifyUserCredentialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"verifyUserCredential"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyUserCredential"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}}]} as unknown as DocumentNode<VerifyUserCredentialQuery, VerifyUserCredentialQueryVariables>;
export const UserLoginErrorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserLoginErrors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkLoginCredentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UserLoginErrorsQuery, UserLoginErrorsQueryVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"notificationCount"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"notificationPreference"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"follows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookmark"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"bookmarks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tweetId"}},{"kind":"Field","name":{"kind":"Name","value":"commentId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetSignedUrlForUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSignedUrlForUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSignedUrlForUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mediaType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}}},{"kind":"Argument","name":{"kind":"Name","value":"mediaName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}}}]}]}}]} as unknown as DocumentNode<GetSignedUrlForUserQuery, GetSignedUrlForUserQueryVariables>;
export const GetNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tweetId"}},{"kind":"Field","name":{"kind":"Name","value":"commentId"}},{"kind":"Field","name":{"kind":"Name","value":"notifiedUserId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tweet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]} as unknown as DocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const GetUserBookmarksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserBookmarks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserBookmarks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmarks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"tweet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mediaType"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"commentsLength"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mediaType"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tweet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetUserBookmarksQuery, GetUserBookmarksQueryVariables>;
export const GetRecommendedUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRecommendedUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRecommendedUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetRecommendedUsersQuery, GetRecommendedUsersQueryVariables>;
export const GetUserFollowersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserFollowers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserFollowers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetUserFollowersQuery, GetUserFollowersQueryVariables>;
export const GetUserFollowingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserFollowing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserFollowing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetUserFollowingQuery, GetUserFollowingQueryVariables>;
export const GetSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"autorenew"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]} as unknown as DocumentNode<GetSubscriptionQuery, GetSubscriptionQueryVariables>;
export const GetConversationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetConversations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getConversations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessageAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessage"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfUnreadMessages"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessageSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"readBy"}},{"kind":"Field","name":{"kind":"Name","value":"admin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetConversationsQuery, GetConversationsQueryVariables>;
export const GetConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessageAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessage"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfUnreadMessages"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessageSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"readBy"}},{"kind":"Field","name":{"kind":"Name","value":"admin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetConversationQuery, GetConversationQueryVariables>;
export const GetConversationByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetConversationByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getConversationByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetConversationByUserIdQuery, GetConversationByUserIdQueryVariables>;
export const GetMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMessages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetMessagesQuery, GetMessagesQueryVariables>;
export const GetUsersForConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersForConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersForConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetUsersForConversationQuery, GetUsersForConversationQueryVariables>;
export const OnlineUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OnlineUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onlineUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"online"}}]}}]}}]} as unknown as DocumentNode<OnlineUsersQuery, OnlineUsersQueryVariables>;
export const GetMessageNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMessageNotification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMessageNotification"}}]}}]} as unknown as DocumentNode<GetMessageNotificationQuery, GetMessageNotificationQueryVariables>;
export const GetCallDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCallDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCallDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"callerId"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"callPickedAt"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"conversation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"callId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"leftAt"}},{"kind":"Field","name":{"kind":"Name","value":"audioEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"videoEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCallDetailsQuery, GetCallDetailsQueryVariables>;
export const MessageSentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"MessageSent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageSent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}}]}}]} as unknown as DocumentNode<MessageSentSubscription, MessageSentSubscriptionVariables>;
export const UserTypingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserTyping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userTyping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"typing"}}]}}]}}]} as unknown as DocumentNode<UserTypingSubscription, UserTypingSubscriptionVariables>;
export const OnlineStatusUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onlineStatusUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onlineStatusUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"online"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<OnlineStatusUpdatedSubscription, OnlineStatusUpdatedSubscriptionVariables>;
export const SeenMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SeenMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seenMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"readAt"}}]}}]}}]} as unknown as DocumentNode<SeenMessageSubscription, SeenMessageSubscriptionVariables>;
export const MessageNotificationUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"MessageNotificationUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageNotificationUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"timeStamp"}}]}}]}}]} as unknown as DocumentNode<MessageNotificationUpdatedSubscription, MessageNotificationUpdatedSubscriptionVariables>;
export const OnIncomingCallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnIncomingCall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onIncomingCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"callerId"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"conversation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"leftAt"}},{"kind":"Field","name":{"kind":"Name","value":"audioEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"videoEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}}]}}]}}]}}]} as unknown as DocumentNode<OnIncomingCallSubscription, OnIncomingCallSubscriptionVariables>;
export const OnCallAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnCallAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCallAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"callId"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"declined"}}]}}]}}]} as unknown as DocumentNode<OnCallAnswerSubscription, OnCallAnswerSubscriptionVariables>;
export const OnOfferDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnOffer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onOffer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sdp"}},{"kind":"Field","name":{"kind":"Name","value":"fromUserId"}},{"kind":"Field","name":{"kind":"Name","value":"callId"}}]}}]}}]} as unknown as DocumentNode<OnOfferSubscription, OnOfferSubscriptionVariables>;
export const OnAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sdp"}},{"kind":"Field","name":{"kind":"Name","value":"fromUserId"}},{"kind":"Field","name":{"kind":"Name","value":"callId"}}]}}]}}]} as unknown as DocumentNode<OnAnswerSubscription, OnAnswerSubscriptionVariables>;
export const OnIceCandidateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnIceCandidate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onIceCandidate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"candidate"}},{"kind":"Field","name":{"kind":"Name","value":"fromUserId"}},{"kind":"Field","name":{"kind":"Name","value":"callId"}}]}}]}}]} as unknown as DocumentNode<OnIceCandidateSubscription, OnIceCandidateSubscriptionVariables>;
export const OnCallEndedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnCallEnded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCallEnded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"callId"}},{"kind":"Field","name":{"kind":"Name","value":"host"}}]}}]}}]} as unknown as DocumentNode<OnCallEndedSubscription, OnCallEndedSubscriptionVariables>;
export const OnParticipantLeftDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnParticipantLeft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onParticipantLeft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"callId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<OnParticipantLeftSubscription, OnParticipantLeftSubscriptionVariables>;
export const OnMediaUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnMediaUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onMediaUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"callId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"callId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"audioEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"videoEnabled"}}]}}]}}]} as unknown as DocumentNode<OnMediaUpdateSubscription, OnMediaUpdateSubscriptionVariables>;