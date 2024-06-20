import React, { useState, useContext } from "react";
import Image from "../Image/Image";
import { useNavigate } from "react-router-dom";
import { InstagramCrossIcon } from "../InstagramIcons/InstagramIcons";
import axios from "axios";
import { MyContext } from "../../context/MyContext";
import { useSelector, useDispatch } from "react-redux";
import { setIsChatCreated } from "../../redux/slices/chat.slice";
import { toast } from "react-toastify";

const NewMessageDialogBox = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const chatCreated = useSelector((state) => state.chat.isChatCreated);

    const { setDialogBox } = useContext(MyContext);

    const [usernameSearch, setUsernameSearch] = useState("");
    const [activeBtn, setActiveBtn] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedNames, setSelectedNames] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [groupImg, setGroupImg] = useState(null);
    const [loading, setLoading] = useState(false);

    const nullifyAllFields = () => {
        setGroupName("");
        setUsernameSearch("");
        setProfiles([]);
        setSelectedIds([]);
        setSelectedNames([]);
        setDialogBox(false);
    };

    const handleInput = async (e) => {
        setUsernameSearch(e.target.value);
        try {
            if (e.target.value !== "") {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/users?search=${
                        e.target.value
                    }`,
                    { withCredentials: true }
                );
                if (res.status === 200) {
                    setProfiles(res.data.data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.info("Please wait");
        setLoading(true);
        try {
            if (selectedIds.length > 1) {
                const formData = new FormData();
                formData.append("groupName", groupName);
                formData.append("groupImg", groupImg);
                formData.append("users", JSON.stringify(selectedIds));

                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/chats/create/group`,
                    formData,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (res.status === 201) {
                    navigate(`/messages/${res.data?.data?._id}`);
                    dispatch(setIsChatCreated(!chatCreated));
                    nullifyAllFields();
                }
            } else if (selectedIds.length === 1) {
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/chats/create/chat`,
                    { _id: selectedIds[0] },
                    { withCredentials: true }
                );
                if (res.status === 201 || res.status === 200) {
                    navigate(`/messages/${res.data?.data?._id}`);
                    dispatch(setIsChatCreated((prev) => !prev));
                    nullifyAllFields();
                }
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleSelectedInput = (e, _id, _name) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedIds((prev) => [...prev, _id]);
            setSelectedNames((prev) => [...prev, _name]);
        } else {
            setSelectedIds((prev) => prev.filter((id) => id !== _id));
            setSelectedNames((prev) => prev.filter((name) => name !== _name));
        }

        setActiveBtn(selectedIds.length + 1 >= 1);
    };

    return (
        <div className="text-white bg-[rgb(40,39,39)] flex flex-col w-[500px] items-center justify-center rounded-lg relative z-50">
            <div className="w-full relative">
                <div
                    className="absolute right-3 top-[14px] cursor-pointer"
                    onClick={nullifyAllFields}
                >
                    <InstagramCrossIcon />
                </div>
                <h3 className="border-b-[1px] border-[rgb(54,54,54)] py-[10px] w-full text-center">
                    New message
                </h3>
            </div>
            <form
                method="get"
                className="w-full"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                {selectedIds.length > 1 && (
                    <div className="border-b-[1px] border-[rgb(54,54,54)] w-full">
                        <input
                            type="text"
                            name="groupName"
                            id="groupName"
                            className="py-[8px] px-4 w-[50%] text-center appearance-none flex-grow bg-transparent focus:outline-none"
                            placeholder="Enter group name"
                            value={groupName}
                            onInput={(e) => {
                                setGroupName(e.target.value);
                            }}
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            name="groupName"
                            id="groupName"
                            className="py-[8px] px-4 w-[50%] text-center appearance-none flex-grow bg-transparent focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[rgb(54,54,54)] file:text-[rgb(104,101,101)]"
                            placeholder="Enter group name"
                            onChange={(e) => {
                                setGroupImg(e.target.files[0]);
                            }}
                        />
                    </div>
                )}

                <div className="to flex gap-3 py-[10px] justify-start w-full border-b-[1px] border-[rgb(54,54,54)] px-3 overflow-x-auto scrollbar-hide flex-wrap">
                    <div className="flex items-center">
                        <h2 className="mr-2">To:</h2>
                        <div className="flex flex-wrap gap-1 overflow-y-auto max-h-full">
                            {selectedNames.map((name, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg flex bg-black text-[12px] p-1 items-center gap-[2px]"
                                >
                                    {name}
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => {
                                            const index =
                                                selectedNames.indexOf(name);
                                            setSelectedIds(
                                                selectedIds.filter(
                                                    (_id) =>
                                                        _id !==
                                                        selectedIds[index]
                                                )
                                            );
                                            setSelectedNames(
                                                selectedNames.filter(
                                                    (_name) =>
                                                        _name !==
                                                        selectedNames[index]
                                                )
                                            );
                                        }}
                                    >
                                        <InstagramCrossIcon height={true} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <input
                        type="text"
                        name="username_search"
                        id="username_search"
                        className="appearance-none flex-grow bg-transparent focus:outline-none text-white w-[100px]"
                        placeholder="Search..."
                        value={usernameSearch}
                        onChange={handleInput}
                    />
                </div>

                <div className="output min-h-[220px] max-h-[280px] overflow-auto scrollbar-hide">
                    {profiles.map((profile) => (
                        <div
                            key={profile._id}
                            className="profile w-full flex justify-between items-center pl-[3px] pr-[19px] py-2"
                        >
                            <div className="w-full flex gap-[6px] items-center">
                                <Image
                                    image={profile.profile_img}
                                    addClasses="h-[56px] w-[56px] bg-[rgb(40,39,39)] rounded-full"
                                />
                                <div className="username-name text-[14px] flex justify-center items-start flex-col">
                                    <div className="name">{profile.name}</div>
                                    <div className="username text-[rgb(143,141,141)]">
                                        {profile.username}
                                    </div>
                                </div>
                            </div>
                            <div className="select">
                                <label className="flex items-center">
                                    <div className="checkbox-wrapper-12">
                                        <div className="cbx">
                                            <input
                                                id={`cbx-${profile._id}`}
                                                type="checkbox"
                                                onChange={(e) =>
                                                    handleSelectedInput(
                                                        e,
                                                        profile._id,
                                                        profile.username
                                                    )
                                                }
                                                checked={selectedIds.includes(
                                                    profile._id
                                                )}
                                            />
                                            <label
                                                htmlFor={`cbx-${profile._id}`}
                                            ></label>
                                            <svg
                                                width="15"
                                                height="14"
                                                viewBox="0 0 15 14"
                                                fill="none"
                                            >
                                                <path d="M2 8.36364L6.23077 12L13 2"></path>
                                            </svg>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            version="1.1"
                                        >
                                            <defs>
                                                <filter id="goo-12">
                                                    <feGaussianBlur
                                                        in="SourceGraphic"
                                                        stdDeviation="4"
                                                        result="blur"
                                                    ></feGaussianBlur>
                                                    <feColorMatrix
                                                        in="blur"
                                                        mode="matrix"
                                                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                                                        result="goo-12"
                                                    ></feColorMatrix>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="goo-12"
                                                    ></feBlend>
                                                </filter>
                                            </defs>
                                        </svg>
                                    </div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="btn w-full p-3">
                    {!loading ? (
                        <button
                            type="submit"
                            className={`p-2 rounded-lg w-full ${
                                activeBtn
                                    ? "bg-[rgb(0,149,246)] hover:bg-[rgb(0,120,255)]"
                                    : "bg-[rgba(87,188,255,0.54)] text-[rgb(142,139,139)]"
                            }`}
                            disabled={!activeBtn}
                        >
                            Chat
                        </button>
                    ) : (
                        <div className="flex items-center justify-center hover:bg-[rgb(0,120,255)">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                                <div className="absolute top-0 left-0 h-10 w-10 rounded-full border-t-8 border-b-8 border-[rgb(0,120,255)] animate-spin"></div>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default NewMessageDialogBox;
