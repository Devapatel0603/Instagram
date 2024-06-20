import React, { useContext, useEffect } from "react";
import AllMessages from "../components/AllMessages/AllMessages";
import { Outlet } from "react-router-dom";
import { SocketContext } from "../socket.io";
import { useDispatch, useSelector } from "react-redux";
import { setAllChats } from "../redux/slices/chat.slice";

const Messages = () => {
    const dispatch = useDispatch();
    const { messages, allChats } = useSelector((state) => state.chat);

    return (
        <>
            <div className="flex h-dvh text-white">
                <div className="all-messages max-[768px]:pt-3 h-full max-[480px]:w-full min-[900px]:w-[400px] md:pr-[10px] min-[900px]:pr-[15px] flex justify-end gap-4">
                    <AllMessages />
                </div>

                <Outlet />
            </div>
        </>
    );
};

export default Messages;
