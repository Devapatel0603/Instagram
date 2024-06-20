import { Router } from "express";
import { isLoggedin } from "../middlewares/isLoggedin.middleware.js";
import {
    createChat,
    createGroup,
    getChats,
    addInGroup,
    removeFromGroup,
    renameGroup,
    getChat,
    leaveGroup,
    sendAttachments,
    getMessages,
    deleteChatOrGroup,
} from "../controllers/chat.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//Get Chats
router.route("").get(isLoggedin, getChats);

//Get single chat details and Delete chat or group
router
    .route("/:_id")
    .get(isLoggedin, getChat)
    .delete(isLoggedin, deleteChatOrGroup);

//Create Chats
router.route("/create/chat").post(isLoggedin, createChat);

//Create Group
router
    .route("/create/group")
    .post(isLoggedin, upload.single("groupImg"), createGroup);

//Add in Group
router.route("/add/in/group").put(isLoggedin, addInGroup);

//Remove From Group
router.route("/remove/from/group").put(isLoggedin, removeFromGroup);

//Rename Group
router.route("/rename/group").put(isLoggedin, renameGroup);

//Leave the Group
router.route("/leave/:_id").get(isLoggedin, leaveGroup);

//Send attachments
router
    .route("/send/attachments")
    .post(isLoggedin, upload.array("attachments"), sendAttachments);

//Get Messages
router.route("/get/messages/:_id").get(isLoggedin, getMessages);

export default router;
