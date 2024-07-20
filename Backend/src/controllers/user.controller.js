import { User } from "../models/user.model.js";
import { UserFollower } from "../models/user.follower.model.js";
import { SavedPosts } from "../models/savedPosts.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";
import { addJwtTokenToCookie } from "../utils/addJwtTokenToCookie.js";
import { getUserFromJwtToken } from "../utils/getUserFromJwtToken.js";
import { uploadImage } from "../utils/cloudinary.js";

//User Login
export const login = asyncHandler(async (req, res) => {
    let { emailphoneusername, password } = req.body;
    emailphoneusername = emailphoneusername.toLowerCase().trim();
    password = password.trim();

    if (!emailphoneusername || !password) {
        throw new ErrorHandler(403, "Please fill provide all fields");
    }

    if (password.length < 8) {
        throw new ErrorHandler(
            403,
            "Password must be at least 8 characters long"
        );
    }

    const userNamePattern = /^[a-z0-9_]{3,40}$/gi;
    const emailPattern = /[\w_\.]+@([\w]+\.)+[\w-]{2,10}/gi;
    const phonePattern = /^[1-9]{1}[0-9]{9}$/gi;

    const usernameTest = await userNamePattern.test(emailphoneusername);
    const emailTest = await emailPattern.test(emailphoneusername);
    const phoneTest = await phonePattern.test(emailphoneusername);

    if (!usernameTest && !emailTest && !phoneTest) {
        throw new ErrorHandler(403, "Please enter valid details");
    }

    let user;

    if (usernameTest) {
        user = await User.findOne({ username: emailphoneusername }).select(
            "+password"
        );
    } else if (emailTest) {
        user = await User.findOne({ email: emailphoneusername }).select(
            "+password"
        );
    } else {
        user = await User.findOne({ phone_no: emailphoneusername }).select(
            "+password"
        );
    }

    if (!user) {
        throw new ErrorHandler(403, "Please enter valid details");
    }

    if (await user.checkPassword(password)) {
        await addJwtTokenToCookie(res, user._id);
    } else {
        throw new ErrorHandler(403, "Please enter valid details");
    }

    responseHandler(res, 200, "Login Successful", {
        _id: user._id,
        username: user.username,
        name: user.name,
        is_private_account: user.is_private_account,
        profile_img: user.profile_img,
        number_of_posts: user.number_of_posts,
        number_of_followers: user.number_of_followers,
        number_of_following: user.number_of_following,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
});

//User Registration   // Set default profile Image
export const register = asyncHandler(async (req, res) => {
    let { username, phoneemail, fullname, password } = req.body;
    username = username.toLowerCase().trim();
    phoneemail = phoneemail.trim();
    fullname = fullname.trim();
    password = password.trim();

    if (!phoneemail || !username || !password || !fullname) {
        throw new ErrorHandler(403, "Please fill provide all fields");
    }

    if (password.length < 8) {
        throw new ErrorHandler(
            403,
            "Password must be at least 8 characters long"
        );
    }

    const userNamePattern = /^[a-z0-9_]{3,40}$/gi;
    const emailPattern = /[\w_\.]+@([\w]+\.)+[\w-]{2,10}/gi;
    const phonePattern = /^[1-9]{1}[0-9]{9}$/gi;

    const usernameTest = await userNamePattern.test(username);
    const emailTest = await emailPattern.test(phoneemail);
    const phoneTest = await phonePattern.test(phoneemail);

    if (!usernameTest || (!emailTest && !phoneTest)) {
        throw new ErrorHandler(403, "Please enter valid details");
    }

    let user = await User.findOne({ username: username });

    if (user) {
        throw new ErrorHandler(403, "Username already exists");
    }

    if (emailTest) {
        user = await User.findOne({ email: phoneemail });
        if (user) {
            throw new ErrorHandler(403, "Email already exists");
        }
    } else {
        user = await User.findOne({ phone_no: phoneemail });
        if (user) {
            throw new ErrorHandler(403, "Phone number already exists");
        }
    }

    if (emailTest) {
        user = await User.create({
            username,
            password,
            name: fullname,
            email: phoneemail,
        });
    } else {
        user = await User.create({
            username,
            password,
            name: fullname,
            phone_no: phoneemail,
        });
    }

    await UserFollower.create({
        user: user._id,
    });

    await SavedPosts.create({
        user: user._id,
    });

    await addJwtTokenToCookie(res, user._id);

    if (!user.profile_img) {
        user.profile_img = null; // Set default profile Image
    }

    responseHandler(res, 201, "Registration successful", {
        _id: user._id,
        username: user.username,
        name: user.name,
        is_private_account: user.is_private_account,
        profile_img: user.profile_img,
        number_of_posts: user.number_of_posts,
        number_of_followers: user.number_of_followers,
        number_of_following: user.number_of_following,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
});

//User Logout
export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token");
    responseHandler(res, 200, "Logout Successfully");
});

//Get User Data
export const getUserData = asyncHandler(async (req, res) => {
    const token = await req.cookies.token;

    if (!token) {
        responseHandler(res, 200, "Not Logged In");
    }

    const user = await getUserFromJwtToken(token);

    if (user === 400) {
        responseHandler(res, 200, "Invalid Token");
    }

    responseHandler(res, 200, "Done", user);
});

//Edit Profile Image
export const editProfileImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ErrorHandler(400, "Please upload image");
    }
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(400, "User not found");
    }

    let url;
    url = await uploadImage(req.file);

    user.profile_img = url;
    await user.save();

    responseHandler(res, 200, "Profile image updated", user);

    // const { base64Image, contentType } = response.data.data;
    // setImageSrc(`data:${contentType};base64,${base64Image}`);
});

//Edit Privacy Image
export const editPrivacy = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { privacy } = req.body;

    if (!user) {
        throw new ErrorHandler(400, "User not found");
    }

    if (!privacy) {
        throw new ErrorHandler(400, "Please, provide all details");
    }

    console.log("Hello");

    user.is_private_account =
        privacy.toLowerCase() === "private" ? true : false;

    user.save();

    responseHandler(res, 200, "Privacy changed successfully", user);
});

//Edit Username
export const editUserName = asyncHandler(async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) {
        throw new ErrorHandler(400, "User not found");
    }

    const userNamePattern = /^[a-z0-9_]{3,40}$/gi;
    const usernameTest = userNamePattern.test(req.body.username.trim());

    if (!usernameTest) {
        throw new ErrorHandler(403, "Please enter valid Username");
    }

    const existed_user = await User.findOne({
        username: req.body.username,
    });

    if (existed_user) {
        throw new ErrorHandler(403, "Username already exists");
    }

    user.username = req.body.username;
    const updated_user = await user.save();

    responseHandler(res, 200, "Username Updated successfully");
});

//Get Perticular User Data
export const getPerticularUserData = asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
        throw new ErrorHandler(404, "User does not exist");
    }

    responseHandler(res, 200, "User data sent successfully", user);
});

//Get Users By search
export const getUsers = asyncHandler(async (req, res) => {
    const search = req.query.search;

    if (!search) {
        responseHandler(res, 203, "Please enter name or username");
    }

    const token = await req.cookies.token;
    let followingIds = [];
    let user;
    if (token) {
        user = await getUserFromJwtToken(token);
        if (user !== 400) {
            var following = await UserFollower.findOne({
                user: user._id,
            }).populate({
                path: "following",
                match: {
                    $or: [
                        { username: { $regex: search, $options: "i" } },
                        { name: { $regex: search, $options: "i" } },
                    ],
                },
            });

            if (following && following.following) {
                var following_users = following.following;
                followingIds = following_users.map((user) => user._id);
            }
        }
    }
    let other_users = await User.find({
        $or: [
            { username: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
        ],
        _id: { $nin: followingIds },
    });

    if (user !== 400) {
        other_users = other_users.filter(
            (u) => u._id.toString() !== user._id.toString()
        );
    }

    const users =
        following_users.length > 0
            ? following_users.concat(other_users)
            : other_users;

    if (users.length === 0) {
        responseHandler(res, 203, "No user found");
    }

    responseHandler(res, 200, "Users", users);
});
