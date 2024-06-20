import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {},
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
    },
});

export const {
    setUser,
    deleteRequestSent,
    setOtherUser,
    setRequestSent,
    setFollowRequests,
    setSuggetionProfiles,
} = userSlice.actions;
export default userSlice.reducer;
