import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { clearToken } from "./authSlice"; // Import the logout action

// Async thunk for fetching user's favorite movies
export const fetchFavoriteMovies = createAsyncThunk(
    'favorites/fetchFavoriteMovies',
    async (_, { getState, rejectWithValue, dispatch }) => {
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
            // Handle 403 Forbidden - token might be expired
            if (error.response?.status === 403) {
                console.log('403 Forbidden - Token might be expired, clearing auth state');
                dispatch(clearToken());
                return rejectWithValue('Authentication expired. Please login again.');
            }
            
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
    async ({ movieId, movieData }, { getState, rejectWithValue, dispatch }) => {
        try {
            const state = getState();
            const token = state.auth.token;

            if (!token) {
                throw new Error('No token available');
            }

            const response = await api.post(`/api/user/favorites/${movieId}`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            return { movieId, movieData, message: response.data };
        } catch (error) {
            // Handle 403 Forbidden - token might be expired
            if (error.response?.status === 403) {
                console.log('403 Forbidden - Token might be expired, clearing auth state');
                dispatch(clearToken());
                return rejectWithValue('Authentication expired. Please login again.');
            }
            
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
    async (movieId, { getState, rejectWithValue, dispatch }) => {
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
            // Handle 403 Forbidden - token might be expired
            if (error.response?.status === 403) {
                console.log('403 Forbidden - Token might be expired, clearing auth state');
                dispatch(clearToken());
                return rejectWithValue('Authentication expired. Please login again.');
            }
            
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
    hasFetched: false, // Track if we've successfully fetched favorites for current session
    movieLoadingStates: {}, // Track loading state for individual movies
}

export const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        clearFavorites: (state) => {
            state.favoriteMovies = [];
            state.favoriteMovieIds = [];
            state.error = null;
            state.hasFetched = false; // Reset fetch status when clearing
            state.movieLoadingStates = {}; // Clear individual loading states
        },
        clearFavoritesError: (state) => {
            state.error = null;
        },
        // Force refetch favorites (useful when you want to refresh data)
        forceRefetchFavorites: (state) => {
            state.hasFetched = false;
        },
        // Clear loading state for a specific movie (useful for error handling)
        clearMovieLoadingState: (state, action) => {
            const movieId = action.payload;
            state.movieLoadingStates[movieId] = false;
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
                state.hasFetched = true; // Mark as successfully fetched
            })
            .addCase(fetchFavoriteMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add to favorites
            .addCase(addToFavorites.pending, (state, action) => {
                state.actionLoading = true;
                state.error = null;
                const { movieId } = action.meta.arg;
                state.movieLoadingStates[movieId] = true;
            })
            .addCase(addToFavorites.fulfilled, (state, action) => {
                state.actionLoading = false;
                const { movieId, movieData } = action.payload;
                state.movieLoadingStates[movieId] = false;
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
                const { movieId } = action.meta.arg;
                state.movieLoadingStates[movieId] = false;
            })
            
            // Remove from favorites
            .addCase(removeFromFavorites.pending, (state, action) => {
                state.actionLoading = true;
                state.error = null;
                const movieId = action.meta.arg;
                state.movieLoadingStates[movieId] = true;
            })
            .addCase(removeFromFavorites.fulfilled, (state, action) => {
                state.actionLoading = false;
                const { movieId } = action.payload;
                state.movieLoadingStates[movieId] = false;
                state.favoriteMovieIds = state.favoriteMovieIds.filter(id => id !== movieId);
                state.favoriteMovies = state.favoriteMovies.filter(movie => movie.id !== movieId);
            })
            .addCase(removeFromFavorites.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
                const movieId = action.meta.arg;
                state.movieLoadingStates[movieId] = false;
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
                state.hasFetched = false; // Reset fetch status on logout
                state.movieLoadingStates = {}; // Clear individual loading states
            });
    }
});

export const { clearFavorites, clearFavoritesError, forceRefetchFavorites, clearMovieLoadingState } = favoritesSlice.actions;

// Selectors
export const selectFavoriteMovies = (state) => state.favorites.favoriteMovies;
export const selectFavoriteMovieIds = (state) => state.favorites.favoriteMovieIds;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesActionLoading = (state) => state.favorites.actionLoading;
export const selectFavoritesError = (state) => state.favorites.error;
export const selectHasFetchedFavorites = (state) => state.favorites.hasFetched;

// Helper selector to check if a movie is favorite
export const selectIsMovieFavorite = (movieId) => (state) => 
    state.favorites.favoriteMovieIds.includes(movieId);

// Helper selector to check if a specific movie is loading
export const selectMovieLoadingState = (movieId) => (state) => 
    state.favorites.movieLoadingStates[movieId] || false;

export default favoritesSlice.reducer;
