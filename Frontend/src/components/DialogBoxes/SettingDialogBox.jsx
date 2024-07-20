import React, { useContext, useState } from "react";
import {
    InstagramLogout,
    InstagramSaved,
    InstagramSetting,
} from "../InstagramIcons/InstagramIcons";
import { MyContext } from "../../context/MyContext";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../Loaders/Loading";

const SettingDialogBox = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const { handleLogout } = useContext(MyContext);
    const { user } = useSelector((state) => state.user);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="setting text-white absolute top-[-180px] left-4 rounded-2xl w-[200px] bg-[rgb(37,37,37)]">
                    <div className="setting w-full pt-2 duration-[0.1s] px-2 flex">
                        <NavLink
                            to="settings"
                            className="hover:bg-[rgb(46,46,46)] flex w-full rounded-lg px-2"
                        >
                            <div className="icon py-2">
                                <InstagramSetting />
                            </div>
                            <div className="text py-2 pl-4">Settings</div>
                        </NavLink>
                    </div>
                    <div className="saved w-full pb-2 duration-[0.1s] px-2 flex">
                        <NavLink
                            to={`${user.username}/saved`}
                            className="hover:bg-[rgb(46,46,46)] flex w-full rounded-lg px-2"
                        >
                            <div className="icon py-2">
                                <InstagramSaved />
                            </div>
                            <div className="text py-2 pl-4">Saved</div>
                        </NavLink>
                    </div>
                    <div className="border-[rgb(135,134,134)] border-t-[1px] w-full py-2 px-2">
                        <div
                            className="hover:bg-[rgb(46,46,46)] flex w-full rounded-lg px-2"
                            onClick={() => handleLogout(navigate, setLoading)}
                        >
                            <div className="icon py-2">
                                <InstagramLogout />
                            </div>
                            <div className="text py-2 pl-4">Log out</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SettingDialogBox;
