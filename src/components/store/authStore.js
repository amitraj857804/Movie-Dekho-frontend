import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("JWT_TOKEN") 
        ? JSON.parse(localStorage.getItem("JWT_TOKEN"))
        : null
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
        }
    }
});

 const authStore = configureStore({
    reducer: {
        auth: tokenSlice.reducer
    }
});

export const { setToken, clearToken } = tokenSlice.actions;

export const selectToken = (state) => state.auth.token;

export default authStore

