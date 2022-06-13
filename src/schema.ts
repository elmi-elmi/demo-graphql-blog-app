import {gql} from "apollo-server";


export const typeDefs = gql`
    type Query{
        posts:[Post!]!
    } 
    type Mutation{
        postCreate(post:PostInput!):PostPayload!
        postUpdate(postId:ID!,post:PostInput!):PostPayload!    
        postDelete(postId:ID!):PostPayload!
        signup(input:SingupInput!):AuthPayload
    }
    input SingupInput{
        email:String!
        name:String!
        password:String!
        bio:String
    }
    type AuthPayload{
        userErrors:[UserError!]!
        token:String
    }
    input PostInput{
        title:String
        content:String
    }
    type UserError{
        message:String!
    }
    type PostPayload{
        userErrors:[UserError!]!
        post:Post
    }
    type User{
        id:ID!
        email:String!
        name:String!
        posts:[Post!]!
        profile:Profile!
    }
    type Post{
        id:ID!
        title:String!
        author:User!
        createdAt:String!
    }
    type Profile{
        id:ID!
        bio:String!
        user:User
    }
`;
