import Post from "../../models/post";
import User from "../../models/user"
import { checkAuth } from "../../utils/auth";
import { GraphQLError } from "graphql"
import { ApolloServerErrorCode } from "@apollo/server/errors"


export default {
    Query: {
        posts: async () => await Post.find().sort({ createdAt: -1 }),
        post: async (_, { id }) => await Post.findById(id)
    },
    Mutation: {
        createPost: async (_, { post }, context) => {
            const user = checkAuth(context)
            const retrieveUser = await User.findOne({ email: user.email })
            post.user = retrieveUser._id
            post.name = retrieveUser.name
            const createdPost = await Post.create(post)
            return createdPost
        },
        async deletePost(_, { id }, context) {
            const user = checkAuth(context)
            const post = await Post.findById(id)
            if (!post) throw new Error('This post does not exist')
            const equal = user.id.toString() === post.user.toString()
            if (!equal) throw new Error('Not authorized to delete this post')
            await post.delete()
            return post
        },
        async updatePost(_, { id, post }, context) {
            const user = checkAuth(context)
            const oldPost = await Post.findById(id)
            if (!oldPost) throw new Error('This post does not exist')
            const equal = user.id.toString() === oldPost.user.toString()
            if (!equal) throw new Error('Not authorized to update this post')
            const newPost = await Post.findByIdAndUpdate(id, post, { new: true, runValidators: true })
            return newPost
        },
        async likePost(_, { id }, context) {
            // check if user connect to like count if not navigate to login page
            const user = checkAuth(context)
            const post = await Post.findById(id)
            if (!post) throw new Error('this post does not exist !')
            const postLiked = post.likes.find(userId => {
                return (userId.toString() === user.id.toString())
            })

            const pull = {
                $pull: {
                    likes: user.id,
                }
            }

            const push = {
                $addToSet: {
                    likes: user.id,
                }
            }

            const pushOrPull = postLiked ? pull : push

            const newPost = await Post.findOneAndUpdate({ _id: id }, {
                ...pushOrPull
            }, {
                new: true,
                runValidators: true
            })
            return newPost;
        },
        async addComment(_, { postId, body }, context) {
            if (!body) throw new GraphQLError('comment must not be empty !', {
                extensions: {
                    code: ApolloServerErrorCode.BAD_USER_INPUT,
                    error: "comment must not be empty !"
                }
            })
            const user = checkAuth(context)
            const post = await Post.findById(postId)
            if (!post) throw new GraphQLError("This post does not exist !", {
                extensions: {
                    code: ApolloServerErrorCode.BAD_REQUEST,
                    error: "This post does not exist !"
                }
            })
            const newPost = await Post.findOneAndUpdate({ _id: postId }, {
                $push: {
                    comments: {
                        body,
                        username: user.name,
                        createdAt: new Date().toISOString(),
                        userId: user.id
                    }
                }
            }, { new: true, runValidators: true })
            return newPost.comments
        }
    },
}
