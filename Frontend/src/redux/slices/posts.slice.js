import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        page: 1,
        followingPosts: [],
        currentUserPosts: [],
        userPosts: [],
        noOfLikes: {},
        savedPosts: [],
        infiniteScrollLoading: false,
    },
    reducers: {
        //For posts
        setPosts: (state, action) => {
            state.posts = state.posts.concat(action.payload);
        },

        //Page for fetching posts
        setPage: (state, action) => {
            state.page = action.payload;
        },

        //For followingPosts
        setFollowingPosts: (state, action) => {
            state.followingPosts = action.payload;
        },

        //Set infinite scroll loading
        setInfiniteScrollLoading: (state, action) => {
            state.followingPosts = action.payload;
        },

        //For current user posts
        setCurrentUserPosts: (state, action) => {
            state.currentUserPosts = action.payload;
        },

        //For userPosts
        setUserPosts: (state, action) => {
            state.userPosts = action.payload;
        },

        //For noOfLikes
        setNoOfLikes: (state, action) => {
            state.noOfLikes = { ...state.noOfLikes, ...action.payload };
        },

        //For savedPosts
        setSavedPosts: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.savedPosts = state.savedPosts.concat(action.payload);
            } else {
                state.savedPosts.push(action.payload);
            }
        },
        removeSavedPosts: (state, action) => {
            state.savedPosts = state.savedPosts.filter(
                (_id) => _id.toString() !== action.payload.toString()
            );
        },
    },
});

export const {
    setPosts,
    setPage,
    setFollowingPosts,
    setInfiniteScrollLoading,
    setNoOfLikes,
    setCurrentUserPosts,
    setUserPosts,
    setSavedPosts,
    removeSavedPosts,
} = postsSlice.actions;
export default postsSlice.reducer;
