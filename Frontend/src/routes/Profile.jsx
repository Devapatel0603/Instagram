import React, { useEffect, useState, useContext } from "react";
import ProfileTopSection from "../components/ProfileTopSection/ProfileTopSection";
import ProfileBottomSection from "../components/ProfileBottomSection/ProfileBottomSection";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loaders/Loading";
import { useSelector } from "react-redux";
import { MyContext } from "../context/MyContext";
import { toast } from "react-toastify";

const Profile = () => {
    const navigate = useNavigate();
    const { username } = useParams();

    const { otherUser, user } = useSelector((state) => state.user);
    const { userPosts, currentUserPosts } = useSelector((state) => state.posts);

    const { fetchUserData } = useContext(MyContext);

    var [loading, setLoading] = useState(user.username !== username);

    useEffect(() => {
        if (user.username !== username) {
            fetchUserData(username, setLoading, navigate);
        }
    }, []);

    return (
        <>
            {loading ? (
                <>
                    <Loading />
                </>
            ) : (
                <>
                    <div className="profile bg-black w-dvw h-dvh text-white md:pl-[50px] pt-[50px] md:pt-2 min-[1200px]:pl-64 overflow-auto">
                        <div className="profile-top min-[1200px]:w-[80dvw] min-[1200px]:float-end h-[69.5dvh] pl-1 sm:pl-4 flex justify-center pt-16">
                            <ProfileTopSection
                                user={
                                    user.username === username
                                        ? user
                                        : otherUser
                                }
                            />
                        </div>
                        <div className="profile-bottom min-[1200px]:w-[80dvw] min-[1200px]:float-end min-h-0 pl-1 sm:pl-4">
                            <ProfileBottomSection username={username} />
                            <Outlet
                                posts={
                                    user.username === username
                                        ? currentUserPosts
                                        : userPosts
                                }
                                isPrivate={
                                    otherUser && otherUser?.is_private_account
                                }
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Profile;
