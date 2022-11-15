import jwt from "jsonwebtoken"
import { GraphQLError } from "graphql"
import { ApolloServerErrorCode } from "@apollo/server/errors"

export const generateToken = async (paylaod) => {
    const token = await jwt.sign(paylaod, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
    return token
}

export const checkAuth = (context) => {
    const req = context?.req
    const authorization = req?.headers?.authorization
    if (!authorization) throw new GraphQLError('No authorization provided !',
        {
            extensions: {
                code: ApolloServerErrorCode.BAD_REQUEST,
                error: "No authorization provided !"
            }
        })
    const token = authorization.split('Bearer ')[1]
    if (!token) throw new GraphQLError('Invalid token !',
        {
            extensions: {
                code: ApolloServerErrorCode.BAD_REQUEST,
                error: "Invalid token !"
            }
        })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
}