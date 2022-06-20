import {ApolloServer} from "apollo-server";
import {typeDefs} from "./schema";
import {Query, Mutation, Profile, User, Post} from './resolvers';

import {PrismaClient, Prisma} from '@prisma/client'
import {getUserFromToken} from "./utils/getUserFromToken";

export const prisma = new PrismaClient()

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    userInfo:{userId:number}|null
}
const resolvers = {
    Query,
    Mutation,
    Profile,
    User,
    Post
};

const context = async ({req}:any)=>{
    console.log('-------------------------------')
    const token = req.headers.authorization
    const userInfo = await getUserFromToken(req.headers.authorization)
    return {prisma,userInfo}
}


const server = new ApolloServer({typeDefs, resolvers, context});

server.listen().then(({url}) => {
    console.log(url)
})
