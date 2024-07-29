import React from "react";
import { useSelector } from "react-redux";
import Image from "../Image/Image";
import profileImage from "../../assets/imga.jpeg";
import {
    InstagramSetting,
    InstagramPlusSign,
} from "../InstagramIcons/InstagramIcons";
import { NavLink } from "react-router-dom";

const ProfileTopSection = ({ user }) => {
    return (
        <>
            <div className="profile-top-section w-[100%] min-[900px]:w-[80%] border-[rgb(54,54,54)] border-b-[1px] flex items-center flex-col">
                <div className="flex w-[90%] justify-between">
                    <div className="profile-top-section-image-container w-[150px] h-[150px]">
                        <Image
                            image={user?.profile_img}
                            addClasses="w-[150px] h-[150px]"
                        />
                    </div>
                    <div className="profile-description-container flex flex-col gap-4">
                        <div className="username-editprofile-archieves flex md:justify-center items-center">
                            <p className="username mr-5 text-[21px]">
                                {user.username}
                            </p>
                            <button
                                type="button"
                                className="bg-[rgb(66,65,65)] hidden md:block px-3 py-[6px] hover:bg-[rgb(49,48,48)] rounded-lg text-sm font-bold mr-2"
                            >
                                Edit Profile
                            </button>
                            <button
                                type="button"
                                className="bg-[rgb(66,65,65)] hidden md:block px-3 py-[6px] rounded-lg hover:bg-[rgb(49,48,48)] text-sm font-bold mr-2"
                            >
                                View Archive
                            </button>
                            <NavLink
                                to="../settings"
                                className="setting-icon cursor-pointer hidden md:block"
                            >
                                <InstagramSetting />
                            </NavLink>
                        </div>
                        <div className="responsive-btn">
                            <button
                                type="button"
                                className="bg-[rgb(66,65,65)] md:hidden px-3 py-[6px] hover:bg-[rgb(49,48,48)] rounded-lg text-sm font-bold mr-2"
                            >
                                Edit Profile
                            </button>
                            <button
                                type="button"
                                className="bg-[rgb(66,65,65)] md:hidden px-3 py-[6px] rounded-lg hover:bg-[rgb(49,48,48)] text-sm font-bold mr-2"
                            >
                                View Archive
                            </button>
                        </div>
                        <div className="posts-followers-following flex gap-10">
                            <p className="posts">
                                {user.number_of_posts} posts
                            </p>
                            <NavLink to="followers" className="followers">
                                {user.number_of_followers} followers
                            </NavLink>
                            <NavLink className="following">
                                {user.number_of_following} following
                            </NavLink>
                        </div>
                        <p className="name">{user.name}</p>
                        <p className="name">{user?.description}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileTopSection;
