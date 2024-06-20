import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Image from "../Image/Image";
import {
    InstagramInfoIcon,
    InstagramGalaryIcon,
} from "../InstagramIcons/InstagramIcons";
import NewMessageDialogBox from "../NewMessageDialogBox/NewMessageDialogBox";
import { MyContext } from "../../context/MyContext";
import { SocketContext } from "../../socket.io";
import {
    setTotalPage,
    addMessagesBack,
    addMessagesFront,
    setMessagePage,
    setMessages,
    setAllChats,
} from "../../redux/slices/chat.slice";
import axios from "axios";
import { toast } from "react-toastify";

const Chats = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { chat, messagePage, messages, totalPage, allChats } = useSelector(
        (state) => state.chat
    );
    const { user } = useSelector((state) => state.user);

    const { dialogBox, getChatDetails, getMessages } = useContext(MyContext);

    const socket = useContext(SocketContext);

    const { _id } = useParams();

    const [message, setMessage] = useState("");

    const scrollMessageRef = useRef(null);
    const previousHeightRef = useRef(0);
    const loadingMoreRef = useRef(false);

    useEffect(() => {
        try {
            getChatDetails(_id, navigate);
        } catch (error) {
            toast.error(error);
        }
        fetchMessages(messagePage, true);
    }, [_id]);

    useEffect(() => {
        fetchMessages(messagePage);
    }, [messagePage]);

    useEffect(() => {
        const handleNewMessage = (data) => {
            const isMessageAlreadyPresent = messages.some(
                (msg) => msg._id.toString() === data._id.toString()
            );
            if (
                !isMessageAlreadyPresent &&
                data.chat.toString() === chat._id.toString()
            ) {
                dispatch(addMessagesFront([data]));
            }
        };

        socket.emit("JOIN_CHAT", { userId: user._id, chatId: chat._id });

        socket.on("NEW_MESSAGE", handleNewMessage);

        return () => {
            socket.off("NEW_MESSAGE", handleNewMessage);
        };
    }, [chat, messages, allChats, dispatch, user._id, socket]);

    const fetchMessages = async (page, initialLoad = false) => {
        if (page !== 1 && page > totalPage) {
            loadingMoreRef.current = false;
            return;
        }
        try {
            const res = await axios.get(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/chats/get/messages/${_id}?page=${page}`,
                { withCredentials: true }
            );
            if (res.status === 200) {
                if (initialLoad) {
                    dispatch(setMessages(res.data.data.message));
                    return;
                }
                dispatch(addMessagesBack(res.data.data.message));
                dispatch(setTotalPage(res.data.data.totalPage));

                scrollMessageRef.current.scrollTop =
                    scrollMessageRef.current.scrollTop;
                loadingMoreRef.current = false;
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Scroll event handler
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } =
            scrollMessageRef.current;
        if (
            Math.abs(scrollTop) + clientHeight + 20 >= scrollHeight &&
            !loadingMoreRef.current
        ) {
            loadingMoreRef.current = true; // Prevent multiple requests
            previousHeightRef.current = scrollMessageRef.current.scrollHeight;

            dispatch(setMessagePage(messagePage + 1));
        }
    };

    // Attach scroll event listener
    useEffect(() => {
        const scrollMessage = scrollMessageRef.current;
        if (scrollMessage) {
            scrollMessage.addEventListener("scroll", handleScroll);
            return () => {
                scrollMessage.removeEventListener("scroll", handleScroll);
            };
        }
    }, [scrollMessageRef.current, chat, messages]);

    // Handle sending messages
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            return;
        }
        socket.emit("NEW_MESSAGE", {
            chatId: chat._id,
            users: chat.users,
            message,
        });
        setMessage("");
    };

    return (
        <>
            <div
                className={`fixed w-dvw h-dvh bg-black bg-opacity-70 ${
                    dialogBox ? "grid place-items-center" : "hidden"
                } `}
            >
                <NewMessageDialogBox />
            </div>
            <div
                className="message-right-section flex flex-col
             max-[480px]:hidden border-[rgb(54,54,54)] border-l-[1px] w-[calc(100dvw_-_100px)] min-[900px]:w-[calc(100dvw_-_400px)] max-[767px]:w-[calc(100dvw_-_72px)] h-dvh"
            >
                <>
                    <div className="profile flex justify-between items-center border-[rgb(54,54,54)] border-b">
                        <div className="name-img flex items-center gap-3 pl-2">
                            <div className="profile-img">
                                <Image
                                    image={chat.avtar}
                                    addClasses="w-[71px] h-[71px]"
                                />
                            </div>
                            <div className="name text-[19px] font-bold">
                                {chat.isGroup
                                    ? chat.name
                                    : chat.users?.find(
                                          (u) => u._id !== user._id
                                      )?.name}
                            </div>
                        </div>
                        <div className="info cursor-pointer pr-5">
                            <InstagramInfoIcon />
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div
                        className="messages flex w-full flex-col-reverse h-[calc(100%_-_142px)] overflow-auto px-7"
                        ref={scrollMessageRef}
                    >
                        {messages &&
                            messages.length > 0 &&
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`max-w-[60%] p-[10px] rounded-[10px] mb-[10px] ${
                                        msg.sender._id.toString() ===
                                        user._id.toString()
                                            ? "bg-[#e72fe7] self-end text-right ml-auto"
                                            : "bg-[#5e5d5d] self-start text-left mr-auto"
                                    }`}
                                >
                                    <p className="message-content">
                                        {msg.content}
                                    </p>
                                </div>
                            ))}
                    </div>

                    {/* Message Section */}
                    <div className="form h-[70px] w-full flex justify-center items-center">
                        <form onSubmit={handleSubmit} className="w-full p-7">
                            <div className="galary-input h-[50px] flex justify-center items-center  rounded-3xl w-full border-[rgb(78,77,77)] border-[1.2px]">
                                <div className="galary cursor-pointer w-[60px] flex justify-center items-center pl-1">
                                    <InstagramGalaryIcon />
                                </div>

                                <div className="input w-[calc(100%_-_60px)] h-full flex items-center justify-between">
                                    <input
                                        type="text"
                                        name="message"
                                        id="message"
                                        placeholder="Message..."
                                        className="h-[85%] appearance-none bg-black focus:outline-none w-[calc(100%_-_150px)]"
                                        value={message}
                                        onInput={(e) => {
                                            setMessage(e.target.value);
                                        }}
                                    />
                                    <div className="icons flex h-full gap-5 w-[130px]">
                                        <div className="galary cursor-pointer flex justify-center items-center">
                                            <InstagramGalaryIcon />
                                        </div>
                                        <div className="galary cursor-pointer flex justify-center items-center">
                                            <InstagramGalaryIcon />
                                        </div>
                                        <button
                                            type="submit"
                                            className="galary cursor-pointer flex justify-center items-center pr-[10px]"
                                        >
                                            <InstagramGalaryIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            </div>
        </>
    );
};

export default Chats;
