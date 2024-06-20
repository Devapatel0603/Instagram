import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice";
import postReducer from "./slices/posts.slice";
import chatReducer from "./slices/chat.slice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postReducer,
        chat: chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
