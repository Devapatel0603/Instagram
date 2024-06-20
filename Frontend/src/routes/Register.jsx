import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { InstagramSVG } from "../components/InstagramIcons/InstagramIcons";
import { BiLogoFacebookSquare } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/user.slice";
import { toast } from "react-toastify";

//Focus border on input change border color

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [registerData, setRegisterData] = useState({
        phoneemail: "",
        fullname: "",
        username: "",
        password: "",
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/register`,
                registerData,
                { withCredentials: true }
            );
            if (res.status == 201) {
                dispatch(setUser(res.data.data));
                navigate("/");
                toast("Login successful");
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="register py-1 min-h-dvh flex overflow-auto justify-center items-center gap-1 flex-col bg-white">
                <div className="register-container min-h-[0px] w-[380px] px-9 py-[21.4px] flex flex-col gap-3 border-[rgba(212,210,210,0.8)] min-[380px]:border">
                    <div className="before-or flex items-center flex-col justify-center gap-4">
                        <InstagramSVG height={true} />
                        <p className="text-[rgb(102,101,101)] font-[600] text-center">
                            Sign up to see photos and videos from your friends.
                        </p>
                        <button className="send-message-btn text-[14px] bg-[rgb(0,149,246)] min-w-0 w-full py-[7px] font-bold rounded-lg hover:bg-[rgb(0,120,255)] flex items-center justify-center gap-2 text-white">
                            <div className="facebook-icon text-xl">
                                <BiLogoFacebookSquare />
                            </div>
                            <p>Log in with Facebook</p>
                        </button>
                    </div>
                    <div className="or flex gap-2 justify-center items-center">
                        <div className="line border-[rgb(205,203,203)] border-[0.1px] h-[0.1px] w-[38%]"></div>
                        <div className="or w-[24%] text-center text-[14px] font-[600] text-[rgb(102,101,101)]">
                            OR
                        </div>
                        <div className="line border-[0.1px] border-[rgb(205,203,203)] h-[0.1px] w-[38%]"></div>
                    </div>
                    <div className="after-or w-full">
                        <form
                            method="post"
                            className="flex flex-col gap-5"
                            onSubmit={handleSubmit}
                        >
                            <div className="mobile-number-or-email">
                                <input
                                    type="text"
                                    name="phoneemail"
                                    id="phoneemail"
                                    placeholder="Mobile Number or Email"
                                    className="border-[rgb(217,216,216)] border-[0.3px] w-full py-[5px] pl-[5px] focus:border-blue-500"
                                    value={registerData.phoneemail}
                                    onChange={handleInput}
                                    required
                                />
                            </div>
                            <div className="full-name">
                                <input
                                    type="text"
                                    name="fullname"
                                    id="fullname"
                                    placeholder="Full Name"
                                    className="border-[rgb(217,216,216)] border-[0.3px] w-full py-[5px] pl-[5px] focus:border-blue-500"
                                    value={registerData.fullname}
                                    onChange={handleInput}
                                    required
                                />
                            </div>
                            <div className="username">
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Username"
                                    className="border-[rgb(217,216,216)] border-[0.3px] w-full py-[5px] pl-[5px] focus:border-blue-500"
                                    value={registerData.username}
                                    onChange={handleInput}
                                    required
                                />
                            </div>
                            <div className="password">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    className="border-[rgb(217,216,216)] border-[0.3px] w-full py-[5px] pl-[5px] focus:border-blue-500"
                                    value={registerData.password}
                                    onChange={handleInput}
                                    required
                                />
                            </div>
                            <div className="submit">
                                {!loading ? (
                                    <button
                                        type="submit"
                                        className="bg-[rgb(0,149,246)] hover:bg-[rgb(0,120,255)] w-full rounded-lg text-white py-[5.1px] font-[600]"
                                    >
                                        Sign Up
                                    </button>
                                ) : (
                                    <div class="flex items-center justify-center hover:bg-[rgb(0,120,255)">
                                        <div class="relative">
                                            <div class="h-10 w-10 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                                            <div class="absolute top-0 left-0 h-10 w-10 rounded-full border-t-8 border-b-8 border-[rgb(0,120,255)] animate-spin"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
                <div className="login-link border-[rgba(212,210,210,0.8)] w-[380px] h-[60px] flex justify-center items-center min-[380px]:border">
                    Have an account? &nbsp;
                    <NavLink to="/" className="text-blue-500">
                        Login
                    </NavLink>
                </div>
            </div>
        </>
    );
};

export default Register;
