import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PostedByProfile from "../PostsWhichAreShownToUserRandomly/PostedByProfile";
import Post from "../PostsWhichAreShownToUserRandomly/Post";
import LikeCommentShareSaved from "../LikeCommentShareSaved/LikeCommentShareSaved";
import { useSelector } from "react-redux";
import Loading from "../Loaders/Loading";
import HandleNoFollowingPosts from "../HandleNoFollowingPosts/HandleNoFollowingPosts";

const ShowPostsToUsers = () => {
    const { posts, followingPosts, noOfLikes } = useSelector(
        (state) => state.posts
    );

    const [readMoreStates, setReadMoreStates] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [posts]);

    const toggleReadMore = (id) => {
        setReadMoreStates((prevStates) => ({
            ...prevStates,
            [id]: !prevStates[id],
        }));
    };

    return (
        <div className="showPostsToUsers w-full sm:min-w-[500px] min-h-0 grid place-items-center">
            {loading ? (
                <Loading />
            ) : (
                <>
                    {followingPosts &&
                        followingPosts.length > 0 &&
                        followingPosts.map((post) => (
                            <div
                                className="post mb-5 max-[640px]:w-full sm:w-[92.5%] min-[1500px]:w-[700px]"
                                key={post._id}
                            >
                                <NavLink
                                    to={post.user.username}
                                    className="profileImage h-12 max-[500px]:px-1"
                                >
                                    <PostedByProfile
                                        username={post.user.username}
                                        name={post.user.name}
                                        image={post.user.profile_img}
                                    />
                                </NavLink>
                                {/* <div className="allPosts min-h-0 min-w-0 flex justify-center items-center"> */}
                                <div className="allPosts w-[500px] h-[500px] flex justify-center items-center">
                                    <Post postUrls={post.urls} />
                                </div>

                                <div className="likeComment max-[500px]:px-3 max-[500px]:py-1">
                                    <LikeCommentShareSaved _id={post._id} />
                                </div>
                                <div className="postDescription pl-1 pr-1 mt-1 w-full">
                                    <div className="noOfLikes w-full">
                                        {noOfLikes[post._id]} likes
                                    </div>
                                    <div className="username-description w-full">
                                        {post.user.username}&nbsp;
                                        {post.caption &&
                                        !readMoreStates[post._id]
                                            ? post.caption.substring(0, 15)
                                            : post.caption}
                                        {post.caption &&
                                        !readMoreStates[post._id]
                                            ? "..."
                                            : ""}
                                        {post.caption && (
                                            <span
                                                className="readmore text-[rgb(128,122,122)] cursor-pointer"
                                                onClick={() =>
                                                    toggleReadMore(post._id)
                                                }
                                            >
                                                {readMoreStates[post._id]
                                                    ? " less"
                                                    : " more"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    <HandleNoFollowingPosts />
                    {posts &&
                        posts.length > 0 &&
                        posts.map((post) => (
                            <div
                                className="post mb-5 max-[640px]:w-full sm:w-[92.5%] min-[1500px]:w-[700px]"
                                key={post._id}
                            >
                                <NavLink
                                    to={post.user.username}
                                    className="profileImage h-12 max-[500px]:px-1"
                                >
                                    <PostedByProfile
                                        username={post.user.username}
                                        name={post.user.name}
                                        image={post.urls[0]}
                                    />
                                </NavLink>
                                <div className="allPosts min-h-0 min-w-0 flex justify-center items-center">
                                    <Post postUrls={post.urls} />
                                </div>
                                <div className="likeComment max-[500px]:px-3 max-[500px]:py-1">
                                    <LikeCommentShareSaved _id={post._id} />
                                </div>
                                <div className="postDescription pl-1 pr-1 mt-1 w-full">
                                    <div className="noOfLikes w-full">
                                        {noOfLikes[post._id]} likes
                                    </div>
                                    <div className="username-description w-full">
                                        {post.user.username}&nbsp;
                                        {post.caption &&
                                        !readMoreStates[post._id]
                                            ? post.caption.substring(0, 15)
                                            : post.caption}
                                        {post.caption &&
                                        !readMoreStates[post._id]
                                            ? "..."
                                            : ""}
                                        {post.caption && (
                                            <span
                                                className="readmore text-[rgb(128,122,122)] cursor-pointer"
                                                onClick={() =>
                                                    toggleReadMore(post._id)
                                                }
                                            >
                                                {readMoreStates[post._id]
                                                    ? " less"
                                                    : " more"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </>
            )}
        </div>
    );
};

export default ShowPostsToUsers;
