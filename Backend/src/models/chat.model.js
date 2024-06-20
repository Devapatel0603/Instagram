import mongoose, { mongo } from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                unique: true,
            },
        ],
        isGroup: {
            type: Boolean,
            default: false,
        },
        avtar: {
            type: String,
            default:
                "https://res.cloudinary.com/instagram-ui/image/upload/v1717778214/qg4uzzunluhxowc65zd3.png",
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
