import React from "react";
import instaImage from "../../assets/Instagram.png";
import metaTag from "../../assets/Metatag.png";

const StartingLoader = () => {
    return (
        <>
            <div className="start-loader">
                <div className="insta-image w-dvw h-dvh grid place-items-center">
                    <img src={instaImage} width="53" alt="Instagram Image" />
                </div>
                <div className="meta-tag fixed bottom-0 pb-4 flex flex-col items-center w-full justify-center">
                    <div className="from text-[rgba(134,132,132,0.87)] text-[14.7px]">
                        from
                    </div>
                    <div className="meta flex justify-center items-center gap-1">
                        <div className="image">
                            <img src={metaTag} width="25" alt="Meta tag" />
                        </div>
                        <p className="meta-text text-gradient text-[20px] font-bold font-sans">
                            Meta
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StartingLoader;
