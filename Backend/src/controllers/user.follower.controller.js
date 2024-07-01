import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";
import { User } from "../models/user.model.js";
import { UserFollower } from "../models/user.follower.model.js";

//Send Follow request for follow someone
export const addFollowing = asyncHandler(async (req, res) => {
    if (req.params._id.toString() === req.user._id.toString()) {
        throw new ErrorHandler(404, "Please don't add your own id");
    }

    const current_user = await UserFollower.findOne({
        user: req.user._id,
    }).select("+following +following_requests");

    if (current_user.following.includes(req.params._id)) {
        return responseHandler(res, 200, "You already follow this user");
    }

    let c_user = await User.findById(req.user._id);

    let r_user;

    try {
        r_user = await User.findById(req.params._id);
    } catch (error) {
        throw new ErrorHandler(400, "Invalid user ID");
    }

    const req_user = await UserFollower.findOne({
        user: req.params._id,
    }).select("+followers +follow_requests");

    if (!req_user) {
        throw new ErrorHandler(400, "User not exist");
    }

    if (r_user.is_private_account) {
        if (!req_user.follow_requests.includes(req.user._id)) {
            req_user.follow_requests.push(req.user._id);
            await req_user.save();
        }
        responseHandler(res, 200, "Friend request sent successfully");
    } else {
        current_user.following.push(req.params._id);
        await current_user.save();

        req_user.followers.push(req.user._id);
        await req_user.save();

        c_user.number_of_following = current_user.following.length;
        await c_user.save();

        r_user.number_of_followers = req_user.followers.length;
        await r_user.save();
        responseHandler(res, 200, `Now, You follow ${r_user.username}`);
    }
});

//Remove From Following
export const removeFollowing = asyncHandler(async (req, res) => {
    if (req.params._id.toString() === req.user._id.toString()) {
        throw new ErrorHandler(404, "Please don't add your own id");
    }

    let user = await User.findById(req.user._id);
    let r_user;
    try {
        r_user = await User.findById(req.params._id);
    } catch (error) {
        throw new ErrorHandler(400, "Invalid user ID");
    }

    if (!r_user) {
        throw new ErrorHandler(400, "User not exist");
    }

    const req_user = await UserFollower.findOne({
        user: req.params._id,
    }).select("+followers +follow_requests");

    if (!req_user.followers.includes(req.user._id)) {
        throw new ErrorHandler(400, "You are not following this user");
    }

    const current_user = await UserFollower.findOne({
        user: req.user._id,
    }).select("+following");

    if (r_user.is_private_account) {
        if (req_user.follow_requests.includes(req.user._id)) {
            req_user.follow_requests = req_user.follow_requests.filter(
                (_id) => _id.toString() !== req.user._id.toString()
            );
            await req_user.save();

            responseHandler(res, 200, `Your follow request is canceled`);
        } else {
            current_user.following = current_user.following.filter(
                (_id) => _id.toString() !== req.params._id.toString()
            );
            await current_user.save();

            req_user.followers = req_user.followers.filter(
                (_id) => _id.toString() !== req.user._id.toString()
            );
            await req_user.save();

            user.number_of_following = current_user.following.length;
            await user.save();

            r_user.number_of_followers = req_user.followers.length;
            await r_user.save();

            responseHandler(res, 200, `You unfollowed ${r_user.username}`);
        }
    } else {
        current_user.following = current_user.following.filter(
            (_id) => _id.toString() !== req.params._id.toString()
        );
        await current_user.save();

        req_user.followers = req_user.followers.filter(
            (_id) => _id.toString() !== req.user._id.toString()
        );
        await req_user.save();

        user.number_of_following = current_user.following.length;
        await user.save();

        r_user.number_of_followers = req_user.followers.length;
        await r_user.save();

        responseHandler(res, 200, `You unfollowed ${r_user.username}`);
    }
});

//Cancel Friend Request
export const cancelFriendRequest = asyncHandler(async (req, res) => {
    if (req.params._id.toString() === req.user._id.toString()) {
        throw new ErrorHandler(404, "Please don't add your own id");
    }

    const requsted_user = await UserFollower.findOne({
        user: req.params._id,
    }).select("+follow_requests");

    if (!requsted_user) {
        throw new ErrorHandler(404, "User does not exist");
    }

    if (!requsted_user.follow_requests.includes(req.user._id)) {
        throw new ErrorHandler(
            404,
            "You didn't send friend request to this user"
        );
    }

    requsted_user.follow_requests = requsted_user.follow_requests.filter(
        (_id) => _id.toString() !== req.user._id.toString()
    );
    await requsted_user.save();

    responseHandler(res, 200, "Your Friend request has been canceled");
});

//Get 5 following Suggetion
export const getFollowingSuggetions = asyncHandler(async (req, res) => {
    try {
        const currentUser = await UserFollower.findOne({
            user: req.user._id,
        }).select("+following +follow_requests");

        if (!currentUser) {
            return responseHandler(res, 404, "Current user not found");
        }

        const users = await UserFollower.aggregate([
            {
                $match: {
                    user: {
                        $nin: [
                            ...currentUser.following,
                            ...currentUser.follow_requests,
                            req.user._id,
                        ],
                    },
                },
            },
            { $sample: { size: 10 } },
            {
                $project: {
                    follow_requests: 1,
                    user: 1,
                    _id: 1,
                },
            },
        ]);

        // Populate the user details for each user in the suggestions
        const populatedUsers = await UserFollower.populate(users, {
            path: "user",
            select: "name username email profile_img",
        });

        // Filter out duplicate users
        let uniqueUsers = populatedUsers.filter(
            (user, index, self) =>
                self.findIndex(
                    (u) => u.user._id.toString() === user.user._id.toString()
                ) === index
        );

        uniqueUsers = uniqueUsers.map((user) => {
            const requested = user.follow_requests
                .map((id) => id.toString())
                .includes(req.user._id.toString());
            return {
                ...user,
                requested,
            };
        });

        console.log(uniqueUsers);

        // Send the response
        responseHandler(
            res,
            200,
            "User suggestions sent successfully",
            uniqueUsers
        );
    } catch (error) {
        console.error("Error getting following suggestions:", error);
        responseHandler(res, 500, "Internal Server Error");
    }
});

//Accept Follow Request
export const acceptOrRejectFollowRequest = asyncHandler(async (req, res) => {
    if (!typeof req.body.accept === "boolean") {
        throw new ErrorHandler(
            404,
            "Please provide accept field which must be boolean"
        );
    }

    if (req.params._id.toString() === req.user._id.toString()) {
        throw new ErrorHandler(400, "Please don't add your own id");
    }

    const current_user = await User.findById(req.user._id);
    const current_user_followers = await UserFollower.findOne({
        user: req.user._id,
    }).select("+follow_requests +followers");

    const requestedUserIds = current_user_followers.follow_requests.filter(
        (_id) => _id.toString() !== req.params._id.toString()
    );

    if (
        requestedUserIds.length !==
        current_user_followers.follow_requests.length - 1
    ) {
        throw new ErrorHandler(404, "Not Authorized");
    }

    const requested_user = await User.findById(req.params._id.toString());
    if (!requested_user) {
        throw new ErrorHandler(404, "User does not exist");
    }

    if (current_user_followers.followers.includes(req.params._id)) {
        return responseHandler(res, 203, "This user is already following you");
    }

    const requested_user_following = await UserFollower.findOne({
        user: req.params._id,
    }).select("+following");

    if (requested_user_following.following.includes(req.user._id)) {
        return responseHandler(res, 203, "This user is already following you");
    }

    if (req.body.accept) {
        current_user_followers.followers.push(req.params._id);
        current_user_followers.follow_requests =
            current_user_followers.follow_requests.filter(
                (id) => id.toString() !== req.params._id.toString()
            );

        current_user.number_of_followers =
            current_user_followers.followers.length;

        requested_user_following.following.push(req.user._id);

        requested_user.number_of_following =
            requested_user_following.following.length;

        await Promise.all([
            current_user_followers.save(),
            current_user.save(),
            requested_user_following.save(),
            requested_user.save(),
        ]);
    } else {
        current_user_followers.follow_requests =
            current_user_followers.follow_requests.filter(
                (id) => id.toString() !== req.params._id.toString()
            );
        await current_user_followers.save();
    }

    responseHandler(res, 200, "Follow request accepted");
});

//Remove From Followers
export const removeFollower = asyncHandler(async (req, res) => {
    if (req.params._id.toString() === req.user._id.toString()) {
        throw new ErrorHandler(404, "Please don't add your own id");
    }

    const remove_user = await User.findById(req.params._id);

    if (!remove_user) {
        throw new ErrorHandler(404, "User does not exist");
    }

    const current_user = await User.findById(req.user._id);
    const current_user_followers = await UserFollower.findOne({
        user: req.user._id,
    }).select("+followers");

    if (!current_user_followers.followers.includes(req.params._id)) {
        throw new ErrorHandler(404, "That user doesn't follow you");
    }

    const remove_user_following = await UserFollower.findOne({
        user: req.params._id,
    }).select("+following");

    if (!remove_user_following.following.includes(req.user._id)) {
        throw new ErrorHandler(404, "That user doesn't follow you");
    }

    current_user_followers.followers = current_user_followers.followers.filter(
        (id) => id.toString() !== req.params._id.toString()
    );

    current_user.number_of_followers = current_user_followers.followers.length;

    remove_user_following.following = remove_user_following.following.filter(
        (id) => id.toString() !== req.user._id.toString()
    );

    remove_user.number_of_following = remove_user_following.following.length;

    await Promise.all([
        current_user.save(),
        current_user_followers.save(),
        remove_user_following.save(),
        remove_user.save(),
    ]);

    responseHandler(
        res,
        200,
        `${remove_user.username} has been removed from your follower list`
    );
});

export const getAllFollowRequests = asyncHandler(async (req, res) => {
    const current_user = await UserFollower.findOne({
        user: req.user._id,
    })
        .select("+follow_requests")
        .populate({
            path: "follow_requests",
            select: "name username profile_img",
        });

    const allFollowRequests = current_user.follow_requests.map((request) => ({
        _id: request._id,
        name: request.name,
        username: request.username,
        profile_img: request.profile_img,
    }));

    responseHandler(res, 200, "Done", allFollowRequests.reverse());
});

export const getFollowers = asyncHandler(async (req, res) => {
    const followers = await UserFollower.findOne({
        user: req.user._id,
    }).populate("followers", "name username profile_img");

    responseHandler(res, 200, "Followers", followers.followers);
});

export const getFollowing = asyncHandler(async (req, res) => {
    const following = await UserFollower.findOne({
        user: req.user._id,
    }).populate("following", "name username profile_img");

    responseHandler(res, 200, "Following", following.following);
});
