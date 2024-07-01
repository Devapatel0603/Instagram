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

// router.post("/upload", isLoggedin, upload.array("imgs"), async (req, res) => {
//     let urls = [];

//     try {
//         for (const file of req.files) {
//             urls.push(await uploadImage(file));
//         }

//         res.json({ success: true, urls });
//     } catch (err) {
//         console.log(err);
//     } finally {
//         req.file = null;
//     }
// });

export default router;
