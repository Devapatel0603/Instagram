import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chat: {},
        allChats: [],
        isChatCreated: false,
        messages: [],
        messagePage: 1,
        totalPage: 0,
    },
    reducers: {
        //For Single chat details
        setChat: (state, action) => {
            state.chat = action.payload;
        },

        //For multiple chats
        setAllChats: (state, action) => {
            state.allChats = action.payload;
        },

        //When chat created then get all chats again
        setIsChatCreated: (state, action) => {
            state.isChatCreated = action.payload;
        },

        //Set total page
        setTotalPage: (state, action) => {
            state.totalPage = action.payload;
        },

        //add messages
        addMessagesBack: (state, action) => {
            state.messages = [...state.messages, ...action.payload];
        },

        addMessagesFront: (state, action) => {
            state.messages = [...action.payload, ...state.messages];
        },

        setMessages: (state, action) => {
            state.messages = action.payload;
        },

        //Set Message Page
        setMessagePage: (state, action) => {
            state.messagePage = action.payload;
        },
    },
});

export const {
    setChat,
    addMessagesBack,
    addMessagesFront,
    setAllChats,
    setIsChatCreated,
    setTotalPage,
    setMessagePage,
    setMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
// useEffect(() => {
//     socket.on("NEW_MESSAGE_ALERT", async ({ chatId }) => {
//         console.log("DEV PATEL");
//         let latestChat = await allChats.find(
//             (chat) => chat._id.toString() === chatId.toString()
//         );
//         console.log("Dev Patel");

//         let newAllChats = allChats.filter(
//             (chat) => chat._id.toString() !== chatId.toString()
//         );

//         const updatedAllChats = [latestChat, ...newAllChats];

//         dispatch(setAllChats(updatedAllChats));
//     });

//     return () => {
//         socket.off("NEW_MESSAGE_ALERT");
//     };
// }, [messages, socket, dispatch]);
