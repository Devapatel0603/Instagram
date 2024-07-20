import React from "react";
import { NavLink } from "react-router-dom";
import {
    InstagramSVG,
    InstagramNotification,
    InstagramActiveNotification,
    InstagramCreatePost,
    InstagramSetting,
} from "../InstagramIcons/InstagramIcons";
import SideNavbarIcon from "../SideNavbarIcon/SideNavbarIcon";

const Header = () => {
    const icons = [
        {
            name: "Create",
            icon: InstagramCreatePost,
            hoverIcon: "",
        },
        {
            name: "Notifications",
            icon: InstagramNotification,
            hoverIcon: InstagramActiveNotification,
        },
    ];

    return (
        <>
            <div className="header h-[50px] flex items-center pl-4 w-dvw fixed top-0 border-b-[1px] border-[rgb(54,54,54)] md:hidden bg-black">
                <div className="leftHeader instaSVG w-full justify-start flex">
                    <InstagramSVG />
                </div>
                <NavLink to="settings" className="setting fixed top-3 left-4">
                    <InstagramSetting />
                </NavLink>
                <div className="rightHeader flex gap-4 pr-4">
                    {icons.map((ni) => (
                        <NavLink
                            key={ni.name}
                            to={`/${ni.name.toLowerCase()}`}
                            className="w-full"
                        >
                            {({ isActive }) => (
                                <SideNavbarIcon
                                    name={ni.name}
                                    icon={ni.icon}
                                    isActive={isActive}
                                    hoverIcon={ni.hoverIcon}
                                />
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Header;
