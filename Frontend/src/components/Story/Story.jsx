import React from "react";
import profileImage from "../../assets/imga.jpeg";
import Image from "../Image/Image";

const Story = () => {
    const stories = [
        {
            id: 1,
            image: "https://firebasestorage.googleapis.com/v0/b/instagram-ui-dev-patel.appspot.com/o/66574e38929e641ad86893f6-LNM%20(2).jpg?alt=media&token=69e4bb3a-c807-45f7-97f1-5cc3502eb976",
        },
        { id: 2, image: "./src/assets/img8.jpg" },
        {
            id: 3,
            image: "./src/assets/img2.jpg",
        },
        {
            id: 4,
            image: "./src/assets/img4.jpg",
        },
        {
            id: 5,
            image: "./src/assets/img5.jpg",
        },
        {
            id: 6,
            image: "./src/assets/img6.jpg",
        },
        {
            id: 7,
            image: "./src/assets/img7.webp",
        },
        {
            id: 8,
            image: "./src/assets/ai.jpg!bw700",
        },

        {
            id: 11,
            image: "./src/assets/img8.jpg",
        },
        {
            id: 13,
            image: "./src/assets/img9.avif",
        },
        { id: 14, image: "https://wallpapercave.com/wp/wp12520106.jpg" },
    ];

    return (
        <div className="storyComponent w-full sm:w-[97.5%] h-full flex overflow-x-auto overflow-y-hidden py-2 snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-4 px-4">
                {stories.map((story) => (
                    <div key={story.id} className="flex-shrink-0 snap-start">
                        <Image
                            image={story.image}
                            alt="Profile Image"
                            addClasses="storyImage rounded-full h-[60px] w-[60px] p-[2px] cursor-pointer object-cover"
                            border={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Story;
