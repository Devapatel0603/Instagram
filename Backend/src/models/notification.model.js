import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        notificationUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        text: {
            type: String,
            default: false,
            trim: true,
            required: true,
        },
    },
    { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
