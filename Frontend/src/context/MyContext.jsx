import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    setUser,
    setOtherUser,
    setRequestSent,
    deleteRequestSent,
    setFollowRequests,
    setSuggetionProfiles,
} from "../redux/slices/user.slice";
import {
    setInfiniteScrollLoading,
    setUserPosts,
    setNoOfLikes,
    setCurrentUserPosts,
    setFollowingPosts,
    setPosts,
    setSavedPosts,
    removeSavedPosts,
} from "../redux/slices/posts.slice";
import {
    setChat,
    setAllChats,
    setIsChatCreated,
} from "../redux/slices/chat.slice";
import { toast } from "react-toastify";

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
    const dispatch = useDispatch();

    const { otherUser, user } = useSelector((state) => state.user);
    const { noOfLikes, page } = useSelector((state) => state.posts);
    const { isChatCreated, messagePage } = useSelector((state) => state.chat);

    const [dialogBox, setDialogBox] = useState(false);

    //Get current user data
    const getUserDetails = async (setLoading) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/users/getuser`,
                {
                    withCredentials: true,
                }
            );
            if (res.data.message === "Done") {
                dispatch(setUser(res.data.data));
            }
        } catch (error) {
            console.error("Error fetching user details", error);
        } finally {
            setLoading(false);
        }
    };

    //Get current user posts
    const getCurrentUserPosts = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/posts/get/other/posts/${
                    user._id
                }`,
                { withCredentials: true }
            );
            if (res.status === 200) {
                dispatch(setCurrentUserPosts(res.data.posts));
            }
        } catch (error) {}
    };

    //Get other user data
    const fetchUserData = async (username, setLoading, navigate) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/users/get/user/data/${username}`,
                { withCredentials: true }
            );
            if (res.status === 200) {
                dispatch(setOtherUser(res.data.data));
            }
            const postRes = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/posts/get/other/posts/${
                    res.data.data._id
                }`,
                { withCredentials: true }
            );
            if (postRes.status === 200) {
                dispatch(setUserPosts(postRes.data.posts));
            }
        } catch (error) {
            toast.error("User does not exist");
            navigate(`/${user.username}`);
        } finally {
            setLoading(false);
        }
    };

    //Fetch posts for Home page
    const fetchPosts = async () => {
        dispatch(setInfiniteScrollLoading(true));
        try {
            const res = await axios.get(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/posts?limit=3&page=${page}`,
                { withCredentials: true }
            );
            if (res.status === 200) {
                if (res.data.data.other_posts) {
                    dispatch(setPosts(res.data.data.other_posts));
                }
                dispatch(setFollowingPosts(res.data.data.following_posts));
            }
        } catch (error) {
            toast.error("Error in fetching posts");
        }
        dispatch(setInfiniteScrollLoading(true));
    };

    //Like post
    const addLike = async (_id) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/posts/add/like/${_id}`,
                { withCredentials: true }
            );
            dispatch(setNoOfLikes({ [_id]: noOfLikes[_id] + 1 }));
        } catch (error) {
            console.log(error);
        }
    };

    //Unlike Post
    const removeLike = async (_id) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/posts/remove/like/${_id}`,
                { withCredentials: true }
            );
            dispatch(setNoOfLikes({ [_id]: noOfLikes[_id] - 1 }));
        } catch (error) {
            console.log(error);
        }
    };

    //Get Saved Posts
    const savedPosts = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/posts/get/saved/posts`,
                { withCredentials: true }
            );

            if (res.status === 200) {
                dispatch(setSavedPosts(res.data.data));
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Save post
    const addSaved = async (_id) => {
        try {
            const res = await axios.get(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/posts/add/saved/post/${_id}`,
                { withCredentials: true }
            );
            if (res.status === 200) {
                dispatch(setSavedPosts(_id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Unsave post
    const removeSaved = async (_id) => {
        try {
            const res = await axios.get(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/posts/remove/saved/post/${_id}`,
                { withCredentials: true }
            );

            if (res.status === 200) {
                dispatch(removeSavedPosts(_id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Get all chats
    const getChats = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/chats`,
                {
                    withCredentials: true,
                }
            );
            if (res.status === 200) {
                dispatch(setAllChats(res.data.data));
            }
        } catch (error) {}
    };

    //Get Single chat details
    const getChatDetails = async (_id, navigate) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/chats/${_id}`,
                { withCredentials: true }
            );
            if (res.status === 200) {
                dispatch(setChat(res.data.data));
            } else {
                toast.error("Please enter correct chat id");
            }
        } catch (error) {
            toast.error(error.response.data.message);
            navigate("/messages");
        }
    };

    //Get Follow Requests
    const getFollowRequests = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/users/get/follow/requests`,
                {
                    withCredentials: true,
                }
            );
            if (res.status === 200) {
                dispatch(setFollowRequests(res.data.data));
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Get 5 Suggetions
    const getSuggetions = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/users/get/suggetions`,
                { withCredentials: true }
            );
            if (res.status === 200) {
                dispatch(setSuggetionProfiles(res.data.data));
            }
        } catch (error) {
            console.log("Error fetching suggetions:", error);
        }
    };

    //Send freiend request or follow
    const handleFollow = async (_id) => {
        try {
            const res = await axios.put(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/users/add/following/${_id}`,
                {},
                { withCredentials: true }
            );
            if (res.status === 200) {
                if (res.data.message === "Friend request sent successfully") {
                    dispatch(setRequestSent({ [_id]: "Friend Request sent" }));
                } else {
                    dispatch(setRequestSent({ [_id]: "Follow" }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Cancel friend request
    const handleCancelFriendRequest = async (_id) => {
        try {
            const res = await axios.put(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/users/cancel/friend/request/${_id}`,
                {},
                { withCredentials: true }
            );
            if (res.status === 200) {
                dispatch(deleteRequestSent(_id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Unfollow
    const handleUnfollowRequest = async (_id) => {
        try {
            const res = await axios.put(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/users/remove/following/${_id}`,
                {},
                { withCredentials: true }
            );
            if (res.status === 200) {
                dispatch(deleteRequestSent(_id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Get Messages
    const getMessages = async (_id, initialLoad = false) => {
        // try {
        //     const res = await axios.get(
        //         `${
        //             import.meta.env.VITE_BACKEND_URL
        //         }/chats/get/messages/${_id}?page=${messagePage}`,
        //         { withCredentials: true }
        //     );
        //     if (res.status === 200) {
        //         if (initialLoad) {
        //             dispatch(setMessages(res.data.data));
        //         } else {
        //             dispatch(addMessages(res.data.data));
        //         }
        //         dispatch(setMessagePage(page));
        //         if (!initialLoad) {
        //             // Adjust the scroll position to maintain user's view
        //             const newHeight = scrollMessageRef.current.scrollHeight;
        //             scrollMessageRef.current.scrollTop =
        //                 newHeight - previousHeightRef.current;
        //             loadingMoreRef.current = false; // Reset loading flag
        //         }
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
    };

    return (
        <MyContext.Provider
            value={{
                isChatCreated,
                dialogBox,
                getMessages,
                handleFollow,
                handleCancelFriendRequest,
                handleUnfollowRequest,
                getChats,
                getSuggetions,
                getFollowRequests,
                getChatDetails,
                getCurrentUserPosts,
                setDialogBox,
                getUserDetails,
                fetchUserData,
                fetchPosts,
                addLike,
                removeLike,
                savedPosts,
                addSaved,
                removeSaved,
            }}
        >
            {children}
        </MyContext.Provider>
    );
};
