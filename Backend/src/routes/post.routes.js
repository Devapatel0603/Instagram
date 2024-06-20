import { Router } from "express";
import { isLoggedin } from "../middlewares/isLoggedin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createPost,
    addLikes,
    removeLikes,
    getPosts,
    getCurrentUserPosts,
    getOtherUserPosts,
    addSavedPost,
    removeSavedPost,
    getSavedPosts,
} from "../controllers/post.controller.js";

const router = Router();

//Create Post
router.route("/create").post(isLoggedin, upload.array("posts"), createPost);

//Get current user posts
router.route("/get/user/posts").get(isLoggedin, getCurrentUserPosts);

//Get other user posts
router.route("/get/other/posts/:_id").get(isLoggedin, getOtherUserPosts);

//Get Posts
router.route("").get(isLoggedin, getPosts);

//Add Like
router.route("/add/like/:_id").get(isLoggedin, addLikes);

//Remove Like
router.route("/remove/like/:_id").get(isLoggedin, removeLikes);

//Add saved post
router.route("/add/saved/post/:_id").get(isLoggedin, addSavedPost);

//Remove saved post
router.route("/remove/saved/post/:_id").get(isLoggedin, removeSavedPost);

//Get Saved Posts
router.route("/get/saved/posts").get(isLoggedin, getSavedPosts);

export default router;
