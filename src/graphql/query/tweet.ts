import { graphql } from "@/gql";
import { gql } from "@apollo/client";
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
            comments{
                id
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

export const getUserTweetsQuery = graphql(`
    #graphql
    query getUserTweets($userId: ID!){
        getUserTweets(userId: $userId){
            id
            content 
            mediaUrl
            mediaType
            likes
            comments{
                id
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
    query getSignedUrlforTweet($mediaType: String!, $mediaName: String!){
        getSignedURLForTweet(mediaType: $mediaType, mediaName: $mediaName)
    }
`)

export const getTweetByIdQuery = gql(`
    #graphql
    query getTweetById($tweetid: ID!){
        getTweet(id: $tweetid){
            id
            content 
            mediaUrl
            mediaType
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