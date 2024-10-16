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
    "\n    #graphql\n    mutation createTweet($payload: CreateTweetData!){\n        createTweet(payload: $payload){\n            id\n        }\n    }\n": types.CreateTweetDocument,
    "\n    #graphql\n    mutation LikeTweet($tweetId: ID!){\n        LikeTweet(tweetId: $tweetId)\n    }\n": types.LikeTweetDocument,
    "\n    #graphql\n    mutation UnlikeTweet($tweetId: ID!){\n        UnlikeTweet(tweetId: $tweetId)\n    }\n": types.UnlikeTweetDocument,
    "\n    #graphql\n    mutation deleteTweet($tweetId: ID!){\n        deleteTweet(tweetId: $tweetId)\n    }\n": types.DeleteTweetDocument,
    "\n  #graphql\n  mutation followUser($to: ID!) {\n    followUser(to: $to)\n  }\n": types.FollowUserDocument,
    "\n  #graphql\n  mutation unfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n": types.UnfollowUserDocument,
    "\n    #graphql\n    query getAllTweets{\n        getAllTweets{\n            id\n            content \n            imageUrl\n            likes\n            user{\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n        }\n    }\n": types.GetAllTweetsDocument,
    "\n    #graphql\n    query getTweet($id: ID!){\n        getTweet(id: $id){\n            id\n            content\n            imageUrl\n            likes\n            user{\n                id\n                firstName\n                lastName\n            }\n        }\n    }\n": types.GetTweetDocument,
    "\n    #graphql\n    query getSignedUrlforTweet($imageType: String!, $imageName: String!){\n        getSignedURLForTweet(imageType: $imageType, imageName: $imageName)\n    }\n": types.GetSignedUrlforTweetDocument,
    "\n  #graphql\n  query verifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n": types.VerifyUserGoogleTokenDocument,
    "\n  #graphql\n  query getCurrentUser {\n    getCurrentUser {\n      id\n      email\n      firstName\n      lastName\n      profileImageUrl\n      recommendedUsers{\n        id\n        email\n        firstName\n        lastName\n        profileImageUrl\n      }\n      tweets {\n        id\n        content\n        imageUrl\n        user {\n          id\n        }\n      }\n      followers{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n      following{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      email\n      firstName\n      lastName\n      profileImageUrl\n      tweets {\n        id\n        content\n        imageUrl\n        likes\n        user {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n      followers{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n      following{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n    }\n  }\n": types.GetUserByIdDocument,
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
export function graphql(source: "\n    #graphql\n    mutation createTweet($payload: CreateTweetData!){\n        createTweet(payload: $payload){\n            id\n        }\n    }\n"): (typeof documents)["\n    #graphql\n    mutation createTweet($payload: CreateTweetData!){\n        createTweet(payload: $payload){\n            id\n        }\n    }\n"];
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
export function graphql(source: "\n  #graphql\n  mutation followUser($to: ID!) {\n    followUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation followUser($to: ID!) {\n    followUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation unfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation unfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    query getAllTweets{\n        getAllTweets{\n            id\n            content \n            imageUrl\n            likes\n            user{\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n        }\n    }\n"): (typeof documents)["\n    #graphql\n    query getAllTweets{\n        getAllTweets{\n            id\n            content \n            imageUrl\n            likes\n            user{\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    query getTweet($id: ID!){\n        getTweet(id: $id){\n            id\n            content\n            imageUrl\n            likes\n            user{\n                id\n                firstName\n                lastName\n            }\n        }\n    }\n"): (typeof documents)["\n    #graphql\n    query getTweet($id: ID!){\n        getTweet(id: $id){\n            id\n            content\n            imageUrl\n            likes\n            user{\n                id\n                firstName\n                lastName\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    query getSignedUrlforTweet($imageType: String!, $imageName: String!){\n        getSignedURLForTweet(imageType: $imageType, imageName: $imageName)\n    }\n"): (typeof documents)["\n    #graphql\n    query getSignedUrlforTweet($imageType: String!, $imageName: String!){\n        getSignedURLForTweet(imageType: $imageType, imageName: $imageName)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query verifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"): (typeof documents)["\n  #graphql\n  query verifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getCurrentUser {\n    getCurrentUser {\n      id\n      email\n      firstName\n      lastName\n      profileImageUrl\n      recommendedUsers{\n        id\n        email\n        firstName\n        lastName\n        profileImageUrl\n      }\n      tweets {\n        id\n        content\n        imageUrl\n        user {\n          id\n        }\n      }\n      followers{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n      following{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getCurrentUser {\n    getCurrentUser {\n      id\n      email\n      firstName\n      lastName\n      profileImageUrl\n      recommendedUsers{\n        id\n        email\n        firstName\n        lastName\n        profileImageUrl\n      }\n      tweets {\n        id\n        content\n        imageUrl\n        user {\n          id\n        }\n      }\n      followers{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n      following{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      email\n      firstName\n      lastName\n      profileImageUrl\n      tweets {\n        id\n        content\n        imageUrl\n        likes\n        user {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n      followers{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n      following{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      email\n      firstName\n      lastName\n      profileImageUrl\n      tweets {\n        id\n        content\n        imageUrl\n        likes\n        user {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n      followers{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n      following{\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;