import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../context/MyContext";
import Loading from "../components/Loaders/Loading";

const Followers = () => {
    const navigate = useNavigate();
    const { username } = useParams();

    const { otherUser, user } = useSelector((state) => state.user);
    const { userPosts, currentUserPosts } = useSelector((state) => state.posts);

    const { fetchUserData, postDialogBox } = useContext(MyContext);

    var [loading, setLoading] = useState(user.username !== username);

    useEffect(() => {
        if (user.username !== username) {
            navigate("");
        }
    }, []);

    return (
        <>
            {loading ? (
                <>
                    <Loading />)
                </>
            ) : (
                <>
                    <div className="followers flex flex-col h-dvh pt-[50px] md:pl-[85px] md:pt-2 min-[1200px]:pl-64 text-white min-[1200px]:pr-[370px]"></div>
                </>
            )}
        </>
    );
};

export default Followers;
