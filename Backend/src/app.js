import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(cookieParser());

//User Auth Routes
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/users", userRoutes);

//User Routes
import userFollowerRoutes from "./routes/user.follower.routes.js";
app.use("/api/v1/users", userFollowerRoutes);

//Post Routes
import postRoutes from "./routes/post.routes.js";
app.use("/api/v1/posts", postRoutes);

//Chat Routes
import chatRoutes from "./routes/chat.routes.js";
app.use("/api/v1/chats", chatRoutes);

app.use(errorHandler);

export { app };
