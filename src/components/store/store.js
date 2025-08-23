import { configureStore } from "@reduxjs/toolkit";
import { movieSlice  } from "./movieSlice";
import { tokenSlice } from "./authSlice";
import { favoritesSlice } from "./favoritesSlice";
import bookingReducer from "./bookingSlice";

const store = configureStore({
    reducer: {
        auth: tokenSlice.reducer,
        movieData: movieSlice.reducer,
        favorites: favoritesSlice.reducer,
        booking: bookingReducer
    }
});

export default store;