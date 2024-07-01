import React, { useContext, useEffect, useState } from "react";
import { InstagramCrossIcon } from "../InstagramIcons/InstagramIcons";
import { MyContext } from "../../context/MyContext";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../Loaders/Loading";
import Post from "../PostsWhichAreShownToUserRandomly/Post";
import PostedByProfile from "../PostsWhichAreShownToUserRandomly/PostedByProfile";
import CommentsProfile from "../PostsWhichAreShownToUserRandomly/CommentsProfile";
import LikeCommentShareSaved from "../LikeCommentShareSaved/LikeCommentShareSaved";

const PostDialogBox = () => {
    const navigate = useNavigate();

    const { postDialogBox, setPostDialogBox } = useContext(MyContext);

    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("_id");

    const { user, otherUser } = useSelector((state) => state.user);
    const { currentUserPosts, userPosts, savedPosts } = useSelector(
        (state) => state.posts
    );

    const { username } = useParams();

    const [currentPost, setCurrentPost] = useState();
    const [loading, setLoading] = useState(false);
    const [readMoreStates, setReadMoreStates] = useState({});

    const toggleReadMore = (id) => {
        setReadMoreStates((prevStates) => ({
            ...prevStates,
            [id]: !prevStates[id],
        }));
    };

    const getPost = async () => {
        const _id = searchParams.get("_id");
        if (username === user.username) {
            let post;
            post = currentUserPosts.find(
                (post) => post._id.toString() === _id.toString()
            );
            if (!post) {
                post = savedPosts.find(
                    (post) => post._id.toString() === _id.toString()
                );
            }
            if (!post) {
                setPostDialogBox(false);
                setSearchParams();
                return;
            }
            setCurrentPost(post);
        } else {
            setLoading(true);
            await fetchUserData(username, setLoading, navigate);
            const isPrivate = otherUser && otherUser?.is_private_account;
            if (isPrivate) {
                toast.error("This account is private");
                setPostDialogBox(false);
                setSearchParams();
                return;
            }
            let post = userPosts.find(
                (post) => post._id.toString() === _id.toString
            );
            if (!post) {
                setPostDialogBox(false);
                setSearchParams();
                return;
            }
            setCurrentPost(post);
        }
    };

    useEffect(() => {
        if (searchParams.get("_id")) {
            setPostDialogBox(true);
            getPost();
        } else {
            setPostDialogBox(false);
        }
    }, [id, currentUserPosts, userPosts, savedPosts]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="post flex w-[65%] h-[75%] bg-[#3a3939] overflow-hidden">
                        <div
                            className="icon cursor-pointer absolute top-12 right-40"
                            onClick={() => {
                                setSearchParams();
                                setPostDialogBox(false);
                            }}
                        >
                            <InstagramCrossIcon />
                        </div>
                        {currentPost && (
                            <>
                                <div className="allPosts w-[50%] h-full flex justify-center items-center border-[rgb(106,103,103)] border-r-[0.1px] p-2">
                                    <Post
                                        postUrls={currentPost.urls}
                                        noBorder={true}
                                        noNumber={true}
                                    />
                                </div>
                                <div className="othersection w-[50%] h-full relative">
                                    <div className="profile h-[13%] w-full flex items-center border-[rgb(106,103,103)] border-b-[0.1px]">
                                        <PostedByProfile
                                            username={username}
                                            image={
                                                username === user.username
                                                    ? user.profile_img
                                                    : otherUser.profile_img
                                            }
                                            newClasses="w-full pr-3"
                                            // time={currentPost.createdAt}
                                        />
                                    </div>
                                    <div className="comments overflow-auto h-[63.6%] scrollbar-hide">
                                        <CommentsProfile />
                                    </div>
                                    <div className="like-comment-save absolute bottom-0 w-full p-2 z-[2] bg-[#3a3939] h-[23.4%]">
                                        <LikeCommentShareSaved
                                            _id={currentPost._id}
                                        />
                                        <div className="postDescription mt-1 w-full">
                                            <div className="noOfLikes w-full">
                                                {currentPost.no_of_likes} likes
                                            </div>
                                            <div className="username-description w-full">
                                                {username}&nbsp;
                                                {currentPost.caption &&
                                                !readMoreStates[currentPost._id]
                                                    ? currentPost.caption.substring(
                                                          0,
                                                          15
                                                      )
                                                    : currentPost.caption}
                                                {currentPost.caption &&
                                                !readMoreStates[currentPost._id]
                                                    ? "..."
                                                    : ""}
                                                {currentPost.caption && (
                                                    <span
                                                        className="readmore text-[rgb(128,122,122)] cursor-pointer"
                                                        onClick={() =>
                                                            toggleReadMore(
                                                                currentPost._id
                                                            )
                                                        }
                                                    >
                                                        {readMoreStates[
                                                            currentPost._id
                                                        ]
                                                            ? " less"
                                                            : " more"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default PostDialogBox;
