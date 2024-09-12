import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/MyContext";
import { InstagramCrossIcon } from "../InstagramIcons/InstagramIcons";
import { toast } from "react-toastify";
import axios from "axios";

const CreatePostDialogBox = () => {
    const { newPostDialogBox, setNewPostDialogBox } = useContext(MyContext);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [activeBtn, setActiveBtn] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.info("Please wait, your post will be uploaded in short time");
        try {
            if (selectedFiles.length >= 1) {
                const formData = new FormData();
                formData.append("posts", selectedFiles);
                setNewPostDialogBox(false);
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/posts/create`,
                    formData,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                console.log("res");

                if (res.status === 201) {
                    toast.success("Your post has been successfully uploaded");
                }
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedFiles.length > 0) {
            setActiveBtn(true);
        } else {
            setActiveBtn(false);
        }
    }, [selectedFiles]);

    return (
        <>
            <div className="new-post text-white bg-[rgb(40,39,39)] flex flex-col w-[500px] items-center justify-center rounded-lg relative z-50 py-[20px]">
                <div
                    className="absolute right-3 top-[14px] cursor-pointer"
                    onClick={() => {
                        setNewPostDialogBox(false);
                    }}
                >
                    <InstagramCrossIcon />
                </div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                        className="py-[8px] px-4 w-[100%] text-center appearance-none flex-grow bg-transparent focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[rgb(54,54,54)] file:text-[rgb(104,101,101)] cursor-pointer"
                    />

                    <div className="btn w-full p-3">
                        {!loading ? (
                            <button
                                type="submit"
                                className={`p-2 rounded-lg w-full ${
                                    activeBtn
                                        ? "bg-[rgb(0,149,246)] hover:bg-[rgb(0,120,255)]"
                                        : "bg-[rgba(91,141,250,0.54)] text-[rgb(142,139,139)]"
                                }`}
                                disabled={!activeBtn}
                            >
                                Post
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
        </>
    );
};

export default CreatePostDialogBox;
