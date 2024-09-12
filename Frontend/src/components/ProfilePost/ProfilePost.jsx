import React, { useContext, useEffect, useState } from "react";
import Loading from "../Loaders/Loading";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    InstagramMultiPostIcon,
    InstagramComments,
    InstagramActiveNotification,
} from "../InstagramIcons/InstagramIcons";
import { MyContext } from "../../context/MyContext";

const ProfilePost = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [hoveredPostId, setHoveredPostId] = useState(null);

    const { username } = useParams();

    const { setPostDialogBox } = useContext(MyContext);

    const { otherUser, user } = useSelector((state) => state.user);
    const { userPosts, currentUserPosts } = useSelector((state) => state.posts);

    const isPrivate = otherUser && otherUser?.is_private_account;

    useEffect(() => {
        setLoading(false);
    }, [currentUserPosts, userPosts, isPrivate]);

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
                {loading && <Loading />}
                {!loading && username === user.username ? (
                    currentUserPosts && currentUserPosts.length > 0 ? (
                        <div className="grid w-full grid-cols-3 md:gap-[4px] place-items-center gap-[1.5px]">
                            <>
                                {currentUserPosts.map((post, index) => (
                                    <div
                                        className={`w-[33dvw] h-[33dvw] md:h-[27dvw] md:w-[27dvw] min-[900px]:h-[28dvw] min-[900px]:w-[28dvw] min-[1100px]:h-[28.7dvw] min-[1100px]:w-[28.7dvw] min-[1200px]:h-[24dvw] min-[1200px]:w-[24dvw] min-[1500px]:h-[24.5dvw] min-[1500px]:w-[24.5dvw] cursor-pointer relative max-[768px]:px-[1.9px] overflow-hidden transition-[color] duration-100 ease-in-out ${
                                            hoveredPostId === post._id
                                                ? "hover:bg-black/10"
                                                : ""
                                        }`}
                                        key={index}
                                        onMouseEnter={() =>
                                            handleHover(post._id)
                                        }
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
                    )
                ) : isPrivate ? (
                    <>
                        <div className="private">This accout is private</div>
                    </>
                ) : (
                    <div className="grid w-full grid-cols-3 md:gap-[4px] place-items-center gap-[1.5px]">
                        <>
                            {userPosts.map((post, index) => (
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
                )}
                {/* {!loading && !isPrivate ? (
                    posts && posts.length > 0 ? (
                        <div className="grid w-full grid-cols-3 md:gap-[4px] place-items-center gap-[1.5px]">
                            <>
                                {posts.map((post, index) => (
                                    <div
                                        className={`w-[33dvw] h-[33dvw] md:h-[27dvw] md:w-[27dvw] min-[900px]:h-[28dvw] min-[900px]:w-[28dvw] min-[1100px]:h-[28.7dvw] min-[1100px]:w-[28.7dvw] min-[1200px]:h-[24dvw] min-[1200px]:w-[24dvw] min-[1500px]:h-[24.5dvw] min-[1500px]:w-[24.5dvw] cursor-pointer relative max-[768px]:px-[1.9px] overflow-hidden transition-[color] duration-100 ease-in-out ${
                                            hoveredPostId === post._id
                                                ? "hover:bg-black/10"
                                                : ""
                                        }`}
                                        key={index}
                                        onMouseEnter={() =>
                                            handleHover(post._id)
                                        }
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
                    )
                ) : (
                    isPrivate && (
                        <>
                            <div className="private">
                                This accout is private
                            </div>
                        </>
                    )
                )} */}
            </div>
        </>
    );
};

export default ProfilePost;
