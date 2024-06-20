import { getUserFromJwtToken } from "../utils/getUserFromJwtToken.js";
import { ErrorHandler } from "../utils/errorHandler.js";

const isLoggedin = async (req, res, next) => {
    try {
        const token = await req.cookies.token;
        if (!token) {
            throw new ErrorHandler(401, "You are not logged in");
        }
        const user = await getUserFromJwtToken(token);

        if (user === 400) {
            return next(new ErrorHandler(401, "You are not logged in"));
        } else {
            req.user = user;
        }

        next();
    } catch (err) {
        return next(new ErrorHandler(400, "Please login first"));
    }
};

const socketLoggedin = async (socket, next) => {
    try {
        const token = await socket.handshake.headers.cookie.substring(6);

        if (!token) {
            throw new ErrorHandler(401, "You are not logged in");
        }

        const user = await getUserFromJwtToken(token);

        if (user === 400) {
            return next(new ErrorHandler(401, "You are not logged in"));
        }

        socket.user = user;

        next();
    } catch (error) {
        return next(new ErrorHandler(400, "Please login first"));
    }
};

export { isLoggedin, socketLoggedin };
