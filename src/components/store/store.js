import { configureStore } from "@reduxjs/toolkit";
import { movieSlice  } from "./movieSlice";
import { tokenSlice } from "./authSlice";
const store = configureStore({
    reducer: {
        auth: tokenSlice.reducer,
        movieData: movieSlice.reducer
    }
});

export default store;