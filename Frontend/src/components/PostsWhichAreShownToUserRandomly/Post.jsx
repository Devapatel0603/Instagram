import React, { useState, useRef } from "react";
import {
    InstagramLeftArrow,
    InstagramRightArrow,
} from "../InstagramIcons/InstagramIcons";

const Post = ({ postUrls, noBorder = false, noNumber = false }) => {
    const [postIndex, setPostIndex] = useState(0);
    const carouselRef = useRef(null);
    const startX = useRef(0);
    const currentX = useRef(0);
    const isDragging = useRef(false);
    const videoRef = useRef(null);

    const onTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
        isDragging.current = true;
    };

    const onTouchMove = (e) => {
        if (!isDragging.current) {
            return;
        }
        currentX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        if (!isDragging.current) {
            return;
        }
        isDragging.current = false;

        const distance = currentX.current - startX.current;

        if (distance > 40 && postIndex > 0) {
            setPostIndex(postIndex - 1);
        } else if (distance < -40 && postIndex < postUrls.length - 1) {
            setPostIndex(postIndex + 1);
        }
    };

    const onMouseStart = (e) => {
        e.preventDefault();
        startX.current = e.clientX;
        isDragging.current = true;
    };

    const onMouseMove = (e) => {
        if (!isDragging.current) {
            return;
        }
        currentX.current = e.clientX;
    };

    const onMouseEnd = (e) => {
        if (!isDragging.current) {
            return;
        }
        isDragging.current = false;

        const distance = currentX.current - startX.current;

        if (distance > 40 && postIndex > 0) {
            setPostIndex(postIndex - 1);
        } else if (distance < -40 && postIndex < postUrls.length - 1) {
            setPostIndex(postIndex + 1);
        }
    };

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

    const handleVideoClick = (e) => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
        }
    };

    const handleVideoHoldStart = (e) => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const handleVideoHoldEnd = (e) => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const renderMedia = (url) => {
        const fileType = url.split(".").pop().toLowerCase();
        if (["mp4", "webm", "ogg"].includes(fileType)) {
            return (
                <video
                    key={url}
                    src={url}
                    className="w-full h-full object-contain"
                    ref={videoRef}
                    onClick={handleVideoClick}
                    onMouseDown={handleVideoHoldStart}
                    onMouseUp={handleVideoHoldEnd}
                    onMouseLeave={handleVideoHoldEnd}
                    onTouchStart={handleVideoHoldStart}
                    onTouchEnd={handleVideoHoldEnd}
                />
            );
        }
        return (
            <img
                src={url}
                alt=""
                key={url}
                className="w-full h-full object-contain"
            />
        );
    };

    return (
        <div
            className={`grid place-items-center border-[rgb(54,54,54)] ${
                !noBorder && "border-[0.4px]"
            } overflow-hidden w-full max-w-[500px] h-[400px]`}
        >
            <div className="w-full h-full relative">
                {!noNumber && (
                    <p className="absolute top-2 right-2 z-10 bg-[rgba(0,0,0,0.68)] px-2 py-1 rounded-xl">
                        {postIndex + 1 + "/" + postUrls.length}
                    </p>
                )}
                <div
                    className="flex items-center h-full w-full"
                    style={{
                        transform: `translateX(${-100 * postIndex}%)`,
                        transition: "transform 200ms ease-in-out",
                    }}
                    ref={carouselRef}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseStart}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseEnd}
                    onMouseLeave={onMouseEnd}
                >
                    {postUrls.map((url) =>
                        postUrls.map((url) => renderMedia(url))
                    )}
                </div>
                {postUrls.length > 1 && (
                    <>
                        {postIndex !== 0 && (
                            <>
                                <button
                                    className="absolute top-1/2 transform -translate-y-1/2 p-2 text-white border-none cursor-pointer bg-opacity-50 hover:bg-opacity-75 left-0"
                                    onClick={showPrev}
                                >
                                    <InstagramRightArrow />
                                </button>
                            </>
                        )}

                        {postIndex !== postUrls.length - 1 && (
                            <>
                                <button
                                    className="absolute top-1/2 transform -translate-y-1/2 p-2 text-white border-none cursor-pointer bg-opacity-50 hover:bg-opacity-75 right-0"
                                    onClick={showNext}
                                >
                                    <InstagramLeftArrow />
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Post;
