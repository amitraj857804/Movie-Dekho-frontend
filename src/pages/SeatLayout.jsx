import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaChair } from "react-icons/fa";
import api from "../api/api";
import { selectToken } from "../components/store/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useAuthModalContext } from "../hooks/useAuthModalContext";
import { useScrollOnLoadComplete } from "../hooks/useScrollToTop";
import AuthModal from "../components/auth/AuthModal";
import toast from "react-hot-toast";
import { XIcon } from "lucide-react";
import {
  selectCurrentBooking,
  setBookingData,
  setBookingStep,
  updateSelectedSeats,
  clearSelectedSeats,
} from "../components/store/bookingSlice";

function SeatLayout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  // Get booking data from Redux store
  const currentBooking = useSelector(selectCurrentBooking);

  const { isAuthModalOpen, authModalTab, closeAuthModal, switchAuthTab } =
    useAuthModalContext();

  // Extract booking details from Redux store
  const { movie, selectedDateObj, selectedTimeWithAmPm, selectedCinema } =
    currentBooking || {};

  // State management
  const cleanupRef = useRef(false);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(10);
  const [isBookingConfirming, setIsBookingConfirming] = useState(false);

  // Use custom hook for smooth scrolling when loading completes
  useScrollOnLoadComplete(!loading);

  

  // Main initialization effect
  useEffect(() => {
    // Early return if cleaning up
    if (cleanupRef.current) return;

    const initializeComponent = async () => {
      // Redirect check
      if (!currentBooking || !movie || !selectedCinema) {
        toast.error("No booking details found. Please start over.");
        navigate(`/movies/${id}`);
        return;
      }

      // Clear previous selections and localStorage
      dispatch(clearSelectedSeats());
      setSelectedSeats([]);
      localStorage.removeItem("paymentTimer");
      localStorage.removeItem("paymentStartTime");
      localStorage.removeItem("payment_timer_start");
      localStorage.removeItem("payment_session_active");

      // Fetch seats
      try {
        setLoading(true);
        const slotId = selectedCinema?.slotId || selectedCinema?.id || 12;
        const response = await api.get(`api/seats/slot/${slotId}`);
        setSeats(response.data.seats);
      } catch (err) {
        console.error("Error fetching seats:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();

    // Cleanup function
    return () => {
      cleanupRef.current = true;
    };
  }, [currentBooking, movie, selectedCinema, navigate, id, dispatch, token]);

  // Handle seat selection
  const handleSeatClick = (seat) => {
    if (seat.booked || seat.status === "BOOKED") {
      return; // Don't allow selecting booked seats
    }

    const seatNumber = seat.seatNumber || seat.no;

    const isSelected = selectedSeats.find((s) => s.seatNumber === seatNumber);

    let newSelectedSeats;
    if (isSelected) {
      // Remove seat from selection
      newSelectedSeats = selectedSeats.filter(
        (s) => s.seatNumber !== seatNumber
      );
    } else {
      // Add seat to selection (limit based on ticket count)
      if (selectedSeats.length < ticketCount) {
        newSelectedSeats = [...selectedSeats, seat];
      } else {
        toast.error(`You can only select up to ${ticketCount} seats`);
        return;
      }
    }

    // Update local state immediately
    setSelectedSeats(newSelectedSeats);

    // Update Redux store (this should not trigger auto-selection due to removed sync effect)
    dispatch(updateSelectedSeats(newSelectedSeats));
  };

  // Handle back navigation - clear selected seats (recommended approach)
  const handleBackNavigation = () => {
    dispatch(clearSelectedSeats());
    navigate(`/movies/${id}`);
  };

  // Get seat status for styling
  const getSeatClass = (seat) => {
    const seatNumber = seat.seatNumber || seat.no;
    const isSelected = selectedSeats.find(
      (s) => (s.seatNumber || s.no) === seatNumber
    );
    const isBooked = seat.lockedBySession || seat.status === "BOOKED";

    if (isBooked) {
      return "bg-red-500 cursor-not-allowed opacity-50 ";
    } else if (isSelected) {
      return "bg-primary border-1 border-primary-light cursor-pointer";
    } else {
      return "border-gray-500 bg-gray-900 border hover:bg-gray-500 cursor-pointer";
    }
  };

  // Handle booking confirmation
  const handleBookingConfirm = async () => {
    if (!token) {
      toast.error("Please login to continue booking");

      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    setIsBookingConfirming(true);

    // Prepare payload for API
    const payload = {
      slotId: selectedCinema?.slotId || selectedCinema?.id,
      seatNumbers: selectedSeats.map((seat) => seat.seatNumber),
    };

    try {
      const bookingData = await api.post("/api/bookings/select-seats", payload);

      // Update Redux store with booking response and selected seats
      dispatch(
        setBookingData({
          ...currentBooking,
          selectedSeats,
          bookingResponse: bookingData.data,
        })
      );

      // Move to payment step
      dispatch(setBookingStep("payment"));
      // Navigate to payment (no state needed, using Redux)
      navigate("/payment");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(error.response.data);
        // Refresh seat layout to show updated availability
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to book seats. Please try again."
        );
      }
    } finally {
      setIsBookingConfirming(false);
    }
  };

  // Group seats by row for better display
  const groupSeatsByRow = (seatsData) => {
    const grouped = {};
    seatsData.forEach((seat) => {
      const row = seat.seatNumber.split("")[0];
      if (!grouped[row]) {
        grouped[row] = [];
      }
      grouped[row].push(seat);
    });

    // Sort seats within each row by seat number
    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => {
        const seatNumA = parseInt(
          a.seatNumber?.replace(/[A-Z]/g, "") || a.number || 0
        );
        const seatNumB = parseInt(
          b.seatNumber?.replace(/[A-Z]/g, "") || b.number || 0
        );
        return seatNumA - seatNumB;
      });
    });

    return grouped;
  };

  // Calculate spacing for center alignment
  const getRowSpacing = (currentRowSeats, maxSeatsInAnyRow) => {
    const seatDifference = maxSeatsInAnyRow - currentRowSeats;
    const spacesOnEachSide = Math.floor(seatDifference / 2);
    return spacesOnEachSide;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading seat layout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <XMarkIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Error Loading Seats
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleBackNavigation}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const groupedSeats = groupSeatsByRow(seats);
  const rows = Object.keys(groupedSeats).sort();

  // Find the maximum number of seats in any row for proper centering
  const maxSeatsInAnyRow = Math.max(
    ...rows.map((row) => groupedSeats[row].length)
  );

  return (
    <div className="min-h-screen bg-gray-900 pt-6 px-6 py-8 ">
      <div className=" container  min-h-screen mx-auto max-w-6xl top-18 relative mb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-lg p-4 mb-6 flex">
            {/* Back Button  */}
            <button
              onClick={handleBackNavigation}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer mr-2 "
            >
              <ArrowLeftIcon className="w-6 h-6 text-white" />
            </button>
            {/* Steps Indicator */}
            {/* Desktop Steps */}
            <div className="hidden md:flex items-center justify-between max-w-2xl mx-auto sm:w-[90%]">
              {/* Step 1: Movie & Show */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
                  ✓
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Movie & Show</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="flex-1 h-px bg-primary mx-4"></div>

              {/* Step 2: Select Seats (Current) */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium animate-pulse">
                  2
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-primary">
                    Select Seats
                  </p>
                  <p className="text-xs text-gray-400">In Progress</p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="flex-1 h-px bg-gray-600 mx-4"></div>

              {/* Step 3: Payment */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-600 text-gray-400 rounded-full text-sm font-medium">
                  3
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-400">Payment</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="flex-1 h-px bg-gray-600 mx-4"></div>

              {/* Step 4: Confirmation */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-600 text-gray-400 rounded-full text-sm font-medium">
                  4
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-400">
                    Confirmation
                  </p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </div>

            {/* Mobile Steps */}
            <div className="md:hidden">
              <div className="flex items-center justify-center space-x-3">
                {/* Step indicators only */}
                <div className="flex items-center flex-col gap-0.5">
                  <div className="w-6 h-6 bg-primary text-white rounded-full text-xs font-medium flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-xs text-gray-400 ">Movie</span>
                </div>

                <div className="w-6 h-px bg-primary"></div>

                <div className="flex items-center flex-col gap-0.5">
                  <div className="w-6 h-6 bg-primary text-white rounded-full text-xs font-medium flex items-center justify-center animate-pulse">
                    2
                  </div>
                  <span className="text-xs text-primary ">Seats</span>
                </div>

                <div className="w-6 h-px bg-gray-600"></div>

                <div className="flex items-center flex-col gap-0.5">
                  <div className="w-6 h-6 bg-gray-600 text-gray-400 rounded-full text-xs font-medium flex items-center justify-center">
                    3
                  </div>
                  <span className="text-xs text-gray-400 ">Pay</span>
                </div>

                <div className="w-6 h-px bg-gray-600"></div>

                <div className="flex items-center flex-col gap-0.5">
                  <div className="w-6 h-6 bg-gray-600 text-gray-400 rounded-full text-xs font-medium flex items-center justify-center">
                    4
                  </div>
                  <span className="text-xs text-gray-400 ">Done</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 grid-cols-1 gap-8">
          {/* Seat Layout */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6 ">
              {/* Screen */}
              <div className="mb-8">
                <div className=" mx-auto sm:max-w-2xl w-full">
                  {/* Screen with curved effect */}
                  <div
                    className="bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 rounded-t-full  text-center transform perspective-1000 rotate-x-12 shadow-2xl"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.4), rgba(99, 102, 241, 0.1))",
                      borderRadius: "100px 100px 20px 20px",
                      transform: "perspective(300px) rotateX(45deg)",
                      boxShadow:
                        "0 10px 30px rgba(99, 102, 241, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <p className="text-white font-bold text-lg tracking-widest">
                      SCREEN
                    </p>
                    {/* Screen glow effect */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-primary/40 blur-sm rounded-full"></div>
                  </div>
                  {/* Floor reflection */}
                  <div
                    className="w-full h-2 bg-gradient-to-r from-transparent via-primary/10 to-transparent rounded-b-lg"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, rgba(99, 102, 241, 0.1), transparent)",
                    }}
                  ></div>
                </div>
              </div>

              {/* Seats */}
              <div className="mx-auto max-h-80 md:max-h-none overflow-y-auto md:overflow-y-visible  md:border-none rounded-lg md:rounded-none p-4 md:p-0">
                <div className="space-y-3 mx-auto pb-1 ">
                  {rows.map((row) => {
                    const currentRowSeats = groupedSeats[row].length;
                    const spacingCount = getRowSpacing(
                      currentRowSeats,
                      maxSeatsInAnyRow
                    );

                    return (
                      <div key={row} className="flex items-center gap-2">
                        {/* Row Label - Fixed position */}
                        <div className="w-8 text-center flex-shrink-0">
                          <span className="text-gray-400 font-medium">
                            {row}
                          </span>
                        </div>

                        {/* Seats in Row - Centered with spacing */}
                        <div className="flex-1 items-center justify-center">
                          <div className="flex gap-1 justify-center items-center min-w-max px-2 sm:px-0">
                            {/* Leading spacers for center alignment */}
                            {Array.from(
                              { length: spacingCount },
                              (_, index) => (
                                <div
                                  key={`spacer-start-${index}`}
                                  className="w-8 h-8 flex-shrink-0 md:hidden"
                                ></div>
                              )
                            )}

                            {/* Actual seat buttons */}
                            {groupedSeats[row].map((seat, index) => (
                              <button
                                key={seat.seatNumber || index}
                                onClick={() => handleSeatClick(seat)}
                                className={`w-8 h-8 rounded text-xs flex justify-center items-center font-medium text-white transition-all duration-200 hover:scale-105 flex-shrink-0 ${getSeatClass(
                                  seat
                                )}`}
                                disabled={
                                  seat.isBooked || seat.status === "BOOKED"
                                }
                                title={`${seat.seatNumber || seat.number} - ${
                                  seat.booked || seat.status === "BOOKED"
                                    ? "Booked"
                                    : "Available"
                                }`}
                              >
                                <FaChair />
                              </button>
                            ))}

                            {/* Trailing spacers for center alignment */}
                            {Array.from(
                              { length: spacingCount },
                              (_, index) => (
                                <div
                                  key={`spacer-end-${index}`}
                                  className="w-8 h-8 flex-shrink-0 md:hidden"
                                ></div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-6 m-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-gray-500 bg-gray-900 border rounded"></div>
                <span className="text-gray-400 text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span className="text-gray-400 text-sm">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded opacity-50"></div>
                <span className="text-gray-400 text-sm">Booked</span>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Booking Summary
              </h3>

              {/* Movie Details */}
              {movie && (
                <div className="mb-4 pb-4 border-b border-gray-700 flex gap-3 ">
                  <div>
                    <img
                      src={`${movie.thumbnail}`}
                      alt={`${movie.title}`}
                      className="w-20 rounded-sm"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{movie.title}</h4>
                    <p className="text-sm text-gray-400">
                      {selectedCinema?.theaterName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedDateObj?.date} {selectedDateObj?.monthName} •{" "}
                      {selectedTimeWithAmPm.replace(/\s+/g, "")}
                    </p>
                  </div>
                </div>
              )}

              {/* Selected Seats */}
              <div className="mb-4">
                <h4 className="font-medium text-white mb-2">Selected Seats</h4>
                {selectedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedSeats.map((seat, index) => (
                      <span
                        key={index}
                        className="bg-primary px-2 py-1 rounded text-xs text-white"
                      >
                        {seat.seatNumber || seat.number}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No seats selected</p>
                )}
              </div>

              {selectedSeats.length > 0 && (
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>{selectedSeats.length} Seats </span>
                    <XIcon className="hover:text-primary cursor-pointer w-5 h-5" onClick={()=> setSelectedSeats([])} />
                  </div>
                  {/* Price Breakdown */}
                  <div className="flex justify-between text-lg font-bold text-white border-t border-gray-600 pt-2">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹
                      {selectedSeats.reduce(
                        (total, seat) => total + seat.price,
                        0
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Proceed Button */}
              <button
                onClick={handleBookingConfirm}
                disabled={selectedSeats.length === 0 || isBookingConfirming}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                  selectedSeats.length > 0 && !isBookingConfirming
                    ? "bg-primary hover:bg-primary/90 text-white hover:scale-105"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isBookingConfirming ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : selectedSeats.length > 0 ? (
                  "Proceed to Payment"
                ) : (
                  "Select Seats"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        activeTab={authModalTab}
        onTabChange={switchAuthTab}
      />
    </div>
  );
}

export default SeatLayout;
