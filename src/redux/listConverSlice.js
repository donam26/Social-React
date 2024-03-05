import { createSlice } from "@reduxjs/toolkit";

const listConverSlice = createSlice({
    name: 'listConverSlice',
    initialState: {
        conversations: []
    },
    reducers: {
        setListConversation : (state, action) => {
            state.conversations = action.payload
        },
        addConversation : (state, action) => {
            state.conversations = [action.payload, ...state.conversations]
        },
    },
});

export default listConverSlice.reducer;
export const { setListConversation, addConversation } = listConverSlice.actions;