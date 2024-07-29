import React from "react";
import { useSelector } from "react-redux";
import Image from "../Image/Image";

const OtherNotifications = () => {
    const { notifications } = useSelector((state) => state.user);
    // const notifications = [
    //     {
    //         _id: "60974686c27d0800005b27c3",
    //         user: {
    //             _id: "60974686c27d0800005b27c2",
    //             username: "johndoe",
    //             profile_img:
    //                 "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //         },
    //         text: "added you as a friend",
    //         timestamp: "2022-05-02T13:45:10.848Z",
    //         isRead: true,
    //     },
    //     {
    //         _id: "60974686c27d0800005b27c4",
    //         user: {
    //             _id: "60974686c27d0800005b27c2",
    //             username: "johndoe",
    //             profile_img:
    //                 "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //         },
    //         text: "added you as a friend",
    //         timestamp: "2022-05-02T13:45:10.848Z",
    //         isRead: true,
    //     },
    // ];

    return (
        <>
            <div className="other-notifications w-[70%] md:max-w-[670px] max-[768px]:w-full flex justify-between">
                <div className="all-notification w-full">
                    {notifications &&
                        notifications.length > 0 &&
                        notifications.map((notification) => (
                            <div
                                className="notification w-full flex justify-between py-3 px-16"
                                key={notification?._id}
                            >
                                <div className="w-full flex gap-5">
                                    <div className="image-notification flex h-full items-center">
                                        <div className="image">
                                            <Image
                                                addClasses="w-[40px] h-[40px]"
                                                image={
                                                    notification
                                                        ?.notificationUser
                                                        .profile_img
                                                }
                                                alt="Profile Pic"
                                            />
                                        </div>
                                    </div>
                                    <div className="notification-content flex items-center">
                                        <strong className="username">
                                            {
                                                notification.notificationUser
                                                    .username
                                            }
                                            &nbsp;
                                        </strong>
                                        <div className="notification-text">
                                            {notification?.text}
                                        </div>
                                    </div>
                                </div>
                                {notification?.post &&
                                    notification.post.urls.length > 0 && (
                                        <Image
                                            addClasses="w-[40px] h-[40px]"
                                            image={notification?.post.urls[0]}
                                            alt="Post"
                                        />
                                    )}
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default OtherNotifications;
