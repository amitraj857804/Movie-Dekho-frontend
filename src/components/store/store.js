import { configureStore } from "@reduxjs/toolkit";
import { movieSlice  } from "./movieSlice";
import { tokenSlice } from "./authSlice";
import { favoritesSlice } from "./favoritesSlice";
import bookingReducer from "./bookingSlice";
import userBookingReducer from "./userBookingSlice";
import userProfileReducer from "./userProfileSlice";


const store = configureStore({
    reducer: {
        auth: tokenSlice.reducer,
        movieData: movieSlice.reducer,
        favorites: favoritesSlice.reducer,
        booking: bookingReducer,
        userBookings: userBookingReducer,
        userProfile: userProfileReducer,
    }
});

export default store;