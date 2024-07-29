import React from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ShowFriendRequests from "../components/Notifications/ShowFriendRequests";
import OtherNotifications from "../components/Notifications/OtherNotifications";
import AllFriendRequests from "../components/Notifications/AllFriendRequests";

const Notifications = () => {
    const { followRequests } = useSelector((state) => state.user);

    const [searchParams, setSearchParams] = useSearchParams();

    const handleRequestsClick = () => {
        if (followRequests && followRequests.length > 0) {
            setSearchParams({ followRequests: true });
        }
    };

    const isRequests = searchParams.get("followRequests") === "true";

    return (
        <>
            <div className="notifications h-dvh pt-[50px] max-[768px]:w-full md:ml-[57px] md:pt-2 min-[1200px]:ml-[265px] text-white">
                {!isRequests ? (
                    <>
                        <div
                            className={`friend-requests w-full flex justify-center items-center ${
                                followRequests &&
                                followRequests.length > 0 &&
                                "cursor-pointer"
                            }`}
                            onClick={handleRequestsClick}
                        >
                            <ShowFriendRequests />
                        </div>
                        <div className="w-full flex justify-center items-center">
                            <OtherNotifications />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="friend-requests w-full flex flex-col justify-center items-center mt-3 max-[768px]:pr-2">
                            <AllFriendRequests />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Notifications;
