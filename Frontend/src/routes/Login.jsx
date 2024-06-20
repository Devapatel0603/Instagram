import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { InstagramSVG } from "../components/InstagramIcons/InstagramIcons";
import { BiLogoFacebookSquare } from "react-icons/bi";
import { toast } from "react-toastify";

const Login = () => {
    const dispatch = useDispatch();

    const [loginData, setLoginData] = useState({
        emailphoneusername: "",
        password: "",
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/login`,
                loginData,
                { withCredentials: true }
            );
            if (res.status === 200) {
                dispatch(setUser(res.data.data));
                toast.success("Login successful");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className="login py-1 min-h-dvh flex overflow-auto justify-center items-center gap-1 flex-col bg-white">
                <div className="register-container min-h-[0px] w-[380px] px-9 py-[21.4px] flex flex-col gap-3 border-[rgba(212,210,210,0.8)] min-[380px]:border">
                    <div className="before-or w-full flex flex-col gap-4">
                        <InstagramSVG height={true} />
                        <form
                            method="post"
                            className="flex flex-col gap-5"
                            onSubmit={handleSubmit}
                        >
                            <div className="mobile-number-or-email">
                                <input
                                    type="text"
                                    name="emailphoneusername"
                                    id="emailphoneusername"
                                    placeholder="Phone number, username, or email"
                                    className="border-[rgb(217,216,216)] border-[0.3px] w-full py-[5px] pl-[5px]"
                                    value={loginData.emailphoneusername}
                                    onChange={handleInput}
                                />
                            </div>
                            <div className="password">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    className="border-[rgb(217,216,216)] border-[0.3px] w-full py-[5px] pl-[5px]"
                                    value={loginData.password}
                                    onChange={handleInput}
                                />
                            </div>
                            <div className="submit">
                                <button
                                    type="submit"
                                    className="bg-[rgb(0,149,246)] hover:bg-[rgb(0,120,255)] w-full rounded-lg text-white py-[5.1px] font-[600]"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="or flex gap-2 justify-center items-center">
                        <div className="line border-[rgb(205,203,203)] border-[0.1px] h-[0.1px] w-[38%]"></div>
                        <div className="or w-[24%] text-center text-[14px] font-[600] text-[rgb(102,101,101)]">
                            OR
                        </div>
                        <div className="line border-[0.1px] border-[rgb(205,203,203)] h-[0.1px] w-[38%]"></div>
                    </div>

                    <div className="after-or flex items-center flex-col justify-center gap-4">
                        <button className="send-message-btn text-[14px] bg-[rgb(0,149,246)] min-w-0 w-full py-[7px] font-bold rounded-lg hover:bg-[rgb(0,120,255)] flex items-center justify-center gap-2 text-white">
                            <div className="facebook-icon text-xl">
                                <BiLogoFacebookSquare />
                            </div>
                            <p>Log in with Facebook</p>
                        </button>
                        <div className="forgot-password">
                            <NavLink to="/" className="text-[13px]">
                                Forgot Password
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="login-link border-[rgba(212,210,210,0.8)] w-[380px] h-[60px] flex justify-center items-center min-[380px]:border">
                    <NavLink
                        to="/register"
                        className="text-blue-500 text-[14.5px] font-[600]"
                    >
                        Create new account
                    </NavLink>
                </div>
            </div>
        </>
    );
};

export default Login;
