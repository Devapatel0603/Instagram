import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Image from "../Image/Image";
import { useSelector } from "react-redux";

const SideNavbarIcon = ({
    name,
    icon: IconComponent = null,
    isActive,
    hoverIcon: HoverIconComponent = null,
    image = null,
}) => {
    const RenderIconComponent = isActive ? HoverIconComponent : IconComponent;

    const { notifications } = useSelector((state) => state.user);

    useEffect(() => {
        if (name.toLowerCase() === "notifications") {
            const unreadNotifications = notifications.filter(
                (not) => !not.read
            ).length;
        }
    }, []);

    return (
        <div className="flex items-start space-x-2 w-full justify-center">
            <div className="flex justify-center items-center w-full h-full min-[1200px]:w-[40px]">
                {image ? (
                    <Image
                        image={image}
                        alt="Profile Image"
                        addClasses="h-[36px] w-[36px] md:h-6 md:w-6"
                    />
                ) : (
                    RenderIconComponent && <RenderIconComponent />
                )}
            </div>
            {name && (
                <p
                    className={`text-white w-[185px] justify-start hidden min-[1200px]:flex ${
                        isActive ? "font-extrabold" : ""
                    }`}
                >
                    {name}
                </p>
            )}
        </div>
    );
};

SideNavbarIcon.propTypes = {
    name: PropTypes.string,
    icon: PropTypes.elementType,
    isActive: PropTypes.bool.isRequired,
    hoverIcon: PropTypes.elementType,
    image: PropTypes.string,
};

export default SideNavbarIcon;
