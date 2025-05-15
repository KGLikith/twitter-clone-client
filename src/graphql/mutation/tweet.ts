import { graphql } from "@/gql";

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

export const createCommentMutation= graphql(`
    #graphql
    mutation createComment($payload: CreateCommentData!){
        createComment(payload: $payload){
            id
            user{
                id
                name
            }
            tweet{
                id
                user{
                    id
                    name
                }
            }
        }
    }
`)

export const likeCommentMutation = graphql(`
    #graphql
    mutation likeComment($commentId: ID!){
        likeComment(commentId: $commentId)
    }
`)

export const unlikeCommentMutation = graphql(`
    #graphql
    mutation unlikeComment($commentId: ID!){
        unlikeComment(commentId: $commentId)
    }
`)

export const deleteMediaMutation = graphql(`
    #graphql
    mutation deleteMedia($mediaUrl: String!){
        deleteMedia(mediaUrl: $mediaUrl)
    }
`)

