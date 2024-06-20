import React, { useContext } from "react";
import Image from "../Image/Image";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { MyContext } from "../../context/MyContext";

const ProfileCard = ({ link, user, follow }) => {
    const { requestSent } = useSelector((state) => state.user);

    const { handleFollow, handleCancelFriendRequest, handleUnfollowRequest } =
        useContext(MyContext);
    return (
        <>
            <div className="profileCard flex w-full justify-between">
                <NavLink to={link} className="flex justify-between w-full">
                    <div className="profileImage flex items-center">
                        <Image
                            image={user.profile_img}
                            alt="Profile Image"
                            addClasses="md:h-[41px] object-cover md:w-[41px]"
                        />
                        <div className="profileName flex flex-col text-white pl-4 leading-[17px]">
                            <div className="username text-[13.6px]">
                                {user.username}
                            </div>
                            <div className="name text-[13.6px] text-[rgb(134,133,133)]">
                                {user.name}
                            </div>
                        </div>
                    </div>

                    {follow === "See" && (
                        <div className="detailLink text-blue-400 text-[12px] flex items-center">
                            {follow}
                        </div>
                    )}
                </NavLink>
                {follow !== "See" && (
                    <div className="flex items-center mt-2">
                        {requestSent && requestSent[user._id] ? (
                            <button
                                className="text-[12px] text-gray-500"
                                onClick={
                                    requestSent[user._id] ===
                                    "Friend Request sent"
                                        ? () =>
                                              handleCancelFriendRequest(
                                                  user._id
                                              )
                                        : () => handleUnfollowRequest(user._id)
                                }
                            >
                                {requestSent[user._id] === "Friend Request sent"
                                    ? "Cancel"
                                    : "Unfollow"}
                            </button>
                        ) : (
                            <button
                                className="text-blue-400 text-[12px]"
                                onClick={() => handleFollow(user._id)}
                            >
                                Follow
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProfileCard;
