import React from "react";

const Image = ({ image, addClasses, border, alt = "" }) => {
    return (
        <>
            <img
                className={`rounded-full ${addClasses} ${
                    border && "border-2 border-red-500"
                }`}
                src={image}
                alt={alt}
            />
        </>
    );
};

export default Image;
