import React, { useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setFollowRequests } from "../../redux/slices/user.slice";
import { MyContext } from "../../context/MyContext";
import Image from "../Image/Image";

const AllFriendRequests = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { followRequests, user } = useSelector((state) => state.user);

    useEffect(() => {
        if (followRequests && followRequests.length === 0) {
            navigate("/notifications");
        }
    }, [followRequests, navigate]);

    const { getFollowRequests } = useContext(MyContext);

    useEffect(() => {
        if (!followRequests) {
            getFollowRequests();
        }
    }, []);

    const acceptRejectRequest = async (accept, _id) => {
        try {
            const res = await axios.put(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/users/accept/follow/request/${_id}`,
                { accept },
                { withCredentials: true }
            );

            if (res.status === 200) {
                const newArr = followRequests.filter(
                    (req) => req._id.toString() !== _id.toString()
                );

                dispatch(setFollowRequests(newArr));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {followRequests && followRequests.length > 0 ? (
                followRequests.map((req) => (
                    <div
                        className="all-friend-requests w-[70%] md:max-w-[670px] max-[768px]:w-full h-[54px] flex justify-between"
                        key={req._id}
                    >
                        <div className="profile flex h-full gap-2">
                            <div className="image h-full flex items-center">
                                <Image
                                    image={req.profile_img}
                                    addClasses="h-[50px] w-[50px]"
                                    alt="Profile Image"
                                />
                            </div>
                            <div className="uname-name h-full text-[13px] flex flex-col justify-center">
                                <div className="uname font-bold">
                                    {req.username}
                                </div>
                                <div className="name text-[rgb(138,133,133)]">
                                    {req.name}
                                </div>
                            </div>
                        </div>
                        <div className="btns flex h-full items-center gap-5 text-[14.5px]">
                            <button
                                className="accept bg-[rgb(0,149,246)] hover:bg-[rgb(0,120,255)] py-[5.5px] flex w-[80px] justify-center rounded-lg"
                                onClick={() =>
                                    acceptRejectRequest(true, req._id)
                                }
                            >
                                Confirm
                            </button>
                            <button
                                className="reject bg-[rgb(49,49,49)] hover:bg-[rgb(30,30,30)] py-[5.5px] rounded-lg w-[80px] justify-center"
                                onClick={() =>
                                    acceptRejectRequest(false, req._id)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-follow-request text-white">
                    No follow requests available.
                </div>
            )}
        </>
    );
};

export default AllFriendRequests;
