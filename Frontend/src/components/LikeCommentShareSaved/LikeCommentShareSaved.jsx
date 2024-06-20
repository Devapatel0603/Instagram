import React, { useEffect, useState, useContext } from "react";
import {
    InstagramActiveSaved,
    InstagramLikeIcon,
    InstagramSaved,
    InstagramNotification,
    InstagramComments,
    InstagramMessage,
} from "../InstagramIcons/InstagramIcons";
import { useSelector } from "react-redux";
import { MyContext } from "../../context/MyContext";

const LikeCommentShareSaved = ({ _id }) => {
    const { posts, followingPosts, userPosts, savedPosts } = useSelector(
        (state) => state.posts
    );

    const { addLike, removeLike, removeSaved, addSaved } =
        useContext(MyContext);

    const { user } = useSelector((state) => state.user);

    const [like, setLike] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (Array.isArray(followingPosts) && followingPosts.length > 0) {
            const follow_post = followingPosts.find(
                (post) => post._id.toString() === _id.toString()
            );

            if (follow_post && follow_post.likes.includes(user._id)) {
                setLike(true);
            }
        }
        if (Array.isArray(posts) && posts.length > 0) {
            const post = posts.find(
                (post) => post._id.toString() === _id.toString()
            );

            if (post && post.likes.includes(user._id)) {
                setLike(true);
            }
        }
    }, [posts, followingPosts, _id, user._id]);

    useEffect(() => {
        if (Array.isArray(savedPosts) && savedPosts.length > 0) {
            if (savedPosts.includes(_id)) {
                setSaved(true);
            }
        }
    }, [savedPosts, _id, user._id]);

    return (
        <>
            <div className="like-comment-share-saved mt-2 flex justify-between pl-1 pr-1">
                <div className="like-comment-share flex gap-4">
                    <div
                        className="like cursor-pointer"
                        onClick={() => {
                            setLike(!like);
                        }}
                    >
                        {!like ? (
                            <div onClick={() => addLike(_id)}>
                                <InstagramNotification likehover={true} />
                            </div>
                        ) : (
                            <div onClick={() => removeLike(_id)}>
                                <InstagramLikeIcon />
                            </div>
                        )}
                    </div>
                    <div className="comment cursor-pointer">
                        <InstagramComments />
                    </div>
                    <div className="share cursor-pointer">
                        <InstagramMessage />
                    </div>
                </div>
                <div
                    className="saved cursor-pointer"
                    onClick={() => {
                        setSaved(!saved);
                    }}
                >
                    {!saved ? (
                        <div onClick={() => addSaved(_id)}>
                            <InstagramSaved />
                        </div>
                    ) : (
                        <div onClick={() => removeSaved(_id)}>
                            <InstagramActiveSaved />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LikeCommentShareSaved;
