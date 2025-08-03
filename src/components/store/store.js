import { configureStore } from "@reduxjs/toolkit";
import { movieSlice  } from "./movieSlice";
import { tokenSlice } from "./authSlice";
import { favoritesSlice } from "./favoritesSlice";
const store = configureStore({
    reducer: {
        auth: tokenSlice.reducer,
        movieData: movieSlice.reducer,
        favorites: favoritesSlice.reducer
    }
});

export default store;