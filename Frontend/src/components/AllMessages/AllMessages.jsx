import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Image from "../Image/Image";
import { InstagramLogo } from "../InstagramIcons/InstagramIcons";
import { InstagramNewChatIcon } from "../InstagramIcons/InstagramIcons";
import { MyContext } from "../../context/MyContext";
import { useSelector } from "react-redux";

const AllMessages = () => {
    const { allChats } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.user);

    const { setDialogBox } = useContext(MyContext);

    return (
        <>
            <div className="all-messages h-screen flex flex-col w-full md:ml-20">
                <div className="header hidden max-[480px]:flex min-[900px]:flex flex-col pt-7 max-[480px]:pt-12 pl-1">
                    <div className="flex justify-between max-[480px]:px-2">
                        <strong className="username text-xl">
                            {user.username}
                        </strong>
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setDialogBox(true);
                            }}
                        >
                            <InstagramNewChatIcon />
                        </div>
                    </div>
                    <div className="messages-request flex justify-between pt-6 pb-2 max-[480px]:px-2">
                        <strong className="message">Messages</strong>
                        <div className="request">Requests</div>
                    </div>
                </div>
                <div className="all-chats scrollbar-hide overflow-auto flex-1 cursor-pointer max-[900px]:pt-10 max-[480px]:pt-0">
                    {allChats &&
                        allChats.length > 0 &&
                        allChats.map((chat) => (
                            <NavLink
                                to={`/messages/${chat._id}`}
                                key={chat._id}
                                className="p-2 flex justify-between hover:bg-[rgba(52,50,50,0.42)]"
                            >
                                <div className="flex max-[480px]:gap-2">
                                    <div className="image">
                                        <Image
                                            image={chat.avtar}
                                            addClasses="w-[48px] h-[43px] min-[550px]:w-[56px] min-[550px]:h-[56px] object-cover"
                                        />
                                    </div>
                                    <div className="chat pl-[10px] hidden max-[480px]:block min-[900px]:block">
                                        <div className="username">
                                            {chat.isGroup
                                                ? chat.name
                                                : chat.users?.find(
                                                      (u) => u._id !== user._id
                                                  )?.name}
                                        </div>
                                        <div className="last-message-and-time flex gap-3 text-[rgb(143,143,143)] text-sm">
                                            <p className="last-message">
                                                {chat.lastMessage}
                                            </p>
                                            <p className="time">
                                                <span className="ml-2 mr-1">
                                                    •
                                                </span>
                                                {chat.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="insta-icon hidden max-[480px]:flex min-[900px]:flex justify-center items-center">
                                    <InstagramLogo />
                                </div>
                            </NavLink>
                        ))}
                </div>
            </div>
        </>
    );
};

export default AllMessages;
