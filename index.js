import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'; import connectDB from './config/db.js';
import express from "express"
import http from "http"
import cors from 'cors'
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs"
// import "./config/cloudinary"
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

import typeDefs from './graphql/typeDefs/index.js';
import resolvers from './graphql/resolvers';

const app = express()

const httpServer = http.createServer(app)
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

const PORT = parseInt(process.env.PORT) || 3001

const start = async () => {
    try {
        await server.start()
        await connectDB()
        app.use('/',
            cors({
                // origin: ["http://localhost:5173", "https://merng-apollo.netlify.app", "http://localhost:4173"]
            }),
            graphqlUploadExpress(),
            express.json(),
            expressMiddleware(server, {
                context: ({ req }) => ({ req })
            }));

        await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

        console.log(`🚀  Server ready at: ${PORT}`);
    } catch (error) {
        console.log(error);
    }
}

start()