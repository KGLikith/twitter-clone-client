import { graphql } from "@/gql";
// import { gql } from "@apollo/client";

export const getPaginatedTweetsQuery = graphql(`
  #graphql
  query GetPaginatedTweets($cursor: String, $limit: Int) {
    getPaginatedTweets(cursor: $cursor, limit: $limit) {
      tweets {
        id
        content
        mediaUrl
        mediaType
        likes
        createdAt
        commentsLength
        user {
          id
          userName
          name
          profileImageUrl
          isVerified
        }
      }
      nextCursor
    }
  }
`);

export const getPaginatedUserTweetsQuery = graphql(`
  #graphql
  query getPaginatedUserTweets($userId: ID!, $cursor: String, $limit: Int) {
    getPaginatedUserTweets(userId: $userId,cursor: $cursor, limit: $limit) {
      tweets {
        id
        content
        mediaUrl
        mediaType
        likes
        createdAt
        commentsLength
        user {
          id
          userName
          name
          profileImageUrl
          isVerified
        }
      }
      nextCursor
    }
  }
`);

export const getSignedUrlforTweetQuery = graphql(`
  #graphql
  query getSignedUrlforTweet($mediaType: String!, $mediaName: String!) {
    getSignedURLForTweet(mediaType: $mediaType, mediaName: $mediaName)
  }
`);

export const getSignedUrlforCommentQuery = graphql(`
  #graphql
  query getSignedUrlforComment($mediaType: String!, $mediaName: String!) {
    getSignedURLForComment(mediaType: $mediaType, mediaName: $mediaName)
  }
`);

export const getTweetByIdQuery = graphql(`
  #graphql
  query getTweetById($tweetid: ID!) {
    getTweet(id: $tweetid) {
      id
      content
      mediaUrl
      mediaType
      likes
      createdAt
      user {
        id
        userName
        name
        profileImageUrl
        isVerified
      }
    }
  }
`);

export const getPaginatedCommentsByTweetIdQuery = graphql(`
  #graphql
  query getPaginatedCommentsByTweetId($tweetId: ID!, $cursor: String, $limit: Int) {
    getPaginatedCommentsByTweetId(tweetId: $tweetId, cursor: $cursor, limit: $limit) {
      comments {
        id
        content
        mediaUrl
        mediaType
        likes
        createdAt
        user {
          id
          userName
          name
          profileImageUrl
          isVerified
        }
      }
      nextCursor
    }
  }
`);