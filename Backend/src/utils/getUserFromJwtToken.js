import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UserFollower } from "../models/user.follower.model.js";

const getUserFromJwtToken = async (token) => {
    try {
        const _id = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findById(_id);
        if (!user) {
            return 400;
        }

        return user;
    } catch (error) {
        return 400;
    }
};

export { getUserFromJwtToken };
