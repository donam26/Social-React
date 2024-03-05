import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null
        }
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.login.currentUser = action.payload
        },
        logoutSuccess: (state, action) => {
            state.login.currentUser = null
        },
        updateUser: (state, action) => {
            state.login.currentUser = {
                ...state.login.currentUser,
                ...action.payload,
            };
        },
    } 
});

export const {
    loginSuccess,
    logoutSuccess,
    updateUser
} = authSlice.actions;

export default authSlice.reducer;