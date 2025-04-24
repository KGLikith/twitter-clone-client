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
    "\n  #graphql\n  mutation createUser($email: String!, $password: String!, $name: String!, $userName: String!) {\n    createUser(email: $email, password: $password, name: $name, userName: $userName) {\n      success\n      message\n    }\n  }\n": types.CreateUserDocument,
    "\n  #graphql\n  mutation followUser($to: ID!) {\n    followUser(to: $to)\n  }\n": types.FollowUserDocument,
    "\n  #graphql\n  mutation unfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n": types.UnfollowUserDocument,
    "\n  #graphql\n  mutation createNotification($payload: createNotificationData!) {\n    createNotification(payload: $payload)\n  }\n": types.CreateNotificationDocument,
    "\n  #graphql\n  mutation updateNotification($id: ID!) {\n    updateNotification(id: $id)\n  }\n": types.UpdateNotificationDocument,
    "\n  #graphql\n  mutation updateAllNotifications {\n    updateAllNotifications\n  }\n": types.UpdateAllNotificationsDocument,
    "\n  #graphql\n  mutation updateUser($payload: updateUserData!) {\n    updateUser(payload: $payload) {\n      success\n      message\n      updated\n    }\n  }\n": types.UpdateUserDocument,
    "\n  #graphql\n  mutation createBookmark($tweetId: ID, $commentId: ID) {\n    createBookmark(tweetId: $tweetId, commentId: $commentId) \n  }\n": types.CreateBookmarkDocument,
    "\n  #graphql\n  mutation removeBookmark($tweetId: ID, $commentId: ID) {\n    removeBookmark(tweetId: $tweetId, commentId: $commentId) \n  }\n": types.RemoveBookmarkDocument,
    "\n  #graphql\n  query GetPaginatedTweets($cursor: String, $limit: Int) {\n    getPaginatedTweets(cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetPaginatedTweetsDocument,
    "\n  #graphql\n  query getPaginatedUserTweets($userId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedUserTweets(userId: $userId,cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetPaginatedUserTweetsDocument,
    "\n  #graphql\n  query getSignedUrlforTweet($mediaType: String!, $mediaName: String!) {\n    getSignedURLForTweet(mediaType: $mediaType, mediaName: $mediaName)\n  }\n": types.GetSignedUrlforTweetDocument,
    "\n  #graphql\n  query getSignedUrlforComment($mediaType: String!, $mediaName: String!) {\n    getSignedURLForComment(mediaType: $mediaType, mediaName: $mediaName)\n  }\n": types.GetSignedUrlforCommentDocument,
    "\n  #graphql\n  query getTweetById($tweetid: ID!) {\n    getTweet(id: $tweetid) {\n      id\n      content\n      mediaUrl\n      mediaType\n      likes\n      createdAt\n      user {\n        id\n        userName\n        name\n        profileImageUrl\n      }\n    }\n  }\n": types.GetTweetByIdDocument,
    "\n  #graphql\n  query getPaginatedCommentsByTweetId($tweetId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedCommentsByTweetId(tweetId: $tweetId, cursor: $cursor, limit: $limit) {\n      comments {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetPaginatedCommentsByTweetIdDocument,
    "\n  #graphql\n  query verifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n": types.VerifyUserGoogleTokenDocument,
    "\n  #graphql\n  query verifyUserCredential($email: String!, $password: String!) {\n    verifyUserCredential(email: $email, password: $password){\n      id \n      email\n      token\n    }\n  }\n": types.VerifyUserCredentialDocument,
    "\n  #graphql\n  query getCurrentUser {\n    getCurrentUser {\n      id\n      email\n      name\n      userName\n      createdAt\n      profileImageUrl\n      bio\n      notificationCount\n      location\n      website\n      notificationPreference {\n        likes\n        comments\n        follows\n      }\n      recommendedUsers {\n        id\n        email\n        name\n        userName\n        profileImageUrl\n      }\n      followers {\n        id\n      }\n      following {\n        id\n      }\n      bookmark {\n        id\n        bookmarks {\n          id\n          type\n          tweetId\n          commentId\n        }\n      }\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      email\n      name\n      profileImageUrl\n      userName\n      bio\n      location\n      website\n      createdAt\n      followers {\n        id\n        profileImageUrl\n        name\n        userName\n        bio\n      }\n      following {\n        id\n        profileImageUrl\n        name\n        userName\n        bio\n      }\n    }\n  }\n": types.GetUserByIdDocument,
    "\n  #graphql\n  query getSignedUrlForUser($mediaType: String!, $mediaName: String!) {\n    getSignedUrlForUser(mediaType: $mediaType, mediaName: $mediaName)\n  }\n": types.GetSignedUrlForUserDocument,
    "\n  #graphql\n  query getNotifications {\n    getNotifications {\n      id\n      tweetId\n      commentId\n      notifiedUserId\n      type\n      read\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        profileImageUrl\n        userName\n        followers {\n          id\n        }\n      }\n      tweet {\n        id\n        content\n      }\n      comment {\n        id\n        content\n      }\n    }\n  }\n": types.GetNotificationsDocument,
    "\n  #graphql\n  query getUserBookmarks($cursor: String, $limit: Int) {\n    getUserBookmarks(cursor: $cursor, limit: $limit) {\n      bookmarks {\n        id\n        type\n        createdAt\n        tweet {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          commentsLength\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n          }\n        }\n        comment {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n          }\n          tweet {\n            id\n            user {\n              id\n              name\n              userName\n            }\n          }\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetUserBookmarksDocument,
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
export function graphql(source: "\n  #graphql\n  mutation createUser($email: String!, $password: String!, $name: String!, $userName: String!) {\n    createUser(email: $email, password: $password, name: $name, userName: $userName) {\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation createUser($email: String!, $password: String!, $name: String!, $userName: String!) {\n    createUser(email: $email, password: $password, name: $name, userName: $userName) {\n      success\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation followUser($to: ID!) {\n    followUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation followUser($to: ID!) {\n    followUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation unfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation unfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n"];
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
export function graphql(source: "\n  #graphql\n  mutation createBookmark($tweetId: ID, $commentId: ID) {\n    createBookmark(tweetId: $tweetId, commentId: $commentId) \n  }\n"): (typeof documents)["\n  #graphql\n  mutation createBookmark($tweetId: ID, $commentId: ID) {\n    createBookmark(tweetId: $tweetId, commentId: $commentId) \n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation removeBookmark($tweetId: ID, $commentId: ID) {\n    removeBookmark(tweetId: $tweetId, commentId: $commentId) \n  }\n"): (typeof documents)["\n  #graphql\n  mutation removeBookmark($tweetId: ID, $commentId: ID) {\n    removeBookmark(tweetId: $tweetId, commentId: $commentId) \n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetPaginatedTweets($cursor: String, $limit: Int) {\n    getPaginatedTweets(cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetPaginatedTweets($cursor: String, $limit: Int) {\n    getPaginatedTweets(cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getPaginatedUserTweets($userId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedUserTweets(userId: $userId,cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getPaginatedUserTweets($userId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedUserTweets(userId: $userId,cursor: $cursor, limit: $limit) {\n      tweets {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        commentsLength\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n"];
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
export function graphql(source: "\n  #graphql\n  query getTweetById($tweetid: ID!) {\n    getTweet(id: $tweetid) {\n      id\n      content\n      mediaUrl\n      mediaType\n      likes\n      createdAt\n      user {\n        id\n        userName\n        name\n        profileImageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getTweetById($tweetid: ID!) {\n    getTweet(id: $tweetid) {\n      id\n      content\n      mediaUrl\n      mediaType\n      likes\n      createdAt\n      user {\n        id\n        userName\n        name\n        profileImageUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getPaginatedCommentsByTweetId($tweetId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedCommentsByTweetId(tweetId: $tweetId, cursor: $cursor, limit: $limit) {\n      comments {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getPaginatedCommentsByTweetId($tweetId: ID!, $cursor: String, $limit: Int) {\n    getPaginatedCommentsByTweetId(tweetId: $tweetId, cursor: $cursor, limit: $limit) {\n      comments {\n        id\n        content\n        mediaUrl\n        mediaType\n        likes\n        createdAt\n        user {\n          id\n          userName\n          name\n          profileImageUrl\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query verifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"): (typeof documents)["\n  #graphql\n  query verifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query verifyUserCredential($email: String!, $password: String!) {\n    verifyUserCredential(email: $email, password: $password){\n      id \n      email\n      token\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query verifyUserCredential($email: String!, $password: String!) {\n    verifyUserCredential(email: $email, password: $password){\n      id \n      email\n      token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getCurrentUser {\n    getCurrentUser {\n      id\n      email\n      name\n      userName\n      createdAt\n      profileImageUrl\n      bio\n      notificationCount\n      location\n      website\n      notificationPreference {\n        likes\n        comments\n        follows\n      }\n      recommendedUsers {\n        id\n        email\n        name\n        userName\n        profileImageUrl\n      }\n      followers {\n        id\n      }\n      following {\n        id\n      }\n      bookmark {\n        id\n        bookmarks {\n          id\n          type\n          tweetId\n          commentId\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getCurrentUser {\n    getCurrentUser {\n      id\n      email\n      name\n      userName\n      createdAt\n      profileImageUrl\n      bio\n      notificationCount\n      location\n      website\n      notificationPreference {\n        likes\n        comments\n        follows\n      }\n      recommendedUsers {\n        id\n        email\n        name\n        userName\n        profileImageUrl\n      }\n      followers {\n        id\n      }\n      following {\n        id\n      }\n      bookmark {\n        id\n        bookmarks {\n          id\n          type\n          tweetId\n          commentId\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      email\n      name\n      profileImageUrl\n      userName\n      bio\n      location\n      website\n      createdAt\n      followers {\n        id\n        profileImageUrl\n        name\n        userName\n        bio\n      }\n      following {\n        id\n        profileImageUrl\n        name\n        userName\n        bio\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      email\n      name\n      profileImageUrl\n      userName\n      bio\n      location\n      website\n      createdAt\n      followers {\n        id\n        profileImageUrl\n        name\n        userName\n        bio\n      }\n      following {\n        id\n        profileImageUrl\n        name\n        userName\n        bio\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getSignedUrlForUser($mediaType: String!, $mediaName: String!) {\n    getSignedUrlForUser(mediaType: $mediaType, mediaName: $mediaName)\n  }\n"): (typeof documents)["\n  #graphql\n  query getSignedUrlForUser($mediaType: String!, $mediaName: String!) {\n    getSignedUrlForUser(mediaType: $mediaType, mediaName: $mediaName)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getNotifications {\n    getNotifications {\n      id\n      tweetId\n      commentId\n      notifiedUserId\n      type\n      read\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        profileImageUrl\n        userName\n        followers {\n          id\n        }\n      }\n      tweet {\n        id\n        content\n      }\n      comment {\n        id\n        content\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getNotifications {\n    getNotifications {\n      id\n      tweetId\n      commentId\n      notifiedUserId\n      type\n      read\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        profileImageUrl\n        userName\n        followers {\n          id\n        }\n      }\n      tweet {\n        id\n        content\n      }\n      comment {\n        id\n        content\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getUserBookmarks($cursor: String, $limit: Int) {\n    getUserBookmarks(cursor: $cursor, limit: $limit) {\n      bookmarks {\n        id\n        type\n        createdAt\n        tweet {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          commentsLength\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n          }\n        }\n        comment {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n          }\n          tweet {\n            id\n            user {\n              id\n              name\n              userName\n            }\n          }\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getUserBookmarks($cursor: String, $limit: Int) {\n    getUserBookmarks(cursor: $cursor, limit: $limit) {\n      bookmarks {\n        id\n        type\n        createdAt\n        tweet {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          commentsLength\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n          }\n        }\n        comment {\n          id\n          content\n          createdAt\n          mediaUrl\n          mediaType\n          likes\n          user {\n            id\n            name\n            profileImageUrl\n            userName\n          }\n          tweet {\n            id\n            user {\n              id\n              name\n              userName\n            }\n          }\n        }\n      }\n      nextCursor\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;