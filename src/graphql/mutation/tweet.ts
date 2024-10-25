import { graphql } from "@/gql";
import { gql } from "@apollo/client";
// import { gql } from "@apollo/client";

export const createTweetMutation = graphql(`
    #graphql
    mutation createTweet($payload: CreateTweetData!){
        createTweet(payload: $payload)
    }
`)

export const likeTweetMutation = graphql(`
    #graphql
    mutation LikeTweet($tweetId: ID!){
        LikeTweet(tweetId: $tweetId)
    }
`)

export const unlikeTweetMutation = graphql(`
    #graphql
    mutation UnlikeTweet($tweetId: ID!){
        UnlikeTweet(tweetId: $tweetId)
    }
`)

export const deleteTweetMutation= graphql(`
    #graphql
    mutation deleteTweet($tweetId: ID!){
        deleteTweet(tweetId: $tweetId)
    }
`)

export const deleteCommentMutation= graphql(`
    #graphql
    mutation deleteComment($commentId: ID!){
        deleteComment(commentId: $commentId)
    }
`)

export const createCommentMutation= gql(`
    #graphql
    mutation createComment($payload: CreateCommentData!){
        createComment(payload: $payload){
            id
            tweet{
                id
            }
        }
    }
`)

export const likeCommentMutation = gql(`
    #graphql
    mutation likeComment($commentId: ID!){
        likeComment(commentId: $commentId)
    }
`)

export const unlikeCommentMutation = gql(`
    #graphql
    mutation unlikeComment($commentId: ID!){
        unlikeComment(commentId: $commentId)
    }
`)