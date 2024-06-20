import React, { useState, useRef, useEffect } from "react";

const Post = ({ postUrls }) => {
    const [postIndex, setPostIndex] = useState(0);

    const showPrev = () => {
        setPostIndex((index) => {
            if (index === 0) {
                return 0;
            }
            return index - 1;
        });
    };
    const showNext = () => {
        setPostIndex((index) => {
            if (index === postUrls.length - 1) {
                return postUrls.length - 1;
            }
            return index + 1;
        });
    };

    return (
        <>
            {/* <div className="post min-w-0 min-h-0 sm:rounded-lg border-[rgb(54,54,54)] border-[0.4px]">
                <img
                    src={postImage}
                    alt="Post"
                    className="object-contain sm:rounded-lg min-h-[400px]"
                />
            </div> */}

            {/* <div className="grid place-items-center border-[rgb(54,54,54)] border-[0.4px] overflow-hidden w-full max-w-[500px] h-[400px]">
                <div className="w-full h-full relative">
                    <img
                        src={postUrls[postIndex]}
                        alt=""
                        className="absolute top-[50%] left-[50%] w-full h-full object-contain translate-x-[-50%] translate-y-[-50%]"
                    />
                    <button
                        className="absolute top-[50%] translate-y-[-50%] p-[10px] text-white border-none cursor-pointer hover:bg-[rgba(0,0,0,0.5)] left-0"
                        onClick={showPrev}
                    >
                        p
                    </button>
                    <button
                        className="absolute top-[50%] translate-y-[-50%] p-[10px] text-white border-none cursor-pointer hover:bg-[rgba(0,0,0,0.5)] right-0"
                        onClick={showNext}
                    >
                        n
                    </button>
                </div>
            </div> */}

            <div className="grid place-items-center border-[rgb(54,54,54)] border-[0.4px] overflow-hidden w-full max-w-[500px] h-[400px]">
                <div className="w-full h-full relative">
                    <div className="flex items-center h-full">
                        {postUrls.map((url) => (
                            <img
                                src={url}
                                key={url}
                                alt=""
                                className=" w-full h-full object-contain"
                            />
                        ))}
                    </div>
                    <button
                        className="absolute top-[50%] translate-y-[-50%] p-[10px] text-white border-none cursor-pointer hover:bg-[rgba(0,0,0,0.5)] left-0"
                        onClick={showPrev}
                    >
                        p
                    </button>
                    <button
                        className="absolute top-[50%] translate-y-[-50%] p-[10px] text-white border-none cursor-pointer hover:bg-[rgba(0,0,0,0.5)] right-0"
                        onClick={showNext}
                    >
                        n
                    </button>
                </div>
            </div>
        </>
    );
};

export default Post;
