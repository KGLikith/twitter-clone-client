import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
    #graphql
    query getAllTweets{
        getAllTweets{
            id
            content 
            imageUrl
            user{
                id
                firstName
                lastName
                profileImageUrl
            }
        }
    }
`);

export const getTweetQuery= graphql(`
    #graphql
    query getTweet($id: ID!){
        getTweet(id: $id){
            id
            content
            imageUrl
            user{
                id
                firstName
                lastName
            }
        }
    }
`)
