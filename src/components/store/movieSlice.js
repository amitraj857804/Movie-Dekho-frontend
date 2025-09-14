import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { clearToken } from "./authSlice"; // Import the logout action

export const fetchAllMovies = createAsyncThunk(
    'movie/fetchAllMovies',
    async (_, { getState, rejectWithValue }) => {
        try {
            // Fetch all movies with a high limit to ensure we get everything
            const response = await api.get("movies/recent");
            return response.data;
        } catch (error) {
            // Provide more specific error messages based on error type
            let errorMessage = "Failed to fetch movies";
            
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 404) {
                    errorMessage = "No movies found in database";
                } else if (error.response.status >= 500) {
                    errorMessage = "Server error - please try again later";
                } else {
                    errorMessage = error.response.data?.message || errorMessage;
                }
            } else if (error.request) {
                // Network error
                errorMessage = "Network error - please check your connection";
            }
            
            return rejectWithValue(errorMessage);
        }
    }
);



const initialState = {
    allmoviesData: [],
    loading: false,
    error: null,
    hasFetched: false, // Track if we've attempted to fetch movies
}

export const movieSlice = createSlice({
    name: "movie",
    initialState,
    reducers: {
        setmovies: (state, action) => {
            state.allmoviesData = action.payload
        },
        clearMovies: (state) => {
            state.allmoviesData = [];
            state.error = null;
            state.hasFetched = false;
        },
        forceRefetchMovies: (state) => {
            state.hasFetched = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllMovies.pending, (state, action) => {
           state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.allmoviesData = action.payload;
                state.hasFetched = true; // Mark as successfully fetched
                
            })
            .addCase(fetchAllMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.hasFetched = true; // Mark as attempted, even if failed
            })
            // Reset movies on logout (movies are public but this keeps things clean)
            .addCase(clearToken, (state) => {
                state.allmoviesData = [];
                state.error = null;
                state.hasFetched = false; // Reset fetch status on logout
            })

    }
});




export const {
    setmovies,
    clearMovies,
    forceRefetchMovies,
} = movieSlice.actions;

export const selectAllMovies = (state) => state.movieData.allmoviesData;
export const selectMoviesLoading = (state) => state.movieData.loading;
export const selectMoviesError = (state) => state.movieData.error;
export const selectHasFetchedMovies = (state) => state.movieData.hasFetched;


