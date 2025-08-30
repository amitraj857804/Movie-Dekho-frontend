import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { clearToken } from "./authSlice";

// Fetch user's bookings
export const fetchUserBookings = createAsyncThunk(
  "userBookings/fetchUserBookings",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) throw new Error("No token available");

      const response = await api.get("/api/bookings/my-bookings", {
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
        error.response?.data?.message || error.message || "Failed to fetch bookings";
      return rejectWithValue(errorMessage);
    }
  }
);

// // Add a booking (user booked a ticket)
// export const addUserBooking = createAsyncThunk(
//   "userBookings/addUserBooking",
//   async (bookingData, { getState, rejectWithValue, dispatch }) => {
//     try {
//       const state = getState();
//       const token = state.auth.token;

//       if (!token) throw new Error("No token available");

//       const response = await api.post(
//         "/api/user/bookings",
//         bookingData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       // Only clear token for 401 (Unauthorized) - token is invalid/expired
//       // 403 (Forbidden) means token is valid but user lacks permission
//       if (error.response?.status === 401) {
//         dispatch(clearToken());
//         return rejectWithValue("Authentication expired. Please login again.");
//       }

//       const errorMessage =
//         error.response?.data?.message || error.message || "Failed to add booking";
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// Remove a booking (optional)
export const removeUserBooking = createAsyncThunk(
  "userBookings/removeUserBooking",
  async (bookingId, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) throw new Error("No token available");

      const response = await api.delete(`/api/user/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { bookingId, message: response.data };
    } catch (error) {
      // Only clear token for 401 (Unauthorized) - token is invalid/expired
      // 403 (Forbidden) means token is valid but user lacks permission
      if (error.response?.status === 401) {
        dispatch(clearToken());
        return rejectWithValue("Authentication expired. Please login again.");
      }

      const errorMessage =
        error.response?.data?.message || error.message || "Failed to remove booking";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  bookings: [],
  bookingIds: [],
  loading: false,
  actionLoading: false,
  error: null,
  hasFetched: false, // whether we've fetched bookings this session
};

const userBookingSlice = createSlice({
  name: "userBookings",
  initialState,
  reducers: {
    clearBookings: (state) => {
      state.bookings = [];
      state.bookingIds = [];
      state.error = null;
      state.hasFetched = false;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
    forceRefetchBookings: (state) => {
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.bookingIds = action.payload.map((b) => b.id);
        state.hasFetched = true;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add booking
    //   .addCase(addUserBooking.pending, (state) => {
    //     state.actionLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(addUserBooking.fulfilled, (state, action) => {
    //     state.actionLoading = false;
    //     // Server should return the created booking object
    //     const booking = action.payload;
    //     if (booking && booking.id && !state.bookingIds.includes(booking.id)) {
    //       state.bookings.unshift(booking);
    //       state.bookingIds.push(booking.id);
    //     }
    //     // Mark fetched so other components don't refetch unnecessarily
    //     state.hasFetched = true;
    //   })
    //   .addCase(addUserBooking.rejected, (state, action) => {
    //     state.actionLoading = false;
    //     state.error = action.payload;
    //   })

      // Remove booking
      .addCase(removeUserBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(removeUserBooking.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { bookingId } = action.payload;
        state.bookingIds = state.bookingIds.filter((id) => id !== bookingId);
        state.bookings = state.bookings.filter((b) => b.id !== bookingId);
      })
      .addCase(removeUserBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Reset on logout
      .addCase(clearToken, (state) => {
        state.bookings = [];
        state.bookingIds = [];
        state.loading = false;
        state.actionLoading = false;
        state.error = null;
        state.hasFetched = false;
      });
  },
});

export const { clearBookings, clearBookingError, forceRefetchBookings } =
  userBookingSlice.actions;

// Selectors
export const selectUserBookings = (state) => state.userBookings.bookings;
export const selectUserBookingIds = (state) => state.userBookings.bookingIds;
export const selectUserBookingsLoading = (state) => state.userBookings.loading;
export const selectUserBookingsActionLoading = (state) => state.userBookings.actionLoading;
export const selectUserBookingsError = (state) => state.userBookings.error;
export const selectHasFetchedUserBookings = (state) => state.userBookings.hasFetched;

export default userBookingSlice.reducer;
