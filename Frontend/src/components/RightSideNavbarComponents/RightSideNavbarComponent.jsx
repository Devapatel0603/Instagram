import React, { useEffect, useContext, useState } from "react";
import { useSelector } from "react-redux";
import ProfileCard from "../ProfileCard/ProfileCard";

const RightSideNavbarComponent = () => {
    const { user, suggetionProfiles } = useSelector((state) => state.user);

    return (
        <>
            <div className="rightSideNavbar hidden min-[1200px]:flex flex-col h-full p-10 pl-14 w-[400px]">
                <div className="profile w-full">
                    <ProfileCard
                        link={`/${user.username}`}
                        user={user}
                        follow="See"
                    />
                </div>
                <div className="suggestion text-white flex justify-between text-sm w-full mt-7">
                    <div className="left text-[rgb(134,133,133)]">
                        Suggested for you
                    </div>
                    <div className="right text-[11px]">See All</div>
                </div>
                <div className="suggestionProfiles w-full flex justify-between items-center flex-col mt-4 gap-4">
                    {suggetionProfiles &&
                        suggetionProfiles.map((profile) => (
                            <ProfileCard
                                key={profile.username}
                                link={`/${profile.username}`}
                                user={profile}
                                follow="follow"
                            />
                        ))}
                </div>
            </div>
        </>
    );
};

export default RightSideNavbarComponent;
