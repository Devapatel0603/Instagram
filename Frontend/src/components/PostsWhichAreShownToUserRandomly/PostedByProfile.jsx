import React from "react";
import Image from "../Image/Image";
import { InstagramMoreThreeDots } from "../InstagramIcons/InstagramIcons";

const PostedByProfile = ({ username, time, image }) => {
    return (
        <>
            <div className="postedByProfile h-full flex justify-between items-center pr-1 pl-1">
                <div className="postProfileCard flex items-center">
                    <div className="image">
                        <Image
                            image={image}
                            alt="Profile Image"
                            addClasses="w-[35px] h-[35px]"
                        />
                    </div>
                    <div className="usernameTime flex ml-3">
                        {username}
                        <span className="ml-2 mr-1">•</span>
                        {time}
                    </div>
                </div>
                <div className="threeDots cursor-pointer">
                    <InstagramMoreThreeDots />
                </div>
            </div>
        </>
    );
};

export default PostedByProfile;
