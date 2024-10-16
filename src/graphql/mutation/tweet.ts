import { graphql } from "@/gql";
import { gql } from "@apollo/client";
// import { gql } from "@apollo/client";

export const createTweetMutation = graphql(`
    #graphql
    mutation createTweet($payload: CreateTweetData!){
        createTweet(payload: $payload){
            id
        }
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