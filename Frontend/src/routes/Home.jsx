import React, { useState, useEffect, useRef, useContext } from "react";
import RightSideNavbarComponent from "../components/RightSideNavbarComponents/RightSideNavbarComponent";
import Story from "../components/Story/Story";
import ShowPostsToUsers from "../components/ShowPostsToUsers/ShowPostsToUsers";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setNoOfLikes } from "../redux/slices/posts.slice";
import Loading from "../components/Loaders/Loading";

const Home = () => {
    const { followingPosts, posts, infiniteScrollLoading } = useSelector(
        (state) => state.posts
    );

    const dispatch = useDispatch();

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (followingPosts && followingPosts.length > 0) {
            followingPosts.forEach((e) => {
                dispatch(setNoOfLikes({ [e._id]: e.no_of_likes }));
            });
        }
        if (posts) {
            posts.forEach((e) => {
                dispatch(setNoOfLikes({ [e._id]: e.no_of_likes }));
            });
        }
    }, [posts, followingPosts, dispatch]);

    const currentPage = useSelector((state) => state.posts.page);

    const handleScroll = () => {
        try {
            const { scrollTop, scrollHeight, clientHeight } =
                scrollContainerRef.current;
            if (scrollTop + clientHeight + 50 >= scrollHeight) {
                dispatch(setPage(currentPage + 1));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
            return () => {
                scrollContainer.removeEventListener("scroll", handleScroll);
            };
        }
    }, [scrollContainerRef.current, followingPosts, posts]);

    return (
        <>
            <div className="home flex flex-col h-dvh pt-[50px] md:pl-[85px] md:pt-2 min-[1200px]:pl-64 text-white min-[1200px]:pr-[370px]">
                <div className="rightSidebar fixed right-0 h-dvh min-w-0 top-0">
                    <RightSideNavbarComponent />
                </div>
                <div
                    className="AllPosts scrollbar-hide snap-x snap-mandatory w-full min-h-0 overflow-y-auto"
                    style={{ height: "calc(100vh - 50px)" }}
                    ref={scrollContainerRef}
                >
                    <div className="story border-[rgb(54,54,54)] max-[639px]:border-b-[1.3px] h-[83px] w-full pl-1 sm:pl-4 mb-[6px]">
                        <Story />
                    </div>
                    <div className="posts lg:px-[70px] flex justify-center items-center">
                        <ShowPostsToUsers />
                    </div>
                    {infiniteScrollLoading && <Loading />}
                </div>
            </div>
        </>
    );
};

export default Home;
