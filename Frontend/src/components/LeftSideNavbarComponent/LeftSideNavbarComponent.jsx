import React, { useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SideNavbarIcon from "../SideNavbarIcon/SideNavbarIcon";
import {
    InstagramActiveHome,
    InstagramSVG,
    InstagramHome,
    InstagramActiveExplore,
    InstagramActiveMessage,
    InstagramActiveMore,
    InstagramActiveNotification,
    InstagramActiveReels,
    InstagramActiveSearch,
    InstagramCreatePost,
    InstagramExplore,
    InstagramMessage,
    InstagramMore,
    InstagramNotification,
    InstagramReels,
    InstagramSearch,
    InstagramLogo,
} from "../InstagramIcons/InstagramIcons";
import SettingDialogBox from "../DialogBoxes/SettingDialogBox";

const LeftSideNavbarComponent = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const dialogRef = useRef();
    const [dialog, setDialog] = useState(false);

    const { user } = useSelector((state) => state.user);

    const icons = [
        {
            name: "Home",
            to: "",
            icon: InstagramHome,
            hoverIcon: InstagramActiveHome,
        },
        {
            name: "Explore",
            to: "explore",
            icon: InstagramSearch,
            hoverIcon: InstagramActiveSearch,
        },
        {
            name: "Reels",
            to: "reels",
            icon: InstagramReels,
            hoverIcon: InstagramActiveReels,
        },
        {
            name: "Messages",
            to: "messages",
            icon: InstagramMessage,
            hoverIcon: InstagramActiveMessage,
        },
        {
            name: "Notifications",
            to: "notifications",
            icon: InstagramNotification,
            hoverIcon: InstagramActiveNotification,
        },
        {
            name: "Create",
            to: "create",
            icon: InstagramCreatePost,
            hoverIcon: InstagramCreatePost,
        },
        {
            name: "Profile",
            to: user.username,
            icon: "",
            hoverIcon: "",
            image: user.profile_img,
        },
    ];

    const mobileIcons = [
        {
            name: "Home",
            to: "",
            icon: InstagramHome,
            hoverIcon: InstagramActiveHome,
        },
        {
            name: "Explore",
            to: "explore",
            icon: InstagramSearch,
            hoverIcon: InstagramActiveSearch,
        },
        {
            name: "Reels",
            to: "reels",
            icon: InstagramReels,
            hoverIcon: InstagramActiveReels,
        },
        {
            name: "Messages",
            to: "messages",
            icon: InstagramMessage,
            hoverIcon: InstagramActiveMessage,
        },
        {
            name: "Profile",
            to: user.username,
            icon: "",
            hoverIcon: "",
            image: user.profile_img,
        },
    ];

    const handleDialog = () => {
        if (!dialog) {
            dialogRef.current.show();
            setDialog(true);
        } else {
            dialogRef.current.close();
            setDialog(false);
        }
    };

    return (
        <>
            <div className="leftSideNavbar bg-black border-[rgb(54,54,54)] flex-col h-dvh fixed left-0 top-0 items-center border-r-[0.4px] min-w-0 pt-10 hidden md:flex z-10">
                {!currentPath.includes("/messages") && (
                    <>
                        <div className="instaSVG w-full hidden justify-center min-[1200px]:flex text-white">
                            <InstagramSVG />
                        </div>
                    </>
                )}
                <div
                    className={`instaLogo flex justify-start ${
                        !currentPath.includes("/messages")
                            ? "min-[1200px]:hidden"
                            : ""
                    }`}
                >
                    <InstagramLogo />
                </div>
                <div className="navlinks grid place-items-start max-[1200px]:place-items-center min-[1200px]:w-full mt-11">
                    {icons.map((ni) => (
                        <NavLink
                            key={ni.name}
                            to={`/${ni.to}`}
                            className="grid min-w-[60px] h-[50px] place-items-center hover:bg-[rgba(52,50,50,0.42)] px-3 space-x-2"
                        >
                            {({ isActive }) => (
                                <SideNavbarIcon
                                    name={
                                        !currentPath.includes("/messages")
                                            ? ni.name
                                            : ""
                                    }
                                    icon={ni.icon}
                                    isActive={
                                        ni.name === "Home"
                                            ? currentPath === "/" ||
                                              currentPath === "/home"
                                            : isActive
                                    }
                                    hoverIcon={ni.hoverIcon}
                                    image={ni.image}
                                />
                            )}
                        </NavLink>
                    ))}
                </div>

                <button
                    className="flex items-center min-w-[60px] h-[50px] w-full max-[767px]:justify-center hover:bg-[rgba(52,50,50,0.42)] px-3"
                    onClick={handleDialog}
                >
                    <dialog ref={dialogRef}>
                        <SettingDialogBox />
                    </dialog>
                    <div className="flex justify-center items-center w-full h-full min-[1200px]:w-[40px]">
                        <InstagramMore />
                    </div>
                    {!currentPath.includes("/messages") && (
                        <>
                            <p className="text-white justify-start hidden min-[1200px]:flex w-[185px] pl-[9px]">
                                More
                            </p>
                        </>
                    )}
                </button>
            </div>
            <div className="bottomNavbar bg-black border-[rgb(37,37,37)] flex fixed left-0 items-center bottom-0 justify-center w-dvw h-[55px] border-t-[1.3px] md:hidden z-10">
                <div className="navlinks flex h-full w-full md:mt-10 justify-center">
                    {mobileIcons.map((ni) => (
                        <NavLink
                            key={ni.name}
                            to={`/${ni.to}`}
                            className="w-full flex justify-center"
                        >
                            {({ isActive }) => (
                                <SideNavbarIcon
                                    name={ni.name}
                                    icon={ni.icon}
                                    isActive={
                                        ni.name === "Home"
                                            ? currentPath === "/" ||
                                              currentPath === "/home"
                                            : isActive
                                    }
                                    hoverIcon={ni.hoverIcon}
                                    image={ni.image}
                                />
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
};

export default LeftSideNavbarComponent;
