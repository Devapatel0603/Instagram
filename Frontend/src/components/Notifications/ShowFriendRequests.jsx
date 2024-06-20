import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "../Image/Image";
import { InstagramGreaterThanIcon } from "../InstagramIcons/InstagramIcons";
import { MyContext } from "../../context/MyContext";
import Loading from "../Loaders/Loading";

const ShowFriendRequests = () => {
    const { followRequests } = useSelector((state) => state.user);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, [followRequests]);

    return (
        <>
            <div className="show-friend-requests w-[70%] md:max-w-[670px] max-[768px]:w-full h-[70px] border-b border-b-[rgb(54,54,54)] flex justify-between">
                {followRequests && followRequests.length > 0 ? (
                    <>
                        <div className="image-follow-counte h-full flex items-center">
                            <div className="image">
                                <Image
                                    addClasses="h-[60px] w-[60px]"
                                    image={followRequests[0].profile_img}
                                    alt="Follow Request Images"
                                />
                            </div>
                            <div className="follow-counter">
                                <div className="heading font-bold text-[15px]">
                                    Follow Requests
                                </div>
                                <div className="counter text-[rgb(139,138,138)] text-[12px]">
                                    {followRequests &&
                                        `${followRequests[0].username}`}
                                    <span className="text-[13px] text-[rgb(190,187,187)]">
                                        {followRequests &&
                                            ` + ${
                                                followRequests.length - 1
                                            } others`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="greater-icon flex h-full pr-2">
                            <div className="notification h-full"></div>
                            <div className="icon h-full flex items-center text-[rgb(168,163,163)]">
                                <InstagramGreaterThanIcon />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="no-request h-full w-full flex justify-center items-center">
                            No request
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ShowFriendRequests;
