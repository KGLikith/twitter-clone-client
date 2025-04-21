import { graphql } from "@/gql";
// import { gql } from "@apollo/client";

export const getAllTweetsQuery = graphql(`
    #graphql
    query getAllTweets{
        getAllTweets{
            id
            content 
            mediaUrl
            mediaType
            likes
            createdAt
            commentsLength
            user{
                id
                userName
                name
                profileImageUrl
            }
        }
    }
`);

export const getUserTweetsQuery = graphql(`
    #graphql
    query getUserTweets($userId: ID!){
        getUserTweets(userId: $userId){
            id
            content 
            mediaUrl
            mediaType
            likes
            createdAt
            commentsLength
            user{
                id
                userName
                name
                profileImageUrl
            }
        }
    }
`);

export const getSignedUrlforTweetQuery= graphql(`
    #graphql
    query getSignedUrlforTweet($mediaType: String!, $mediaName: String!){
        getSignedURLForTweet(mediaType: $mediaType, mediaName: $mediaName)
    }
`)

export const getSignedUrlforCommentQuery= graphql(`
    #graphql
    query getSignedUrlforComment($mediaType: String!, $mediaName: String!){
        getSignedURLForComment(mediaType: $mediaType, mediaName: $mediaName)
    }
`)

export const getTweetByIdQuery = graphql(`
    #graphql
    query getTweetById($tweetid: ID!){
        getTweet(id: $tweetid){
            id
            content
            mediaUrl
            mediaType
            likes
            createdAt
            user{
                id
                userName
                name
                profileImageUrl
            }
        }
    }
`)

export const getCommentsByTweetIdQuery = graphql(`
    #graphql
    query getCommentsByTweetId($tweetId: ID!){
        getCommentsByTweetId(tweetId: $tweetId){
            id
            content
            mediaUrl
            mediaType
            likes
            createdAt
            user{
                id
                userName
                name
                profileImageUrl
            }
        }
    }
`)