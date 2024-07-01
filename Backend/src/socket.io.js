import { Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import dotenv from "dotenv";
import { socketLoggedin } from "./middlewares/isLoggedin.middleware.js";
import { Message } from "./models/message.model.js";

dotenv.config({
    path: "./.env",
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

var ALERT = "ALERT";
var FETCH_CHATS = "FETCH_CHATS";
var NEW_ATTACHMENTS = "NEW_ATTACHMENTS";
var NEW_MESSAGE = "NEW_MESSAGE";
var NEW_MESSAGE_ALERT = "NEW_MESSAGE_ALERT";
var NEW_FOLLOW_REQUEST = "NEW_FOLLOW_REQUEST";
var CANCEL_FOLLOW_REQUEST = "CANCEL_FOLLOW_REQUEST";

io.use((socket, next) => {
    socketLoggedin(socket, next);
});

io.on("connection", (socket) => {
    const user = socket.user;
    console.log("User Connected", socket.id);

    socket.on(ALERT, () => {
        console.log("ALERT event received");
    });

    socket.on(FETCH_CHATS, () => {
        console.log("FETCH_CHATS event received");
    });

    socket.on(NEW_ATTACHMENTS, () => {
        console.log("NEW_ATTACHMENTS event received");
    });

    socket.on("JOIN_CHAT", ({ userId, chatId }) => {
        socket.join(chatId);
        console.log("Join chat executed");
    });

    socket.on(NEW_MESSAGE, async ({ chatId, message }) => {
        const messageForDB = {
            sender: user._id,
            chat: chatId,
            content: message,
        };

        const newMessage = await Message.create(messageForDB);

        const messageForRealTime = {
            _id: newMessage._id,
            sender: {
                _id: user._id,
                name: user.name,
            },
            content: message,
            chat: chatId,
            createdAt: new Date().toISOString(),
        };

        io.in(chatId).emit(NEW_MESSAGE, messageForRealTime);
        io.in(chatId).emit(NEW_MESSAGE_ALERT, { chatId });
    });

    socket.on(NEW_FOLLOW_REQUEST, () => {
        console.log("NEW_FOLLOW_REQUEST event received");
    });

    socket.on(CANCEL_FOLLOW_REQUEST, () => {
        console.log("CANCEL_FOLLOW_REQUEST event received");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

export { io, server };
