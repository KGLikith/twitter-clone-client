import { graphql } from "@/gql";
// import { gql } from "@apollo/client";


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

export const getSignedUrlforTweetQuery= graphql(`
    #graphql
    query getSignedUrlforTweet($imageType: String!, $imageName: String!){
        getSignedURLForTweet(imageType: $imageType, imageName: $imageName)
    }
`)