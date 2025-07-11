import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("JWT_TOKEN") 
        ? JSON.parse(localStorage.getItem("JWT_TOKEN"))
        : null,
    previousPage: null, // Track the previous page
    navigationContext: {
        fromPage: null,    // Which page user came from
        pageState: null,   // Any state from that page (like otpSent, etc.)
        isDirectEntry: true // Whether user entered directly or navigated from another auth page
    }
}

export const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            
            if (action.payload) {
                localStorage.setItem("JWT_TOKEN", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("JWT_TOKEN");
            }
        },
        clearToken: (state) => {
            state.token = null;
            localStorage.removeItem("JWT_TOKEN");
        },
        setPreviousPage: (state, action) => {
            state.previousPage = action.payload;
        },
        clearPreviousPage: (state) => {
            state.previousPage = null;
        },
        setNavigationContext: (state, action) => {
            state.navigationContext = {
                ...state.navigationContext,
                ...action.payload
            };
        },
        clearNavigationContext: (state) => {
            state.navigationContext = {
                fromPage: null,
                pageState: null,
                isDirectEntry: true
            };
        },
    }
});

 const authStore = configureStore({
    reducer: {
        auth: tokenSlice.reducer
    }
});

export const { 
    setToken, 
    clearToken, 
    setPreviousPage, 
    clearPreviousPage, 
    setNavigationContext, 
    clearNavigationContext 
} = tokenSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectPreviousPage = (state) => state.auth.previousPage;
export const selectNavigationContext = (state) => state.auth.navigationContext;

export default authStore

