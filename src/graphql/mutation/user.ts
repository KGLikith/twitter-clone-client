import { graphql } from "@/gql";

const followUserMutation = graphql(`
  #graphql
  mutation followUser($to: ID!) {
    followUser(to: $to)
  }
`);
const unfollowUserMutation = graphql(`
  #graphql
  mutation unfollowUser($to: ID!) {
    unfollowUser(to: $to)
  }
`);

export {followUserMutation,unfollowUserMutation}