import { graphql } from "@/gql";
import { gql } from "@apollo/client";
// import { gql } from "@apollo/client";


export const getAllTweetsQuery = gql(`
    #graphql
    query getAllTweets{
        getAllTweets{
            id
            content 
            imageUrl
            likes
            comments{
                id 
                content
                likes
                user{
                    id
                    firstName
                    lastName
                    profileImageUrl
                }
            }
            user{
                id
                firstName
                lastName
                profileImageUrl
            }
        }
    }
`);

export const getSignedUrlforTweetQuery= graphql(`
    #graphql
    query getSignedUrlforTweet($imageType: String!, $imageName: String!){
        getSignedURLForTweet(imageType: $imageType, imageName: $imageName)
    }
`)

export const getTweetByIdQuery = gql(`
    #graphql
    query getTweetById($tweetid: ID!){
        getTweet(id: $tweetid){
            id
            content 
            imageUrl
            likes
            comments{
                id 
                content
                likes
                user{
                    id
                    firstName
                    lastName
                    profileImageUrl
                }
            }
            user{
                id
                firstName
                lastName
                profileImageUrl
            }
        }
    }
`)