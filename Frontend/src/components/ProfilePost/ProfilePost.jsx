import React, { useEffect, useState } from "react";
import Loading from "../Loaders/Loading";

const ProfilePost = ({ posts, isPrivate }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [posts, isPrivate]);

    return (
        <>
            <div className="text-white">
                {loading && <Loading />}
                {!loading && posts && posts.length > 0 ? (
                    <>
                        {posts.map((post) => (
                            <>
                                <div>Dev</div>
                            </>
                        ))}
                    </>
                ) : (
                    <>
                        <div className="private">My name is Dev</div>
                    </>
                )}{" "}
            </div>
        </>
    );
};

export default ProfilePost;
