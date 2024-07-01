import React, { useContext, useEffect, useState } from "react";
import Loading from "../Loaders/Loading";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    InstagramMultiPostIcon,
    InstagramComments,
    InstagramActiveNotification,
} from "../InstagramIcons/InstagramIcons";
import { MyContext } from "../../context/MyContext";

const ProfilePost = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [hoveredPostId, setHoveredPostId] = useState(null);

    const { setPostDialogBox } = useContext(MyContext);

    const { savedPosts } = useSelector((state) => state.posts);

    const handleHover = (postId) => {
        setHoveredPostId(postId);
    };

    const handleLeave = () => {
        setHoveredPostId(null);
    };

    const renderMedia = (url) => {
        if (url) {
            const fileType = url.split(".").pop().toLowerCase();
            if (["mp4", "webm", "ogg"].includes(fileType)) {
                return (
                    <video src={url} className="w-full h-full object-cover" />
                );
            }
            return (
                <img
                    src={url}
                    alt="Post"
                    className="w-full h-full object-cover"
                />
            );
        }
    };

    return (
        <>
            <div className="text-white w-full md:px-10 mt-4">
                {savedPosts && savedPosts.length > 0 ? (
                    <div className="grid w-full grid-cols-3 md:gap-[4px] place-items-center gap-[1.5px]">
                        <>
                            {savedPosts.map((post, index) => (
                                <div
                                    className={`w-[33dvw] h-[33dvw] md:h-[27dvw] md:w-[27dvw] min-[900px]:h-[28dvw] min-[900px]:w-[28dvw] min-[1100px]:h-[28.7dvw] min-[1100px]:w-[28.7dvw] min-[1200px]:h-[24dvw] min-[1200px]:w-[24dvw] min-[1500px]:h-[24.5dvw] min-[1500px]:w-[24.5dvw] cursor-pointer relative max-[768px]:px-[1.9px] overflow-hidden transition-[color] duration-100 ease-in-out ${
                                        hoveredPostId === post._id
                                            ? "hover:bg-black/10"
                                            : ""
                                    }`}
                                    key={index}
                                    onMouseEnter={() => handleHover(post._id)}
                                    onMouseLeave={handleLeave}
                                    onClick={() => {
                                        setSearchParams({ _id: post._id });
                                        setPostDialogBox(true);
                                    }}
                                >
                                    <div
                                        className={`absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 transition duration-300 ease-in-out ${
                                            hoveredPostId === post._id
                                                ? "opacity-100"
                                                : ""
                                        }`}
                                    />
                                    {renderMedia(post.urls[0])}
                                    <div
                                        className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] gap-3 transition duration-300 ease-in-out ${
                                            hoveredPostId === post._id
                                                ? "flex justify-center items-center"
                                                : "hidden"
                                        }`}
                                    >
                                        <div className="flex gap-2 items-center justify-center">
                                            <InstagramActiveNotification
                                                size={21}
                                            />
                                            <p className="text-[18px]">
                                                {post.no_of_likes}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 items-center justify-center">
                                            <InstagramComments
                                                size={21}
                                                fill="currentColor"
                                            />
                                            <p className="text-[18px]">
                                                {post.comments.length}
                                            </p>
                                        </div>
                                    </div>
                                    {post.urls.length > 1 && (
                                        <div className="absolute top-2 right-2">
                                            <InstagramMultiPostIcon />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    </div>
                ) : (
                    <>
                        <div className="nopost">My name is no posts</div>
                    </>
                )}
            </div>
        </>
    );
};

export default ProfilePost;
