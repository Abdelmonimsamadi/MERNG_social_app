import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    name: { type: String, required: true },
    image: {
        public_id: String,
        secure_url: String
    },
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            body: { type: String, required: true },
            username: { type: String, required: true },
            createdAt: { type: String, required: true }
        }
    ],
    likes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

export default mongoose.model('Post', postSchema)