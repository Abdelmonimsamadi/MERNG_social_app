import mongoose from "mongoose";

const likeSchema = mongoose.Schema(
    {
        // FIXME: use list of id's instead and use $addSet
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: { type: String, required: true },
        createdAt: { type: String, required: true }
    }
)

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    name: { type: String, required: true },
    comments: [
        {
            userId: {
                // FIXME: this unique id is not working 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            body: { type: String, required: true },
            username: { type: String, required: true },
            createdAt: { type: String, required: true }
        }
    ],
    likes: [likeSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

export default mongoose.model('Post', postSchema)