import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchAllMovies = createAsyncThunk(
    'movie/fetchAllMovies',
    async (_, {getState, rejectWithValue }) => {
        try {
             
            const response = await api.get("movies/recent");
            return response.data;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch movies");
        }
    }
);



const initialState = {

    allmoviesData: [],
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
            .addCase(fetchAllMovies.fulfilled, (state, action) => {
                state.allmoviesData = action.payload;
            });
    }
});






export const {
    setmovies,
} = movieSlice.actions;

export const selectAllMovies = (state) => state.movieData.allmoviesData;


