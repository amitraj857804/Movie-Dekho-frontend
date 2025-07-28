import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


// Async thunk for fetching username
export const fetchUserName = createAsyncThunk(
    'auth/fetchUserName',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) {
                throw new Error('No token available');
            }

            const response = await api.get("/api/user/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            return response.data.username || response.data;
        } catch (error) {

            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch username';
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    token: localStorage.getItem("JWT_TOKEN")
        ? JSON.parse(localStorage.getItem("JWT_TOKEN"))
        : null,
    userName: null,
    userNameLoading: false,
   
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
            state.userName = null;
            localStorage.removeItem("JWT_TOKEN");
        },
       
        setUserName: (state, action) => {
            state.userName = action.payload;
        },
        clearUserName: (state) => {
            state.userName = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserName.pending, (state) => {
                state.userNameLoading = true;
            })
            .addCase(fetchUserName.fulfilled, (state, action) => {
                state.userNameLoading = false;
                state.userName = action.payload;
            })
            .addCase(fetchUserName.rejected, (state, action) => {
                state.userNameLoading = false;
                state.userName = null;
                console.error('Failed to fetch username:', action.payload);
            });
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
    setUserName,
    clearUserName,
} = tokenSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectUsername = (state) => state.auth.userName;
export const selectUsernameLoading = (state) => state.auth.userNameLoading;

export default authStore

