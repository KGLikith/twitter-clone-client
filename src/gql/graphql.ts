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
};

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

export type Mutation = {
  __typename?: 'Mutation';
  LikeTweet?: Maybe<Scalars['Boolean']['output']>;
  UnlikeTweet?: Maybe<Scalars['Boolean']['output']>;
  createComment?: Maybe<Comment>;
  createNotification?: Maybe<Scalars['Boolean']['output']>;
  createTweet?: Maybe<Scalars['Boolean']['output']>;
  deleteComment?: Maybe<Scalars['Boolean']['output']>;
  deleteMedia?: Maybe<Scalars['Boolean']['output']>;
  deleteTweet?: Maybe<Scalars['Boolean']['output']>;
  followUser?: Maybe<Scalars['Boolean']['output']>;
  likeComment?: Maybe<Scalars['Boolean']['output']>;
  unfollowUser?: Maybe<Scalars['Boolean']['output']>;
  unlikeComment?: Maybe<Scalars['Boolean']['output']>;
  updateAllNotifications?: Maybe<Scalars['Boolean']['output']>;
  updateNotification?: Maybe<Scalars['Boolean']['output']>;
  updateUser?: Maybe<UpdateUserOut>;
};


export type MutationLikeTweetArgs = {
  tweetId: Scalars['ID']['input'];
};


export type MutationUnlikeTweetArgs = {
  tweetId: Scalars['ID']['input'];
};


export type MutationCreateCommentArgs = {
  payload: CreateCommentData;
};


export type MutationCreateNotificationArgs = {
  payload: CreateNotificationData;
};


export type MutationCreateTweetArgs = {
  payload: CreateTweetData;
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


export type MutationFollowUserArgs = {
  to: Scalars['ID']['input'];
};


export type MutationLikeCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationUnfollowUserArgs = {
  to: Scalars['ID']['input'];
};


export type MutationUnlikeCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationUpdateNotificationArgs = {
  id: Scalars['ID']['input'];
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

export type Query = {
  __typename?: 'Query';
  getAllTweets?: Maybe<Array<Maybe<Tweet>>>;
  getCurrentUser?: Maybe<User>;
  getNotifications?: Maybe<Array<Maybe<Notification>>>;
  getSignedURLForComment?: Maybe<Scalars['String']['output']>;
  getSignedURLForTweet?: Maybe<Scalars['String']['output']>;
  getSignedUrlForUser?: Maybe<Scalars['String']['output']>;
  getTweet?: Maybe<Tweet>;
  getUserById?: Maybe<User>;
  getUserTweets?: Maybe<Array<Maybe<Tweet>>>;
  verifyGoogleToken?: Maybe<Scalars['String']['output']>;
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


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserTweetsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryVerifyGoogleTokenArgs = {
  token: Scalars['String']['input'];
};

export type Tweet = {
  __typename?: 'Tweet';
  comments: Array<Maybe<Comment>>;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  likes: Array<Maybe<Scalars['String']['output']>>;
  mediaType?: Maybe<Scalars['String']['output']>;
  mediaUrl?: Maybe<Scalars['String']['output']>;
  user: User;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  followers?: Maybe<Array<Maybe<User>>>;
  following?: Maybe<Array<Maybe<User>>>;
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notificationCount?: Maybe<Scalars['Int']['output']>;
  notificationPreference?: Maybe<NotificationPreference>;
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  recommendedUsers?: Maybe<Array<Maybe<User>>>;
  tweets?: Maybe<Array<Maybe<Tweet>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type CreateNotificationData = {
  commentId?: InputMaybe<Scalars['String']['input']>;
  tweetId?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  userId: Scalars['String']['input'];
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

export type FollowUserMutationVariables = Exact<{
  to: Scalars['ID']['input'];
}>;


export type FollowUserMutation = { __typename?: 'Mutation', followUser?: boolean | null };

export type UnfollowUserMutationVariables = Exact<{
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

export type GetAllTweetsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTweetsQuery = { __typename?: 'Query', getAllTweets?: Array<{ __typename?: 'Tweet', id: string, content: string, mediaUrl?: string | null, mediaType?: string | null, likes: Array<string | null>, createdAt: string, comments: Array<{ __typename?: 'Comment', id: string } | null>, user: { __typename?: 'User', id: string, userName?: string | null, name: string, profileImageUrl?: string | null } } | null> | null };

export type GetUserTweetsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserTweetsQuery = { __typename?: 'Query', getUserTweets?: Array<{ __typename?: 'Tweet', id: string, content: string, mediaUrl?: string | null, mediaType?: string | null, likes: Array<string | null>, createdAt: string, comments: Array<{ __typename?: 'Comment', id: string } | null>, user: { __typename?: 'User', id: string, userName?: string | null, name: string, profileImageUrl?: string | null } } | null> | null };

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


export type GetTweetByIdQuery = { __typename?: 'Query', getTweet?: { __typename?: 'Tweet', id: string, content: string, mediaUrl?: string | null, mediaType?: string | null, likes: Array<string | null>, createdAt: string, comments: Array<{ __typename?: 'Comment', id: string, content: string, likes?: Array<string | null> | null, mediaUrl?: string | null, mediaType?: string | null, createdAt: string, user: { __typename?: 'User', id: string, userName?: string | null, name: string, profileImageUrl?: string | null } } | null>, user: { __typename?: 'User', id: string, userName?: string | null, name: string, profileImageUrl?: string | null } } | null };

export type VerifyUserGoogleTokenQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyUserGoogleTokenQuery = { __typename?: 'Query', verifyGoogleToken?: string | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', id: string, email: string, name: string, userName?: string | null, createdAt?: string | null, profileImageUrl?: string | null, bio?: string | null, notificationCount?: number | null, location?: string | null, website?: string | null, notificationPreference?: { __typename?: 'notificationPreference', likes?: boolean | null, comments?: boolean | null, follows?: boolean | null } | null, recommendedUsers?: Array<{ __typename?: 'User', id: string, email: string, name: string, userName?: string | null, profileImageUrl?: string | null } | null> | null, followers?: Array<{ __typename?: 'User', id: string } | null> | null, following?: Array<{ __typename?: 'User', id: string } | null> | null } | null };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById?: { __typename?: 'User', id: string, email: string, name: string, profileImageUrl?: string | null, userName?: string | null, bio?: string | null, location?: string | null, website?: string | null, createdAt?: string | null, followers?: Array<{ __typename?: 'User', id: string, profileImageUrl?: string | null, name: string, userName?: string | null, bio?: string | null } | null> | null, following?: Array<{ __typename?: 'User', id: string, profileImageUrl?: string | null, name: string, userName?: string | null, bio?: string | null } | null> | null } | null };

export type GetSignedUrlForUserQueryVariables = Exact<{
  mediaType: Scalars['String']['input'];
  mediaName: Scalars['String']['input'];
}>;


export type GetSignedUrlForUserQuery = { __typename?: 'Query', getSignedUrlForUser?: string | null };

export type GetNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotificationsQuery = { __typename?: 'Query', getNotifications?: Array<{ __typename?: 'Notification', id: string, tweetId?: string | null, commentId?: string | null, notifiedUserId: string, type: string, read: boolean, createdAt: string, updatedAt: string, user?: Array<{ __typename?: 'User', id: string, name: string, profileImageUrl?: string | null, userName?: string | null, followers?: Array<{ __typename?: 'User', id: string } | null> | null } | null> | null, tweet?: { __typename?: 'Tweet', id: string, content: string } | null, comment?: { __typename?: 'Comment', id: string, content: string } | null } | null> | null };


export const CreateTweetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTweet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTweetData"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}]}]}}]} as unknown as DocumentNode<CreateTweetMutation, CreateTweetMutationVariables>;
export const LikeTweetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LikeTweet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LikeTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tweetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}}}]}]}}]} as unknown as DocumentNode<LikeTweetMutation, LikeTweetMutationVariables>;
export const UnlikeTweetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnlikeTweet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UnlikeTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tweetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}}}]}]}}]} as unknown as DocumentNode<UnlikeTweetMutation, UnlikeTweetMutationVariables>;
export const DeleteTweetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTweet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tweetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetId"}}}]}]}}]} as unknown as DocumentNode<DeleteTweetMutation, DeleteTweetMutationVariables>;
export const DeleteCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}]}]}}]} as unknown as DocumentNode<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommentData"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tweet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const LikeCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"likeComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likeComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}]}]}}]} as unknown as DocumentNode<LikeCommentMutation, LikeCommentMutationVariables>;
export const UnlikeCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unlikeComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlikeComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}]}]}}]} as unknown as DocumentNode<UnlikeCommentMutation, UnlikeCommentMutationVariables>;
export const DeleteMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mediaUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaUrl"}}}]}]}}]} as unknown as DocumentNode<DeleteMediaMutation, DeleteMediaMutationVariables>;
export const FollowUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"followUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}]}}]} as unknown as DocumentNode<FollowUserMutation, FollowUserMutationVariables>;
export const UnfollowUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unfollowUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unfollowUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}]}}]} as unknown as DocumentNode<UnfollowUserMutation, UnfollowUserMutationVariables>;
export const CreateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createNotificationData"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}]}]}}]} as unknown as DocumentNode<CreateNotificationMutation, CreateNotificationMutationVariables>;
export const UpdateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UpdateNotificationMutation, UpdateNotificationMutationVariables>;
export const UpdateAllNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateAllNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAllNotifications"}}]}}]} as unknown as DocumentNode<UpdateAllNotificationsMutation, UpdateAllNotificationsMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateUserData"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetAllTweetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllTweets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllTweets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mediaType"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllTweetsQuery, GetAllTweetsQueryVariables>;
export const GetUserTweetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserTweets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserTweets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mediaType"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserTweetsQuery, GetUserTweetsQueryVariables>;
export const GetSignedUrlforTweetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSignedUrlforTweet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSignedURLForTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mediaType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}}},{"kind":"Argument","name":{"kind":"Name","value":"mediaName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}}}]}]}}]} as unknown as DocumentNode<GetSignedUrlforTweetQuery, GetSignedUrlforTweetQueryVariables>;
export const GetSignedUrlforCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSignedUrlforComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSignedURLForComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mediaType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}}},{"kind":"Argument","name":{"kind":"Name","value":"mediaName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}}}]}]}}]} as unknown as DocumentNode<GetSignedUrlforCommentQuery, GetSignedUrlforCommentQueryVariables>;
export const GetTweetByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTweetById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tweetid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTweet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tweetid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mediaType"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mediaType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetTweetByIdQuery, GetTweetByIdQueryVariables>;
export const VerifyUserGoogleTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"verifyUserGoogleToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyGoogleToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<VerifyUserGoogleTokenQuery, VerifyUserGoogleTokenQueryVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"notificationCount"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"notificationPreference"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"follows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recommendedUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"following"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"followers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"following"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetSignedUrlForUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSignedUrlForUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSignedUrlForUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mediaType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaType"}}},{"kind":"Argument","name":{"kind":"Name","value":"mediaName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaName"}}}]}]}}]} as unknown as DocumentNode<GetSignedUrlForUserQuery, GetSignedUrlForUserQueryVariables>;
export const GetNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tweetId"}},{"kind":"Field","name":{"kind":"Name","value":"commentId"}},{"kind":"Field","name":{"kind":"Name","value":"notifiedUserId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"followers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tweet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]} as unknown as DocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables>;