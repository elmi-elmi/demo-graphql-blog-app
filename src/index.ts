import {ApolloServer} from "apollo-server";
import {typeDefs} from "./schema";
import {Query, Mutation} from './resolvers';

import {PrismaClient, Prisma} from '@prisma/client'

const prisma = new PrismaClient()

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
}

const resolvers = {
    Query,
    Mutation,
};

const context = {
    prisma
}


const server = new ApolloServer({typeDefs, resolvers, context});

server.listen().then(({url}) => {
    console.log(url)
})
