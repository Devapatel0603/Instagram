import { useState, useEffect, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LeftSideNavbarComponent from "./components/LeftSideNavbarComponent/LeftSideNavbarComponent";
import Messages from "./routes/Messages";
import Home from "./routes/Home";
import Reels from "./routes/Reels";
import Explore from "./routes/Explore";
import Header from "./components/Header/Header";
import Profile from "./routes/Profile";
import ProfilePost from "./components/ProfilePost/ProfilePost";
import ProfileSaved from "./components/ProfileSaved/ProfileSaved";
import ProfileTagged from "./components/ProfileTagged/ProfileTagged";
import Register from "./routes/Register";
import Login from "./routes/Login";
import StartingLoader from "./components/Loaders/StartingLoader";
import Create from "./routes/Create";
import Notifications from "./routes/Notifications";
import DefaultMessagePage from "./components/DefaultMessagePage/DefaultMessagePage";
import Chats from "./components/Chats/Chats";
import { MyContext } from "./context/MyContext";
import { SocketContext } from "./socket.io";
import { setAllChats } from "./redux/slices/chat.slice";
import { useAsyncEffect } from "react-dynamic-hooks";
import Settings from "./routes/Settings";
import {
    setFollowings,
    setFollowRequests,
    setUser,
} from "./redux/slices/user.slice";

function App() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { user, followRequests, followings } = useSelector(
        (state) => state.user
    );
    const { page } = useSelector((state) => state.posts);
    const { isChatCreated, allChats } = useSelector((state) => state.chat);

    const {
        getSuggetions,
        getFollowRequests,
        getUserDetails,
        getSavedPosts,
        getCurrentUserPosts,
        fetchPosts,
        getChats,
    } = useContext(MyContext);

    // Using custom async effect hook
    useAsyncEffect(async () => {
        await getUserDetails(setLoading);
    }, []);

    useAsyncEffect(async () => {
        if (user && user._id) {
            await getSavedPosts();
            await getCurrentUserPosts();
            await getFollowRequests();
            await getSuggetions();
        }
    }, [user]);

    useAsyncEffect(async () => {
        if (user && user._id) {
            await fetchPosts();
        }
    }, [user, page]);

    useEffect(() => {
        const fetchChats = async () => {
            if (user && user._id) {
                await getChats();
            }
        };

        fetchChats();
    }, [user, isChatCreated]);

    const socket = useContext(SocketContext);

    useEffect(() => {
        const handleMessageAlert = (data) => {
            const chatId = data.chatId;
            const latestChat = allChats.find(
                (chat) => chat._id.toString() === chatId
            );
            if (latestChat) {
                const updatedAllChats = [
                    latestChat,
                    ...allChats.filter(
                        (chat) => chat._id.toString() !== chatId
                    ),
                ];
                dispatch(setAllChats(updatedAllChats));
            }
        };

        socket.on("NEW_MESSAGE_ALERT", handleMessageAlert);

        return () => {
            socket.off("NEW_MESSAGE_ALERT", handleMessageAlert);
        };
    }, [socket, dispatch, allChats]);

    useEffect(() => {
        if (user) {
            socket.emit("JOIN", { userId: user._id });

            const handleFriendRequests = ({ user: sentUser }) => {
                const updatedFollowRequests = [sentUser, ...followRequests];
                dispatch(setFollowRequests(updatedFollowRequests));
            };

            socket.on("NEW_FOLLOW_REQUEST", handleFriendRequests);

            const handleCancelFriendRequests = ({ user: sentUser }) => {
                const updatedFollowRequests = followRequests.filter(
                    (request) =>
                        request._id.toString() !== sentUser._id.toString()
                );
                dispatch(setFollowRequests(updatedFollowRequests));
            };

            socket.on("CANCEL_FRIEND_REQUEST", handleCancelFriendRequests);

            const handleCancelFollowRequests = ({ user: sentUser }) => {
                const updatedFollowings = followings.filter(
                    (following) =>
                        following._id.toString() !== sentUser._id.toString()
                );

                const updatedUser = {
                    ...user,
                    number_of_following: updatedFollowings.length,
                };

                dispatch(setUser(updatedUser));
                dispatch(setFollowings(updatedFollowings));
            };

            socket.on("CANCEL_FOLLOW_REQUEST", handleCancelFollowRequests);
        }
    }, [socket, followRequests, user]);

    return (
        <>
            {loading ? (
                <StartingLoader />
            ) : (
                <div className="h-min-dvh bg-black overflow-y-hidden">
                    {user && <Header />}
                    {user && <LeftSideNavbarComponent />}
                    <Routes>
                        <Route path="/" element={user ? <Home /> : <Login />} />
                        <Route
                            path="home"
                            element={
                                user ? (
                                    <Home />
                                ) : (
                                    <Navigate to="/" replace={true} />
                                )
                            }
                        />
                        <Route
                            path="explore"
                            element={
                                user ? (
                                    <Explore />
                                ) : (
                                    <Navigate to="/" replace={true} />
                                )
                            }
                        />
                        <Route
                            path="reels"
                            element={
                                user ? (
                                    <Reels />
                                ) : (
                                    <Navigate to="/" replace={true} />
                                )
                            }
                        />
                        <Route
                            path="messages"
                            element={
                                user ? (
                                    <Messages />
                                ) : (
                                    <Navigate to="/" replace={true} />
                                )
                            }
                        >
                            <Route path="" element={<DefaultMessagePage />} />
                            <Route path=":_id" element={<Chats />} />
                        </Route>
                        <Route
                            path="notifications"
                            element={
                                user ? (
                                    <Notifications />
                                ) : (
                                    <Navigate to="/" replace={true} />
                                )
                            }
                        />
                        <Route
                            path="settings"
                            element={
                                user ? (
                                    <Settings />
                                ) : (
                                    <Navigate to="/" replace={true} />
                                )
                            }
                        />
                        <Route
                            path="create"
                            element={
                                user ? (
                                    <Create />
                                ) : (
                                    <Navigate to="/" replace={true} />
                                )
                            }
                        />
                        {user && (
                            <Route
                                path=":username"
                                element={
                                    user ? (
                                        <Profile />
                                    ) : (
                                        <Navigate to="/" replace={true} />
                                    )
                                }
                            >
                                <Route path="" element={<ProfilePost />} />
                                <Route
                                    path="saved"
                                    element={<ProfileSaved />}
                                />
                                <Route
                                    path="tagged"
                                    element={<ProfileTagged />}
                                />
                            </Route>
                        )}
                        <Route
                            path="register"
                            element={
                                !user ? (
                                    <Register />
                                ) : (
                                    <Navigate to="/" replace={true} />
                                )
                            }
                        />
                        <Route
                            path="login"
                            element={
                                !user ? (
                                    <Login />
                                ) : (
                                    <Navigate to="/" replace={true} />
                                )
                            }
                        />
                    </Routes>
                </div>
            )}
        </>
    );
}

export default App;
