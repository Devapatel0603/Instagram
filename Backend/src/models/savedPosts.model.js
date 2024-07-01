import mongoose from "mongoose";

const savedPostsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        posts: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Posts" }],
        },
    },
    { timestamps: true }
);

export const SavedPosts = mongoose.model("SavedPosts", savedPostsSchema);
