import { Router } from "express";
import { isLoggedin } from "../middlewares/isLoggedin.middleware.js";
import {
    addFollowing,
    removeFollowing,
    getFollowingSuggetions,
    removeFollower,
    cancelFriendRequest,
    acceptOrRejectFollowRequest,
    getAllFollowRequests,
    getFollowers,
    getFollowing,
} from "../controllers/user.follower.controller.js";

const router = Router();

//Send Follow Request or Follow
router.route("/add/following/:_id").put(isLoggedin, addFollowing);

//Remove following
router.route("/remove/following/:_id").put(isLoggedin, removeFollowing);

//Get suggetions of Users
router.route("/get/suggetions").get(isLoggedin, getFollowingSuggetions);

//Accept Follow Request
router
    .route("/accept/follow/request/:_id")
    .put(isLoggedin, acceptOrRejectFollowRequest);

//Remove Follower
router.route("/remove/follower/:_id").put(isLoggedin, removeFollower);

//Cancel Friend Request
router
    .route("/cancel/friend/request/:_id")
    .put(isLoggedin, cancelFriendRequest);

//Get follow requests
router.route("/get/follow/requests").get(isLoggedin, getAllFollowRequests);

//Get followers
router.route("/get/followers").get(isLoggedin, getFollowers);

//Get following
router.route("/get/following").get(isLoggedin, getFollowing);

export default router;
