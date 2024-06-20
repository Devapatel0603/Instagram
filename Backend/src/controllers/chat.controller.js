import { Chat } from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";
import {
    uploadImage,
    getPublicIdFromUrl,
    deleteFromCloudInary,
} from "../utils/cloudinary.js";
import { Message } from "../models/message.model.js";

//Get Chats
export const getChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({
        users: { $in: [req.user._id] },
    })
        .populate({
            path: "admin",
            select: "_id username name is_private_account profile_img",
        })
        .populate({
            path: "users",
            select: "_id username name is_private_account profile_img",
        })
        .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "_id username name is_private_account profile_img",
            },
        })
        .sort({
            updatedAt: -1,
        });
    chats.forEach((chat) => {
        chat.users = chat.users.filter(
            (user) => user._id.toString() !== req.user._id.toString()
        );
        if (!chat.isGroup) {
            chat.avtar = chat.users[0].profile_img;
        }
    });
    responseHandler(res, 200, "Chats sent successfully", chats);
});

//Get single chat details
export const getChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params._id).sort({
        updatedAt: -1,
    });

    if (!chat.users.includes(req.user._id)) {
        throw new ErrorHandler(403, "You are not in this chat");
    }

    const populatedChat = await Chat.findById(req.params._id)
        .populate({
            path: "admin",
            select: "_id username name is_private_account profile_img",
        })
        .populate({
            path: "users",
            select: "_id username name is_private_account profile_img",
        })
        .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "_id username name is_private_account profile_img",
            },
        })
        .sort({
            updatedAt: -1,
        });
    responseHandler(res, 200, "Chat details sent successfully", populatedChat);
});

//Create Chat
export const createChat = asyncHandler(async (req, res) => {
    const existed_chat = await Chat.findOne({
        $or: [
            { users: { $all: [req.user._id, req.body._id], $size: 2 } },
            { users: { $all: [req.body._id, req.user._id], $size: 2 } },
        ],
    }).populate({
        path: "latestMessage",
        populate: {
            path: "sender",
            select: "_id username name is_private_account profile_img",
        },
    });

    if (existed_chat) {
        return responseHandler(
            res,
            200,
            "Chat sent successfully",
            existed_chat
        );
    }

    const chat = await Chat.create({
        admin: req.user._id,
        users: [req.user._id, req.body._id],
        name: "Sender",
    });

    responseHandler(res, 201, "Chat created successfully", chat);
});

//Create Group
export const createGroup = asyncHandler(async (req, res) => {
    if (!req.body.users) {
        throw new ErrorHandler(404, "Please provide users");
    }

    let selectedIds = JSON.parse(req.body.users);
    if (!selectedIds || selectedIds.length < 2 || !req.body.groupName) {
        if (selectedIds.length < 2) {
            throw new ErrorHandler(
                404,
                "More than 2 users required to cretae group"
            );
        }
        throw new ErrorHandler(404, "Please provide all fields");
    }

    let url;
    if (req.file) {
        url = await uploadImage(req.file);
    }

    let chat;
    if (url) {
        chat = await Chat.create({
            name: req.body.groupName,
            admin: req.user._id,
            users: [req.user._id, ...selectedIds],
            isGroup: true,
            avtar: url,
        });
    } else {
        chat = await Chat.create({
            name: req.body.groupName,
            admin: req.user._id,
            users: [req.user._id, ...selectedIds],
            isGroup: true,
        });
    }

    responseHandler(res, 201, "Group created successfully", chat);
});

//Add User in Group
export const addInGroup = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.groupId) {
        throw new ErrorHandler(400, "Please provide all fields");
    }

    let group = await Chat.findById(req.body.groupId);

    if (!group) {
        throw new ErrorHandler(400, "Please provide correct group id");
    }

    if (!group.isGroup) {
        throw new ErrorHandler(400, "This is not a group");
    }

    if (!group.users.includes(req.user._id)) {
        throw new ErrorHandler(403, "You are not in the group");
    }

    if (group.admin.toString() !== req.user._id.toString()) {
        throw new ErrorHandler(403, "Only admin can add members in group");
    }

    let uniqueMembers = req.body.users.filter(
        (u) => !group.users.includes(u.toString())
    );
    uniqueMembers = uniqueMembers.filter(
        (user, index) => uniqueMembers.indexOf(user) === index
    );

    group.users = group.users.concat(uniqueMembers);
    await group.save();

    group = await Chat.findById(req.body.groupId).populate({
        path: "users",
        populate: "name",
    });

    const allUsersName = uniqueMembers.map((i) => i.name).join(",");

    responseHandler(res, 200, "Users added to group successfully");
});

//Remove User from Group
export const removeFromGroup = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.groupId) {
        throw new ErrorHandler(400, "Please provide all fields");
    }

    let group = await Chat.findById(req.body.groupId);

    if (!group) {
        throw new ErrorHandler(400, "Please provide correct group id");
    }

    if (!group.isGroup) {
        throw new ErrorHandler(400, "This is not a group");
    }

    if (group.users.length <= 3) {
        throw new ErrorHandler(400, "Group aleast have 3 members");
    }

    if (!group.users.includes(req.user._id)) {
        throw new ErrorHandler(403, "You are not in the group");
    }

    if (group.admin.toString() !== req.user._id.toString()) {
        throw new ErrorHandler(403, "Only admin can remove members in group");
    }

    let uniqueMembers = req.body.users.filter((u) =>
        group.users.includes(u.toString())
    );
    uniqueMembers = uniqueMembers.filter(
        (user, index) => uniqueMembers.indexOf(user) === index
    );

    if (uniqueMembers.includes(req.user._id)) {
        throw new ErrorHandler(403, "Admin cannot be removed from the group");
    }

    group.users = group.users.filter(
        (_id) => !uniqueMembers.includes(_id.toString())
    );
    await group.save();

    group = await Chat.findById(req.body.groupId).populate({
        path: "users",
        populate: "name",
    });

    const allUsersName = uniqueMembers.map((i) => i.name).join(",");

    responseHandler(res, 200, "Users removed from group successfully");
});

//Rename Group
export const renameGroup = asyncHandler(async (req, res) => {
    if (!req.body.groupName || !req.body.groupId) {
        throw new ErrorHandler(400, "Please provide all fields");
    }

    const group = await Chat.findById(req.body.groupId);

    if (!group) {
        throw new ErrorHandler(400, "Please provide correct group id");
    }

    if (!group.isGroup) {
        throw new ErrorHandler(400, "This is not a group");
    }

    if (!group.users.includes(req.user._id)) {
        throw new ErrorHandler(403, "You are not in the group");
    }

    if (group.admin.toString() !== req.user._id.toString()) {
        throw new ErrorHandler(403, "Only admin can change group name");
    }

    group.name = req.body.groupName;
    await group.save();

    group = await Chat.findById(req.body.groupId).populate({
        path: "users",
        populate: "name",
    });

    responseHandler(res, 200, "Group name changed successfully");
});

//Leave the group
export const leaveGroup = asyncHandler(async (req, res) => {
    if (!req.params._id) {
        throw new ErrorHandler(400, "Please provide GroupId");
    }

    let group = await Chat.findById(req.params._id);

    if (!group) {
        throw new ErrorHandler(400, "Please provide correct group id");
    }

    if (!group.isGroup) {
        throw new ErrorHandler(400, "This is not a group");
    }

    if (!group.users.includes(req.user._id)) {
        throw new ErrorHandler(400, "You are not in the group");
    }

    if (group.users.length <= 3) {
        throw new ErrorHandler(400, "Group aleast have 3 members");
    }

    const remainingUsers = group.users.filter(
        (_id) => _id.toString() !== req.user._id.toString()
    );

    if (group.admin.toString() === req.user._id.toString()) {
        const newAdmin = remainingUsers[0];
        group.admin = newAdmin;
    }

    group.users = remainingUsers;
    await group.save();
});

//Send Attachments
export const sendAttachments = asyncHandler(async (req, res) => {
    const chatId = req.body.chatId;

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new ErrorHandler(400, "Chat not found");
    }
    const files = req.files || [];

    if (files.length < 1) {
        throw new ErrorHandler(404, "Please provide attachments");
    }

    const attachments = [];

    const messageStore = {
        content: "",
        attachments,
        sender: req.user._id,
        chat: chatId,
    };

    const message = await Message.create(messageStore);

    responseHandler(res, 200, "ok");
});

//Get Messages
export const getMessages = asyncHandler(async (req, res) => {
    if (!req.params._id) {
        throw new ErrorHandler(404, "Please provide Chat id");
    }

    const page = req.query.page || 1;
    const limit = 20;

    const chat = await Chat.findById(req.params._id);

    if (!chat) {
        throw new ErrorHandler(404, "Chat not found");
    }

    if (!chat.users.includes(req.user._id)) {
        throw new ErrorHandler(403, "You are not allowed to see this messages");
    }

    const [message, totalDocs] = await Promise.all([
        Message.find({ chat: req.params._id })
            .sort({
                createdAt: -1,
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("sender", "name username is_private_account")
            .lean(),
        Message.countDocuments({ chat: req.params._id }),
    ]);

    const totalPage = Math.ceil(totalDocs / limit);
    message.totalPage = totalPage;

    responseHandler(res, 200, "Message sent successfully", {
        message: message,
        totalPage,
    });
});

//Delete Chat or Group
export const deleteChatOrGroup = asyncHandler(async (req, res) => {
    const group = await Chat.findById(req.params._id);

    if (!group) {
        throw new ErrorHandler(400, "Please provide correct group or chat id");
    }

    if (!group.users.includes(req.user._id)) {
        throw new ErrorHandler(403, "You are not in the group");
    }

    if (group.isGroup && group.admin.toString() !== req.user._id.toString()) {
        throw new ErrorHandler(403, "Only admin can delete group");
    }

    //Delete from cloudinary
    const messageWithAttachments = await Message.find({
        chat: group._id,
        attachments: { $exists: true, $ne: [] },
    });

    const public_ids = [];

    for (const message of messageWithAttachments) {
        for (const attachment of message.attachments) {
            public_ids.push(await getPublicIdFromUrl(attachment));
        }
    }

    await Promise.all([
        deleteFromCloudInary(public_ids),
        group.deleteOne(),
        Message.deleteMany({ chat: group._id }),
    ]);

    responseHandler(res, 200, "Chat or Group Deleted Successfully");
});

//In create group
// const following_users = await UserFollower.findOne({
//     user: req.user._id,
// }).select("+followers");
// req.body.users.forEach((_id) => {
//     if (!following_users.followers.includes(_id)) {
//         throw new ErrorHandler(
//             404,
//             "You can only make group with users who follows you"
//         );
//     }
// });
