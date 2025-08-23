import { createSlice } from '@reduxjs/toolkit';

// Load persisted booking data from localStorage
const loadPersistedBooking = () => {
  try {
    const persistedBooking = localStorage.getItem('currentBooking');
    const persistedStep = localStorage.getItem('bookingStep');
    return {
      currentBooking: persistedBooking ? JSON.parse(persistedBooking) : null,
      bookingStep: persistedStep || 'movie-selection'
    };
  } catch (error) {
    console.error('Error loading persisted booking data:', error);
    return {
      currentBooking: null,
      bookingStep: 'movie-selection'
    };
  }
};

const persistedData = loadPersistedBooking();

const initialState = {
  currentBooking: persistedData.currentBooking,
  bookingStep: persistedData.bookingStep,
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingData: (state, action) => {
      state.currentBooking = {
        ...state.currentBooking,
        ...action.payload,
      };
      // Persist to localStorage
      localStorage.setItem('currentBooking', JSON.stringify(state.currentBooking));
    },
    setBookingStep: (state, action) => {
      state.bookingStep = action.payload;
      // Persist to localStorage
      localStorage.setItem('bookingStep', action.payload);
    },
    clearBooking: (state) => {
      state.currentBooking = null;
      state.bookingStep = 'movie-selection';
      state.error = null;
      // Clear from localStorage
      localStorage.removeItem('currentBooking');
      localStorage.removeItem('bookingStep');
    },
    setBookingLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setBookingError: (state, action) => {
      state.error = action.payload;
    },
    updateSelectedSeats: (state, action) => {
      if (state.currentBooking) {
        state.currentBooking.selectedSeats = action.payload;
        state.currentBooking.totalAmount = action.payload.reduce(
          (total, seat) => total + seat.price, 
          0
        );
        // Persist to localStorage
        localStorage.setItem('currentBooking', JSON.stringify(state.currentBooking));
      }
    },
    clearSelectedSeats: (state) => {
      if (state.currentBooking) {
        state.currentBooking.selectedSeats = [];
        state.currentBooking.totalAmount = 0;
        // Remove booking response data as it's no longer valid
        delete state.currentBooking.bookingResponse;
        // Persist to localStorage
        localStorage.setItem('currentBooking', JSON.stringify(state.currentBooking));
      }
    },
  },
});

export const {
  setBookingData,
  setBookingStep,
  clearBooking,
  setBookingLoading,
  setBookingError,
  updateSelectedSeats,
  clearSelectedSeats,
} = bookingSlice.actions;

// Selectors
export const selectCurrentBooking = (state) => state.booking.currentBooking;
export const selectBookingStep = (state) => state.booking.bookingStep;
export const selectBookingLoading = (state) => state.booking.isLoading;
export const selectBookingError = (state) => state.booking.error;

export default bookingSlice.reducer;
