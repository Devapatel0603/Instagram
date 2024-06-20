import mongoose from "mongoose";

const userFollowerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        followers: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            select: false,
        },
        following: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            select: false,
        },
        follow_requests: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            select: false,
        },
    },
    { timestamps: true }
);

export const UserFollower = mongoose.model("User_Follower", userFollowerSchema);
