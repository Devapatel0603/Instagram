import React, { useContext, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    InstagramBell,
    InstagramLock,
    InstagramLogout,
    InstagramMessager,
    InstagramSaved,
} from "../components/InstagramIcons/InstagramIcons";
import { useSelector } from "react-redux";
import { MyContext } from "../context/MyContext";
import Loading from "../components/Loaders/Loading";

const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const privacyRef = useRef(null);

    const { handleLogout, handlePrivacy } = useContext(MyContext);

    const { user } = useSelector((state) => state.user);

    const showPrivacyDialog = () => {
        if (privacyRef.current) {
            privacyRef.current.showModal();
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="settings pt-[50px] md:pl-[85px] md:pt-6 min-[1200px]:pl-[270px] text-white h-dvh">
                    <h1 className="text-center text-[24px] font-bold">
                        Settings and Activity
                    </h1>
                    <div className="allSettings">
                        <div className="setting w-full pt-2 duration-[0.1s] px-2 flex">
                            <NavLink
                                to={`../${user?.username}/saved`}
                                className="hover:bg-[rgb(46,46,46)] flex w-full rounded-lg px-2"
                            >
                                <div className="icon py-2">
                                    <InstagramSaved />
                                </div>
                                <div className="text py-2 pl-4">Saved</div>
                            </NavLink>
                        </div>
                        <div className="setting w-full pt-2 duration-[0.1s] px-2 flex">
                            <NavLink
                                to={`../messages`}
                                className="hover:bg-[rgb(46,46,46)] flex w-full rounded-lg px-2"
                            >
                                <div className="icon py-2">
                                    <InstagramMessager />
                                </div>
                                <div className="text py-2 pl-4">Messages</div>
                            </NavLink>
                        </div>
                        <div className="setting w-full pt-2 duration-[0.1s] px-2 flex">
                            <NavLink
                                to={`../notifications`}
                                className="hover:bg-[rgb(46,46,46)] flex w-full rounded-lg px-2"
                            >
                                <div className="icon py-2">
                                    <InstagramBell />
                                </div>
                                <div className="text py-2 pl-4">
                                    Notifications
                                </div>
                            </NavLink>
                        </div>
                        <div className="setting w-full pt-2 duration-[0.1s] px-2 flex cursor-pointer">
                            <div
                                className="hover:bg-[rgb(46,46,46)] flex w-full rounded-lg px-2"
                                onClick={showPrivacyDialog}
                            >
                                <div className="icon py-2">
                                    <InstagramLock />
                                </div>
                                <div className="text py-2 pl-4">
                                    Privacy (Currently{" "}
                                    {user?.is_private_account
                                        ? "Private"
                                        : "Public"}
                                    )
                                </div>
                            </div>
                        </div>
                        <dialog
                            ref={privacyRef}
                            className="fixed h-dvh w-dvw top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[rgba(0,0,0,0.37)] text-white border-0 border-none"
                            onClick={() => {
                                privacyRef.current.close();
                            }}
                        >
                            <div className="bg-[rgb(33,33,33)] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] py-3 px-3 text-[19px] rounded-lg">
                                <div
                                    className="text-center cursor-pointer hover:bg-[rgb(46,46,46)] w-full px-36 rounded-lg py-2 mb-2"
                                    onClick={() => handlePrivacy("public")}
                                >
                                    public
                                </div>
                                <div
                                    className="text-center cursor-pointer hover:bg-[rgb(46,46,46)] w-full rounded-lg py-2"
                                    onClick={() => handlePrivacy("private")}
                                >
                                    private
                                </div>
                            </div>
                        </dialog>
                        <div className="setting w-full pt-2 duration-[0.1s] px-2 flex cursor-pointer">
                            <div
                                className="hover:bg-[rgb(46,46,46)] flex w-full rounded-lg px-2"
                                onClick={() =>
                                    handleLogout(navigate, setLoading)
                                }
                            >
                                <div className="icon py-2">
                                    <InstagramLogout />
                                </div>
                                <div className="text py-2 pl-4">Logout</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Settings;
