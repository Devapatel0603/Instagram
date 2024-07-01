import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";
import { uploadImage } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { UserFollower } from "../models/user.follower.model.js";
import { SavedPosts } from "../models/savedPosts.model.js";

//Create Post
export const createPost = asyncHandler(async (req, res) => {
    const { caption } = req.body;

    let urls = [];

    if (!req.file && !req.files) {
        throw new ErrorHandler(400, "Please select file...");
    }
    try {
        for (let file of req.files) {
            urls.push(await uploadImage(file));
        }

        const post = await Post.create({
            user: req.user._id,
            urls,
            caption,
        });

        if (!post) {
            throw new ErrorHandler(500, "Something went wrong...");
        }

        let user = await User.findById(req.user._id);

        user.number_of_posts += 1;
        await user.save();

        responseHandler(res, 201, "Post uploaded successfully", post);
    } catch (error) {
        throw new ErrorHandler(500, "Something went wrong...");
    }
});

//Get current user posts
export const getCurrentUserPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ user: req.user._id });

    if (posts.length !== 0) {
        responseHandler(res, 200, "Posts sent successfully", posts.reverse());
    } else {
        responseHandler(res, 202, "You have not uploaded any post yet");
    }
});

//Get other user posts
export const getOtherUserPosts = asyncHandler(async (req, res) => {
    if (req.params._id.toString() === req.user._id.toString()) {
        return responseHandler(res, 203, "Please don't enter your own id");
    }

    const user = await User.findById(req.params._id);

    if (!user) {
        return responseHandler(res, 404, "User not found");
    }

    if (user.is_private_account) {
        return responseHandler(res, 203, "Sorry, this account is private");
    }

    const posts = await Post.find({ user: req.params._id });

    if (posts.length !== 0) {
        return responseHandler(res, 200, "Posts sent successfully", posts);
    } else {
        responseHandler(res, 203, "User has not uploaded any post yet");
    }
});

//Get Posts
export const getPosts = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 2;

    const following = await UserFollower.findOne({ user: req.user._id }).select(
        "+following"
    );

    const followingIds = following.following.map((user) => user._id);

    let user = await User.findById(req.user._id).select(
        "+fetchedFollowingPostIds +fetchedPostIds"
    );

    let sampledPosts_following;

    if (page === 1) {
        let fetchedFollowingPostIds = user.fetchedFollowingPostIds;

        let posts_following = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $match: {
                    $and: [
                        { _id: { $nin: fetchedFollowingPostIds } },
                        { "user._id": { $in: followingIds } },
                        { "user._id": { $ne: req.user._id } },
                        { likes: { $nin: [req.user._id] } },
                    ],
                },
            },
            { $sample: { size: limit * 5 } },
            {
                $project: {
                    "user.password": 0,
                    "user.email": 0,
                    "user.phone_no": 0,
                    "user.fetchedFollowingPostIds": 0,
                    "user.fetchedPostIds": 0,
                    "user.password_reset_token": 0,
                    "user.password_reset_expires": 0,
                },
            },
        ]);

        const uniquePosts_following = posts_following.filter(
            (post, index, self) =>
                self.findIndex(
                    (p) => p._id.toString() === post._id.toString()
                ) === index
        );

        sampledPosts_following =
            uniquePosts_following.slice(0, limit) ||
            uniquePosts_following.slice(0, uniquePosts_following.length);
        const newFetchedPostIds_following = sampledPosts_following.map(
            (post) => post._id
        );

        fetchedFollowingPostIds = [
            ...fetchedFollowingPostIds,
            ...newFetchedPostIds_following,
        ];

        user.fetchedFollowingPostIds = fetchedFollowingPostIds;
        await user.save();
    }

    let fetchedPostIds = user.fetchedPostIds;

    let posts_other = await Post.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: "$user",
        },
        {
            $match: {
                $and: [
                    { _id: { $nin: fetchedPostIds } },
                    { "user._id": { $nin: followingIds } },
                    { "user._id": { $ne: req.user._id } },
                    { "user.is_private_account": false },
                ],
            },
        },
        { $sample: { size: limit * 5 } },
        {
            $project: {
                "user.password": 0,
                "user.__v": 0,
                "user.email": 0,
                "user.phone_no": 0,
                "user.fetchedFollowingPostIds": 0,
                "user.fetchedPostIds": 0,
                "user.password_reset_token": 0,
                "user.password_reset_expires": 0,
            },
        },
    ]);

    const uniquePosts_other = posts_other.filter(
        (post, index, self) =>
            self.findIndex((p) => p._id.toString() === post._id.toString()) ===
            index
    );

    const sampledPosts_other =
        uniquePosts_other.slice(0, limit) ||
        uniquePosts_other.slice(0, uniquePosts_other.length);

    const newFetchedPostIds_other = sampledPosts_other.map((post) => post._id);

    fetchedPostIds = [...fetchedPostIds, ...newFetchedPostIds_other];

    user.fetchedPostIds = fetchedPostIds;
    await user.save();

    if (page === 1) {
        responseHandler(res, 200, "Posts sent successfully", {
            following_posts: sampledPosts_following,
            other_posts: sampledPosts_other,
        });
    } else {
        responseHandler(res, 200, "Posts sent successfully", {
            other_posts: sampledPosts_other,
        });
    }
});

//Add Likes
export const addLikes = asyncHandler(async (req, res) => {
    let post = await Post.findById(req.params._id);
    if (!post) {
        throw new ErrorHandler(404, "Post not found...");
    }

    if (post.likes.some((u) => req.user._id.toString() === u.toString())) {
        return responseHandler(res, 200, "Post already liked", post);
    }

    // Add user to the list of users who liked the post
    post.likes.push(req.user._id);
    post.no_of_likes = post.likes.length;

    await post.save();
    responseHandler(res, 200, "Post liked successfully", post);
});

//Remove Likes
export const removeLikes = asyncHandler(async (req, res) => {
    let post = await Post.findById(req.params._id);
    if (!post) {
        throw new ErrorHandler(404, "Post not found...");
    }
    post.likes = post.likes.filter((u) => {
        u.toString() !== req.user._id.toString();
    });
    post.no_of_likes = post.likes.length;
    await post.save();
    responseHandler(res, 200, "Post updated successfully", post);
});

//Add saved post
export const addSavedPost = asyncHandler(async (req, res) => {
    let savedPosts = await SavedPosts.findOne({ user: req.user._id });

    if (savedPosts.posts.includes(req.params._id)) {
        return responseHandler(res, 409, "You already saved this post");
    }

    const post = await Post.findById(req.params._id);
    if (!post) {
        throw new ErrorHandler(404, "Post not found");
    }

    const user = await User.findById(post.user);

    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }

    const user_follower = await UserFollower.findOne({
        user: user._id,
    }).select("+followers");

    if (
        post.user.toString() !== req.user._id.toString() &&
        !user_follower.followers.includes(req.user._id)
    ) {
        if (user.is_private_account) {
            return responseHandler(res, 403, "Sorry, this account is private");
        }
    }

    savedPosts.posts.push(req.params._id);
    await savedPosts.save();

    return responseHandler(res, 200, "This post saved successfully", post);
});

//Get Saved Posts
export const getSavedPosts = asyncHandler(async (req, res) => {
    const user_saved_posts = await SavedPosts.findOne({
        user: req.user._id,
    }).populate({
        path: "posts",
        select: "user urls no_of_likes likes comments caption",
        populate: {
            path: "user",
            select: "_id username name is_private_account profile_img",
        },
    });

    if (!user_saved_posts) {
        throw new ErrorHandler(404, "Please, provide correct user id");
    }

    const saved_posts = user_saved_posts.posts;

    if (saved_posts.length === 0) {
        responseHandler(res, 209, "You didn't save any posts yet");
    }

    responseHandler(res, 200, "Saved posts sent successfully", saved_posts);
});

//Remove saved post
export const removeSavedPost = asyncHandler(async (req, res) => {
    let savedPosts = await SavedPosts.findOne({ user: req.user._id });

    if (!savedPosts.posts.includes(req.params._id)) {
        return responseHandler(res, 409, "You didn't save this post");
    }

    savedPosts.posts = savedPosts.posts.filter(
        (pi) => pi.toString() !== req.params._id.toString()
    );
    await savedPosts.save();

    responseHandler(res, 200, "You unsaved this post successfully");
});
