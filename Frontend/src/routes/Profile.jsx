import React, { useEffect, useState, useContext } from "react";
import ProfileTopSection from "../components/ProfileTopSection/ProfileTopSection";
import ProfileBottomSection from "../components/ProfileBottomSection/ProfileBottomSection";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loaders/Loading";
import { useSelector } from "react-redux";
import { MyContext } from "../context/MyContext";
import PostDialogBox from "../components/DialogBoxes/PostDialogBox";

const Profile = () => {
    const navigate = useNavigate();
    const { username } = useParams();

    const { otherUser, user } = useSelector((state) => state.user);
    const { userPosts, currentUserPosts } = useSelector((state) => state.posts);

    const { fetchUserData, postDialogBox } = useContext(MyContext);

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
                    <div
                        className={`fixed w-[100%] h-[100%] md:pl-[85px] min-[1200px]:pl-64 bg-black bg-opacity-70 z-[2] text-white ${
                            postDialogBox ? "grid place-items-center" : "hidden"
                        } `}
                    >
                        <PostDialogBox />
                    </div>
                    <div className="profile bg-black w-dvw h-dvh text-white md:pl-[50px] pt-[50px] md:pt-2 min-[1200px]:pl-64 overflow-auto scrollbar-hide max-[768px]:w-full">
                        <div className="profile-top min-[1200px]:w-[80dvw] min-[1200px]:float-end h-[69.5dvh] pl-1 sm:pl-4 flex justify-center pt-16">
                            <ProfileTopSection
                                user={
                                    user.username === username
                                        ? user
                                        : otherUser
                                }
                            />
                        </div>

                        <div className="profile-bottom min-[1200px]:w-[80dvw] min-[1200px]:float-end min-h-0 pl-1 sm:pl-4 max-[768px]:w-full">
                            <ProfileBottomSection username={username} />
                            <Outlet />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Profile;
