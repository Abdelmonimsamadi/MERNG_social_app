import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import typeDefs from './graphql/typeDefs/index.js';
import resolvers from './graphql/resolvers';

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

const PORT = parseInt(process.env.PORT) || 3001

const start = async () => {
    try {
        const mongoosePromise = mongoose.connect(process.env.MONGODB_IRI)
        const apolloServerPromise = startStandaloneServer(server, {
            listen: { port: PORT },
            context: ({ req }) => ({ req })
        })
        // const [_, { url }] = await Promise.all([mongoosePromise, apolloServerPromise])
        await mongoosePromise
        console.log("db connected ...");
        const { url } = await apolloServerPromise
        console.log(`🚀  Server ready at: ${url}`);
    } catch (error) {
        console.log(error);
    }
}

start()