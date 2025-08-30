import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { selectToken } from "../components/store/authSlice";
import {
  selectUserBookings,
  selectUserBookingsLoading,
  selectUserBookingsError,
  selectUserBookingsActionLoading,
} from "../components/store/userBookingSlice";
import { useAuthModalContext } from "../hooks/useAuthModalContext";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useUserBookings } from "../hooks/useUserBookings";
import DownloadTicketButton from "../components/DownloadTicketButton";
import toast from "react-hot-toast";
import AuthModal from "../components/auth/AuthModal";

function MyBookings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  // Use Redux selectors instead of local state
  const bookings = useSelector(selectUserBookings);
  const loading = useSelector(selectUserBookingsLoading);
  const error = useSelector(selectUserBookingsError);
  const actionLoading = useSelector(selectUserBookingsActionLoading);

  const { isAuthModalOpen, authModalTab, closeAuthModal, switchAuthTab } =
    useAuthModalContext();

  // Use custom hook for smooth scrolling to top
  useScrollToTop();

  // Use custom hook for smart bookings fetching
  const { refetch } = useUserBookings();

  // Show login prompt if no token
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 sm:px-30 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex items-center relative bg-gray-800 rounded-lg p-2">
            <button
              onClick={() => navigate("/")}
              className="absolute left-4 text-white hover:text-primary transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 cursor-pointer" />
            </button>
            <div className="flex-1 flex justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white sm:text-primary text-center">
                My Bookings
              </h1>
            </div>
          </div>

          <div className="text-center py-20">
            <div className="mb-6">
              <TicketIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-400 mb-2">
                Please login to view your bookings
              </h2>
              <p className="text-gray-500 mb-6">
                Sign in to see your movie bookings and tickets
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 cursor-pointer rounded-lg font-semibold transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
        <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        activeTab={authModalTab}
        onTabChange={switchAuthTab}
      />
      </div>
    );
  }

  // Format DateTime function to handle your backend response
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: "N/A", time: "N/A" };
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // Get booking status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-green-400 bg-green-400/20";
      case "cancelled":
        return "text-red-400 bg-red-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 sm:px-30 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex items-center relative w-full bg-gray-800 rounded-lg p-2">
            <button
              onClick={() => navigate("/")}
              className="absolute left-4 text-white hover:text-primary transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 cursor-pointer" />
            </button>
            <div className="flex-1 flex justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white sm:text-primary text-center">
                My Bookings
              </h1>
            </div>
          </div>

          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/30 border-b-primary rounded-full animate-spin"></div>
              <p className="text-gray-400">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6 sm:px-30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-8 flex items-center relative bg-gray-800 rounded-lg p-2">
            <button
              onClick={() => navigate("/")}
              className="absolute left-4 text-white hover:text-primary hover:bg-gray-700 p-1.5 rounded-sm transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 cursor-pointer" />
            </button>
            <div className="flex-1 flex justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white sm:text-primary text-center">
                My Bookings
              </h1>
            </div>
          
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              {bookings.length > 0
                ? `You have ${bookings.length} booking${
                    bookings.length > 1 ? "s" : ""
                  }`
                : "Your movie bookings will appear here"}
            </p>
            <button
              onClick={refetch}
              className="text-primary hover:!text-white transition-colors duration-300 text-sm font-medium cursor-pointer"
            >
              {error ? "↻ Try Again" : "↻ Refresh"}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <ExclamationCircleIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-6">
              <TicketIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-400 mb-2">
                No bookings yet
              </h2>
              <p className="text-gray-500 mb-6">
                Start exploring movies and book your first show!
              </p>
              <button
                onClick={() => navigate("/movies")}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Movies
              </button>
            </div>
          </div>
        )}

        {/* Bookings Grid */}
        {bookings.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {bookings.map((booking, index) => (
              <div
                key={booking.id || index}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        booking.movie?.thumbnail ||
                        booking.movieThumbnail ||
                        "/placeholder-movie.jpg"
                      }
                      alt={
                        booking.movie?.title || booking.movieTitle || "Movie"
                      }
                      className="w-20 h-28 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-movie.jpg";
                      }}
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {booking.movie?.title ||
                            booking.movieTitle ||
                            "Movie Title"}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status || "Confirmed"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold text-lg">
                          ₹{booking.totalAmount || booking.amount || "0"}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Booking ID: {booking.id || booking.bookingId || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Cinema and Show Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPinIcon className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            {booking.cinema?.name ||
                              booking.theaterName ||
                              "Theater Name"}
                          </span>
                          <span className="text-sm">
                            {booking.cinema?.location ||
                              booking.location ||
                              "Theater address"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            {formatDateTime(booking.showDateTime).date}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <ClockIcon className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            {formatDateTime(booking.showDateTime).time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <TicketIcon className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            Seats:{" "}
                            {Array.isArray(booking.seats)
                              ? booking.seats.join(", ")
                              : booking.seatNumbers?.join(", ") || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Date and Actions */}
                    <div className="border-t border-gray-700 pt-3 hidden lg:flex justify-between items-center">
                      <p className="text-gray-500 text-sm">
                        Booked on: {formatDateTime(booking.bookingTime).date}
                      </p>

                      {/* Download Ticket Button */}
                      <DownloadTicketButton
                        bookingId={booking.id || booking.bookingId}
                        status={booking.status}
                        size="md"
                        onDownloadStart={() =>
                          console.log(
                            "Download started for booking:",
                            booking.id || booking.bookingId
                          )
                        }
                        onDownloadComplete={() =>
                          console.log(
                            "Download completed for booking:",
                            booking.id || booking.bookingId
                          )
                        }
                        onDownloadError={(error) =>
                          console.error(
                            "Download error for booking:",
                            booking.id || booking.bookingId,
                            error
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-3 flex lg:hidden justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    Booked on: {formatDateTime(booking.bookingTime).date}
                  </p>

                  {/* Download Ticket Button */}
                  <DownloadTicketButton
                    bookingId={booking.id || booking.bookingId}
                    status={booking.status}
                    size="md"
                    onDownloadStart={() =>
                      console.log(
                        "Download started for booking:",
                        booking.id || booking.bookingId
                      )
                    }
                    onDownloadComplete={() =>
                      console.log(
                        "Download completed for booking:",
                        booking.id || booking.bookingId
                      )
                    }
                    onDownloadError={(error) =>
                      console.error(
                        "Download error for booking:",
                        booking.id || booking.bookingId,
                        error
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Auth Modal */}
      
      </div>
      
    </div>
  );
}

export default MyBookings;
