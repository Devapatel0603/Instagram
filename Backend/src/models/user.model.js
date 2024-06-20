import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            select: false,
        },
        phone_no: {
            type: String,
            trim: true,
            unique: false,
            select: false,
        },
        password: {
            type: String,
            trim: true,
            required: true,
            select: false,
        },
        is_private_account: {
            type: Boolean,
            default: true,
        },
        profile_img: {
            type: String,
            default:
                "https://res.cloudinary.com/instagram-ui/image/upload/v1717778214/qg4uzzunluhxowc65zd3.png",
        },
        caption: {
            type: String,
            default: "",
        },
        number_of_followers: {
            type: Number,
            default: 0,
        },
        number_of_following: {
            type: Number,
            default: 0,
        },
        number_of_posts: {
            type: Number,
            default: 0,
        },
        fetchedFollowingPostIds: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Posts" }],
            select: false,
        },
        fetchedPostIds: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Posts" }],
            select: false,
        },
        password_reset_token: {
            type: String,
            select: false,
        },
        password_reset_expires: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.checkPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
