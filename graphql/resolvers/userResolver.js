import User from "../../models/user"
import { generateToken } from "../../utils/auth"
import { registerValidators, loginValidators } from "../../utils/validators"
import { GraphQLError } from "graphql"
import { ApolloServerErrorCode } from "@apollo/server/errors"

export default {
    Query: {
        users: async () => await User.find().select("-password")
    },
    Mutation: {
        registerUser: async (_, { user: { name, email, password, confirmPassword } }) => {
            const { errors, valid } = registerValidators(name, email, password, confirmPassword)
            if (!valid) {
                throw new GraphQLError("Errors", { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT, errors } })
            }
            const existingUser = await User.findOne({ email: email })
            if (existingUser) {
                errors.generale = "User with this email Exist !"
                throw new GraphQLError('User with this email Exist !', { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT, errors } })
            }
            const userRegistered = await User.create({ name, email, password, confirmPassword })
            const token = await generateToken({ name: userRegistered.name, email: userRegistered.email, id: userRegistered._id })
            userRegistered.token = token
            return userRegistered
        },
        loginUser: async (_, { email, password }) => {
            const { errors, valid } = loginValidators(email, password)
            if (!valid) {
                throw new GraphQLError("Errors", { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT, errors } })
            }
            const user = await User.findOne({ email })
            if (!user) {
                errors.generale = "No existing user with this email !"
                throw new GraphQLError('No existing user with this email !', { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT, errors } })
            }
            const passwordIsMatching = await user.validatePassword(password)
            if (!passwordIsMatching) {
                errors.generale = "password does not match"
                throw new GraphQLError('password does not match', { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT, errors } })
            }
            const token = await generateToken({ email, name: user.name, id: user._id })
            user.token = token
            return user
        },
        deleteUser: async (_, { id }) => await User.findByIdAndDelete(id),
        updateUser: async (_, { id, name, password, email }) => await User.findByIdAndUpdate(id, { name, password, email }, { new: true, runValidators: true })
    }
}