import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { clearToken } from "./authSlice";

// Fetch user's profile
export const fetchUserProfile = createAsyncThunk(
    "userProfile/fetchUserProfile",
    async (_, { getState, rejectWithValue, dispatch }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) throw new Error("No token available");

            const response = await api.get("/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            return response.data;
        } catch (error) {
            // Only clear token for 401 (Unauthorized) - token is invalid/expired
            // 403 (Forbidden) means token is valid but user lacks permission
            if (error.response?.status === 401) {
                dispatch(clearToken());
                return rejectWithValue("Authentication expired. Please login again.");
            }

            const errorMessage =
                error.response?.data?.message || error.message || "Failed to fetch profile";
            return rejectWithValue(errorMessage);
        }
    }
);

// Update user's profile
export const updateUserProfile = createAsyncThunk(
    "userProfile/updateUserProfile",
    async (profileData, { getState, rejectWithValue, dispatch }) => {

        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) throw new Error("No token available");

            const response = await api.put("/api/user/profile", profileData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return response.data;
        } catch (error) {
            // Only clear token for 401 (Unauthorized) - token is invalid/expired
            if (error.response?.status === 401) {
                dispatch(clearToken());
                return rejectWithValue("Authentication expired. Please login again.");
            }

            const errorMessage =
                error.response?.data?.message || error.message || "Failed to update profile";
            return rejectWithValue(errorMessage);
        }
    }
);

// Change user's password
export const changeUserPassword = createAsyncThunk(
    "userProfile/changeUserPassword",
    async (passwordData, { getState, rejectWithValue, dispatch }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) throw new Error("No token available");

            const response = await api.put("/api/user/change-password", passwordData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;

        } catch (error) {
            // Only clear token for 401 (Unauthorized) - token is invalid/expired
            if (error.response?.status === 401) {
                dispatch(clearToken());
                return rejectWithValue("Authentication expired. Please login again.");
            }

            // For 400 errors, show the specific validation message from server
            if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message || error.response?.data || "Invalid request data. Please check your current password.";
                return rejectWithValue(errorMessage);
            }

            const errorMessage =
                error.response?.data?.message || error.message || "Failed to change password";
            return rejectWithValue(errorMessage);
        }
    }
);

// Delete user account
export const deleteUserAccount = createAsyncThunk(
    "userProfile/deleteUserAccount",
    async (_, { getState, rejectWithValue, dispatch }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) throw new Error("No token available");

            const response = await api.delete("/api/user/delete", {
                headers: { Authorization: `Bearer ${token}` },
            });

            return response.data;
        } catch (error) {
            // Only clear token for 401 (Unauthorized) - token is invalid/expired
            if (error.response?.status === 401) {
                dispatch(clearToken());
                return rejectWithValue("Authentication expired. Please login again.");
            }

            const errorMessage =
                error.response?.data?.message || error.message || "Failed to delete account";
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    profile: null,
    loading: false,
    updateLoading: false,
    passwordLoading: false,
    deleteLoading: false,
    error: null,
    hasFetched: false, // whether we've fetched profile this session
};

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        // Clear profile data (useful on logout)
        clearUserProfile: (state) => {
            state.profile = null;
            state.loading = false;
            state.updateLoading = false;
            state.passwordLoading = false;
            state.deleteLoading = false;
            state.error = null;
            state.hasFetched = false;
        },
        // Clear only error state
        clearUserProfileError: (state) => {
            state.error = null;
        },
        // Force refetch on next component mount
        invalidateUserProfile: (state) => {
            state.hasFetched = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch User Profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.hasFetched = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Don't set hasFetched to true on error so it retries
            })

            // Update User Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.updateLoading = false;
                // If the response contains the full updated profile, use it
                // Otherwise, merge the update with existing profile
                if (action.payload && typeof action.payload === 'object') {
                    state.profile = action.payload.username ? action.payload : { ...state.profile, ...action.payload };
                }
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })

            // Change Password
            .addCase(changeUserPassword.pending, (state) => {
                state.passwordLoading = true;
                state.error = null;
            })
            .addCase(changeUserPassword.fulfilled, (state) => {
                state.passwordLoading = false;
                state.error = null;
            })
            .addCase(changeUserPassword.rejected, (state, action) => {
                state.passwordLoading = false;
                state.error = action.payload;
            })

            // Delete Account
            .addCase(deleteUserAccount.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteUserAccount.fulfilled, (state) => {
                state.deleteLoading = false;
                state.profile = null;
                state.hasFetched = false;
                state.error = null;
            })
            .addCase(deleteUserAccount.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUserProfile, clearUserProfileError, invalidateUserProfile } =
    userProfileSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.userProfile.profile;
export const selectUserProfileLoading = (state) => state.userProfile.loading;
export const selectUserProfileUpdateLoading = (state) => state.userProfile.updateLoading;
export const selectUserProfilePasswordLoading = (state) => state.userProfile.passwordLoading;
export const selectUserProfileDeleteLoading = (state) => state.userProfile.deleteLoading;
export const selectUserProfileError = (state) => state.userProfile.error;
export const selectHasFetchedUserProfile = (state) => state.userProfile.hasFetched;

export default userProfileSlice.reducer;
