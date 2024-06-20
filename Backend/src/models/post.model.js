import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        noOfLikes: {
            type: Number,
            default: 0,
        },
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    { timestamps: true }
);

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        urls: [
            {
                type: String,
                required: true,
                trim: true,
            },
        ],
        no_of_likes: {
            type: Number,
            default: 0,
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
        },
        comments: [commentSchema],
        caption: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Post = mongoose.model("Posts", postSchema);
