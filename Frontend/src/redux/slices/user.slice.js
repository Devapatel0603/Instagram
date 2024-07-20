import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: { followRequests: [] },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },

        setOtherUser: (state, action) => {
            state.otherUser = action.payload;
        },

        setFollowRequests: (state, action) => {
            state.followRequests = action.payload;
        },

        setSuggetionProfiles: (state, action) => {
            state.suggetionProfiles = action.payload;
        },

        setFollowers: (state, action) => {
            state.followers = action.payload;
        },

        setFollowings: (state, action) => {
            state.followings = action.payload;
        },

        setRequestSent: (state, action) => {
            state.requestSent = {
                ...state.requestSent,
                ...action.payload,
            };
        },

        deleteRequestSent: (state, action) => {
            const _id = action.payload;
            const newRequestSent = { ...state.requestSent };
            delete newRequestSent[_id];
            state.requestSent = newRequestSent;
        },

        setNotifications: (state, action) => {
            state.notifications = action.payload;

            state.oldNotificationsCount = state.notifications.filter(
                (notification) => notification.isRead === false
            ).length;

            state.newNotificationsCount = state.notifications.filter(
                (notification) => notification.isRead === false
            ).length;

            state.newNotificationsCount = Math.max(
                0,
                state.newNotificationsCount
            );
        },
    },
});

export const {
    setUser,
    deleteRequestSent,
    setFollowers,
    setFollowings,
    setOtherUser,
    setRequestSent,
    setFollowRequests,
    setSuggetionProfiles,
} = userSlice.actions;
export default userSlice.reducer;
