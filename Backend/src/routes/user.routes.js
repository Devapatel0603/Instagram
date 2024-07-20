import { Router } from "express";
import {
    logout,
    getUserData,
    login,
    register,
    editProfileImage,
    editUserName,
    getUsers,
    getPerticularUserData,
    editPrivacy,
} from "../controllers/user.controller.js";
import { isLoggedin } from "../middlewares/isLoggedin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//User Registration
router.route("/register").post(register);

//User login
router.route("/login").post(login);

//User logout
router.route("/logout").post(isLoggedin, logout);

//Edit user privacy
router.route("/privacy").post(isLoggedin, editPrivacy);

//Get current User Data
router.route("/getuser").get(getUserData);

//Edit Profile Image
router
    .route("/edit/progileimage")
    .post(isLoggedin, upload.single("profileImg"), editProfileImage);

//Edit Username
router.route("/edit/username").put(isLoggedin, editUserName);

//Get Perticular User Data
router.route("/get/user/data/:username").get(isLoggedin, getPerticularUserData);

//Get users by search
router.route("").get(getUsers);

export default router;
