import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchAllMovies = createAsyncThunk(
    'movie/fetchAllMovies',
    async (_, { getState, rejectWithValue }) => {
        try {
            // Fetch all movies with a high limit to ensure we get everything
            const response = await api.get("movies/recent");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch movies");
        }
    }
);



const initialState = {
    allmoviesData: [],
    loading: false,
    error: null,
}

export const movieSlice = createSlice({
    name: "movie",
    initialState,
    reducers: {
        setmovies: (state, action) => {
            state.allmoviesData = action.payload
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
                
            })
            .addCase(fetchAllMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});




export const {
    setmovies,
} = movieSlice.actions;

export const selectAllMovies = (state) => state.movieData.allmoviesData;


