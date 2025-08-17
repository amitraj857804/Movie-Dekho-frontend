import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { clearToken } from "./authSlice"; // Import the logout action

// Async thunk for fetching user's favorite movies
export const fetchFavoriteMovies = createAsyncThunk(
    'favorites/fetchFavoriteMovies',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) {
                throw new Error('No token available');
            }

            const response = await api.get("/api/user/favorites", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               error.message || 
                               'Failed to fetch favorites';
            return rejectWithValue(errorMessage);
        }
    }
);

// Async thunk for adding a movie to favorites
export const addToFavorites = createAsyncThunk(
    'favorites/addToFavorites',
    async ({ movieId, movieData }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) {
                throw new Error('No token available');
            }

            const response = await api.post(`/api/user/favorites/${movieId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            return { movieId, movieData, message: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               error.message || 
                               'Failed to add to favorites';
            return rejectWithValue(errorMessage);
        }
    }
);

// Async thunk for removing a movie from favorites
export const removeFromFavorites = createAsyncThunk(
    'favorites/removeFromFavorites',
    async (movieId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) {
                throw new Error('No token available');
            }

            const response = await api.delete(`/api/user/favorites/${movieId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            return { movieId, message: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to remove from favorites';
            return rejectWithValue(errorMessage);
        }
    }
);

export const clearAllFavorites = createAsyncThunk(
    'favorites/clearAllFavorites',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) {
                throw new Error('No token available');
            }

            const response = await api.delete('/api/user/favorites/deleteall', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            return { message: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to clear all favorites';
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    favoriteMovies: [],
    favoriteMovieIds: [], 
    loading: false,
    error: null,
    actionLoading: false,
}

export const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        clearFavorites: (state) => {
            state.favoriteMovies = [];
            state.favoriteMovieIds = [];
            state.error = null;
        },
        clearFavoritesError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavoriteMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavoriteMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.favoriteMovies = action.payload;
                state.favoriteMovieIds = action.payload.map(movie => movie.id);
            })
            .addCase(fetchFavoriteMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add to favorites
            .addCase(addToFavorites.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(addToFavorites.fulfilled, (state, action) => {
                state.actionLoading = false;
                const { movieId, movieData } = action.payload;
                if (!state.favoriteMovieIds.includes(movieId)) {
                    state.favoriteMovieIds.push(movieId);
                    // Add the complete movie object to favoriteMovies array
                    if (movieData) {
                        state.favoriteMovies.push(movieData);
                    }
                }
            })
            .addCase(addToFavorites.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            
            // Remove from favorites
            .addCase(removeFromFavorites.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(removeFromFavorites.fulfilled, (state, action) => {
                state.actionLoading = false;
                const { movieId } = action.payload;
                state.favoriteMovieIds = state.favoriteMovieIds.filter(id => id !== movieId);
                state.favoriteMovies = state.favoriteMovies.filter(movie => movie.id !== movieId);
            })
            .addCase(removeFromFavorites.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            
            // Clear all favorites
            .addCase(clearAllFavorites.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(clearAllFavorites.fulfilled, (state) => {
                state.actionLoading = false;
                state.favoriteMovies = [];
                state.favoriteMovieIds = [];
            })
            .addCase(clearAllFavorites.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            
            // Clear favorites on logout
            .addCase(clearToken, (state) => {
                state.favoriteMovies = [];
                state.favoriteMovieIds = [];
                state.loading = false;
                state.actionLoading = false;
                state.error = null;
            });
    }
});

export const { clearFavorites, clearFavoritesError } = favoritesSlice.actions;

// Selectors
export const selectFavoriteMovies = (state) => state.favorites.favoriteMovies;
export const selectFavoriteMovieIds = (state) => state.favorites.favoriteMovieIds;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesActionLoading = (state) => state.favorites.actionLoading;
export const selectFavoritesError = (state) => state.favorites.error;

// Helper selector to check if a movie is favorite
export const selectIsMovieFavorite = (movieId) => (state) => 
    state.favorites.favoriteMovieIds.includes(movieId);

export default favoritesSlice.reducer;
