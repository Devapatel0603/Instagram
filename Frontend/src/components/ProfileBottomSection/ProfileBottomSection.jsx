import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
    InstagramPostsIcon,
    InstagramReels,
    InstagramSavedIcon,
    InstagramTaggedIcon,
} from "../InstagramIcons/InstagramIcons";
import { useSelector } from "react-redux";

const ProfileBottomSection = ({ username }) => {
    const { user } = useSelector((state) => state.user);

    return (
        <div className="text-white">
            <div className="profile-navigation flex justify-center items-center gap-14 text-[12px]">
                <NavLink
                    to={`/${username}`}
                    className={() =>
                        `${
                            window.location.pathname.endsWith(`/${username}`)
                                ? "text-white border-t-[1px] border-white"
                                : "text-[rgb(143,141,141)]"
                        } pt-3 cursor-pointer flex justify-center items-center gap-2`
                    }
                >
                    <InstagramPostsIcon />
                    POSTS
                </NavLink>

                {user.username !== username ? (
                    <NavLink
                        to={`/${username}/saved`}
                        className={({ isActive }) =>
                            `${
                                isActive
                                    ? "text-white border-t-[1px] border-white"
                                    : "text-[rgb(143,141,141)]"
                            } pt-3 cursor-pointer flex justify-center items-center gap-2`
                        }
                    >
                        <InstagramReels />
                        REELS
                    </NavLink>
                ) : (
                    <NavLink
                        to={`/${username}/saved`}
                        className={({ isActive }) =>
                            `${
                                isActive
                                    ? "text-white border-t-[1px] border-white"
                                    : "text-[rgb(143,141,141)]"
                            } pt-3 cursor-pointer flex justify-center items-center gap-2`
                        }
                    >
                        <InstagramSavedIcon />
                        SAVED
                    </NavLink>
                )}

                <NavLink
                    to={`/${username}/tagged`}
                    className={({ isActive }) =>
                        `${
                            isActive
                                ? "text-white border-t-[1px] border-white"
                                : "text-[rgb(143,141,141)]"
                        } pt-3 cursor-pointer flex justify-center items-center gap-2`
                    }
                >
                    <InstagramTaggedIcon />
                    TAGGED
                </NavLink>
            </div>
        </div>
    );
};

export default ProfileBottomSection;
