import { graphql } from "@/gql";
import { gql } from "@apollo/client";

export const createTweetMutation = graphql(`
    #graphql
    mutation createTweet($payload: CreateTweetData!){
        createTweet(payload: $payload){
            id
        }
    }
`)