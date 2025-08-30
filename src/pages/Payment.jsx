import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { selectToken } from "../components/store/authSlice";
import {
  selectCurrentBooking,
  selectBookingStep,
  setBookingStep,
  clearBooking,
  clearSelectedSeats,
} from "../components/store/bookingSlice";

import { useScrollOnLoadComplete } from "../hooks/useScrollToTop";
import toast from "react-hot-toast";
import api from "../api/api";
import ShareDialog from "../components/shareDialog";

function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [isOpenConvenince, setIsOpenConvenince] = useState(false);

  // Get booking data from Redux store
  const currentBooking = useSelector(selectCurrentBooking);
  const bookingStep = useSelector(selectBookingStep);

  // Extract booking details from Redux store
  const {
    movie,
    selectedDateObj,
    selectedTimeWithAmPm,
    selectedCinema,
    selectedSeats,
    bookingResponse,
  } = currentBooking || {};

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: "",
  });

  // Payment processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [successBookingData, setSuccessBookingData] = useState(null); // Preserve booking data for success screen
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false); // Timer expiration dialog
  const [showRefreshWarning, setShowRefreshWarning] = useState(false); // Page refresh warning dialog
  const [showShareDialog, setShowShareDialog] = useState(false); // Share dialog state

  // Timer for payment timeout - persistent across page refreshes
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const TIMER_DURATION = 600; // 10 minutes in seconds
  const TIMER_KEY = "payment_timer_start";
  const startTimeRef = useRef(null);

  // Use custom hook for smooth scrolling when processing completes
  useScrollOnLoadComplete(isProcessing);

  // Redirect if no booking data (with delay to allow Redux hydration)
  useEffect(() => {
    // Add a small delay to allow Redux store to hydrate from localStorage
    const timeoutId = setTimeout(() => {
      if (
        !currentBooking ||
        !movie ||
        !selectedSeats ||
        selectedSeats.length === 0
      ) {
        // Clear timer when redirecting due to no booking data
        localStorage.removeItem(TIMER_KEY);
        toast.error("No booking details found. Please start over.");
        navigate("/movies");
        return;
      }

      // Set booking step to payment if not already set
      if (bookingStep !== "payment") {
        dispatch(setBookingStep("payment"));
      }
    }, 100); // Small delay to allow store hydration

    return () => clearTimeout(timeoutId);
  }, [currentBooking, movie, selectedSeats, navigate, bookingStep, dispatch]);

  // Initialize timer on component mount - always restart for fresh payment session
  useEffect(() => {
    const initializeTimer = () => {
      const currentTime = Math.floor(Date.now() / 1000);

      // Always start fresh timer when entering payment (restart on return from seat selection)
      localStorage.setItem(TIMER_KEY, currentTime.toString());
      setTimeLeft(TIMER_DURATION);
      startTimeRef.current = currentTime;
    };

    if (currentBooking && movie && selectedSeats && selectedSeats.length > 0) {
      initializeTimer();
    }
  }, [currentBooking, movie, selectedSeats]);

  // Simple timer that works reliably
  useEffect(() => {
    if (timeLeft > 0 && !paymentSuccess) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      // Clear timer when expired and show timeout dialog
      localStorage.removeItem(TIMER_KEY);
      setShowTimeoutDialog(true);
    }
  }, [timeLeft, paymentSuccess, navigate]);

  // Clear timer on payment success
  useEffect(() => {
    if (paymentSuccess) {
      localStorage.removeItem(TIMER_KEY);
    }
  }, [paymentSuccess]);

  // Handle page refresh - cancel transaction and redirect
  useEffect(() => {
    // Set a flag when component mounts to detect refresh
    const PAYMENT_SESSION_KEY = "payment_session_active";
    const wasPaymentActive = localStorage.getItem(PAYMENT_SESSION_KEY);

    // Only treat as refresh if the flag exists AND we have booking data
    // This prevents false positives when navigating normally
    if (
      wasPaymentActive &&
      !paymentSuccess &&
      currentBooking &&
      movie &&
      selectedSeats &&
      selectedSeats.length > 0
    ) {
      // User refreshed during payment - cancel transaction
      toast.error(
        "Transaction cancelled due to page refresh. Please start over."
      );
      localStorage.removeItem(PAYMENT_SESSION_KEY);
      localStorage.removeItem(TIMER_KEY);
      dispatch(clearBooking());
      navigate("/movies");
      return;
    }

    // Mark payment session as active only if we have valid booking data
    if (currentBooking && movie && selectedSeats && selectedSeats.length > 0) {
      localStorage.setItem(PAYMENT_SESSION_KEY, "true");
    }

    // Add keyboard event listener for refresh detection (F5, Ctrl+R)
    const handleKeyDown = (e) => {
      if (
        !paymentSuccess &&
        !isProcessing &&
        currentBooking &&
        selectedSeats?.length > 0 &&
        !showRefreshWarning
      ) {
        // F5 key
        if (e.key === "F5") {
          e.preventDefault();
          setShowRefreshWarning(true);
          return;
        }

        // Ctrl+R or Cmd+R
        if ((e.ctrlKey || e.metaKey) && e.key === "r") {
          e.preventDefault();
          setShowRefreshWarning(true);
          return;
        }
      }
    };

    // Add beforeunload event for other refresh methods (browser button, etc.)
    const handleBeforeUnload = (e) => {
      // Only show warning for refresh/close, not for navigation
      if (
        !paymentSuccess &&
        !isProcessing &&
        currentBooking &&
        selectedSeats?.length > 0 &&
        !showRefreshWarning
      ) {
        // Prevent the default browser behavior
        e.preventDefault();
        e.returnValue =
          "Transaction will be cancelled if you refresh or leave this page.";

        // Show our custom dialog with a small delay
        setTimeout(() => {
          setShowRefreshWarning(true);
        }, 100);

        return "Transaction will be cancelled if you refresh or leave this page.";
      }
    };

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Clean up session flag when component unmounts normally
      localStorage.removeItem(PAYMENT_SESSION_KEY);
    };
  }, [
    paymentSuccess,
    isProcessing,
    dispatch,
    navigate,
    currentBooking,
    movie,
    selectedSeats,
    showRefreshWarning,
  ]);

  // Format time left
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Custom navigation warning handlers
  const handleNavigationAttempt = (navigationFn) => {
    if (
      !paymentSuccess &&
      !isProcessing &&
      currentBooking &&
      selectedSeats?.length > 0
    ) {
      setPendingNavigation(() => navigationFn);
      setShowExitWarning(true);
    } else {
      navigationFn();
    }
  };

  const confirmExit = () => {
    setShowExitWarning(false);
    if (pendingNavigation) {
      // Cancel the payment session
      localStorage.removeItem("payment_session_active");
      localStorage.removeItem(TIMER_KEY);

      // Only clear selected seats, keep movie/cinema data for better UX
      dispatch(clearSelectedSeats());

      // Navigate back to seat selection with movie data intact
      if (currentBooking?.movie?.id) {
        const url = `/movies/${currentBooking.movie.id}/seat-selection`;

        navigate(url);
      } else {
        // Fallback to movies page if no movie data
        dispatch(clearBooking());
        navigate("/movies");
      }
    }
  };

  const cancelExit = () => {
    setShowExitWarning(false);
    setPendingNavigation(null);
  };

  // Handle timer timeout dialog
  const handleTimeoutGoHome = () => {
    setShowTimeoutDialog(false);
    dispatch(clearBooking());
    navigate("/");
  };

  const handleTimeoutBrowseMovies = () => {
    setShowTimeoutDialog(false);
    dispatch(clearBooking());
    navigate("/movies");
  };

  // Handle refresh warning dialog
  const handleRefreshCancel = () => {
    setShowRefreshWarning(false);
  };

  const handleRefreshConfirm = () => {
    setShowRefreshWarning(false);
    // Cancel transaction and clear data
    toast.error(
      "Transaction cancelled due to page refresh. Please start over."
    );
    localStorage.removeItem("payment_session_active");
    localStorage.removeItem(TIMER_KEY);
    dispatch(clearBooking());
    // Navigate to movies page instead of forcing refresh
    navigate("/movies");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formatted.length <= 19) {
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }

    // Format expiry date
    if (name === "expiryDate") {
      // Allow only numbers and forward slash
      let cleanValue = value.replace(/[^0-9/]/g, "");
      
      // Remove any existing slashes to start fresh
      let numbersOnly = cleanValue.replace(/\//g, "");
      
      // Limit to 4 digits
      numbersOnly = numbersOnly.substring(0, 4);
      
      // Validate month if we have at least 2 digits
      if (numbersOnly.length >= 2) {
        const month = numbersOnly.substring(0, 2);
        const monthNum = parseInt(month);
        
        // If month is greater than 12, limit to valid month
        if (monthNum > 12) {
          // If first digit is 2-9, only allow 1 (for months 01-12)
          if (month.charAt(0) > '1') {
            numbersOnly = '1' + numbersOnly.substring(1);
          } else if (monthNum > 12) {
            // If month is 13-19, convert to 12
            numbersOnly = '12' + numbersOnly.substring(2);
          }
        }
        
        // If month starts with 0, make sure second digit isn't 0 (prevent 00)
        if (month === '00') {
          numbersOnly = '01' + numbersOnly.substring(2);
        }
      }
      
      // Add slash after 2 digits if we have more than 2
      if (numbersOnly.length > 2) {
        cleanValue = numbersOnly.substring(0, 2) + "/" + numbersOnly.substring(2);
      } else {
        cleanValue = numbersOnly;
      }
      
      setFormData({ ...formData, [name]: cleanValue });
      return;
    }

    // Limit CVV to 3-4 digits
    if (name === "cvv" && value.length <= 3) {
      setFormData({ ...formData, [name]: value.replace(/\D/g, "") });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Validate payment form
  const validateForm = () => {
    if (paymentMethod === "card") {
      const { cardNumber, expiryDate, cvv, cardholderName } = formData;
      if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
        setPaymentError("Please enter a valid 16-digit card number");
        return false;
      }
      if (!expiryDate || expiryDate.length !== 5) {
        setPaymentError("Please enter a valid expiry date (MM/YY)");
        return false;
      }
      
      // Validate month (should be 01-12)
      const month = parseInt(expiryDate.substring(0, 2));
      if (month < 1 || month > 12) {
        setPaymentError("Please enter a valid month (01-12)");
        return false;
      }
      const year = parseInt(expiryDate.substring(3,5))
      // Check if the expiry date is not in the past
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        setPaymentError("Card has expired. Please enter a valid expiry date");
        return false;
      }
      if (!cvv || cvv.length < 3) {
        setPaymentError("Please enter a valid CVV");
        return false;
      }
      if (!cardholderName.trim()) {
        setPaymentError("Please enter cardholder name");
        return false;
      }
    } else if (paymentMethod === "upi") {
      if (!formData.upiId || !formData.upiId.includes("@")) {
        setPaymentError("Please enter a valid UPI ID");
        return false;
      }
    }

    setPaymentError("");
    return true;
  };

  // Handle payment processing
  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentError("");

    // Validate required data
    if (!bookingResponse?.seatNumbers || !bookingResponse?.slotId) {
      setPaymentError(
        "Missing booking information. Please restart the booking process."
      );
      setIsProcessing(false);
      return;
    }

    const payload = {
      slotId: Number(bookingResponse.slotId),
      seatNumbers: bookingResponse.seatNumbers,
      totalAmount: Number(finalTotal),
      cardNumber: formData.cardNumber.replace(/\s/g, ""),
      cardHolderName: formData.cardholderName,
      expiryDate: formData.expiryDate,
      cvv: formData.cvv,
    };

    try {
      const response = await api.post("/api/bookings/payment", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if payment was successful based on response
      if (
        response.data &&
        (response.status === 200 || response.status === 201)
      ) {
        // Preserve booking data for success screen before any potential clearing
        setSuccessBookingData({
          movie,
          selectedDateObj,
          selectedTimeWithAmPm,
          selectedCinema,
          selectedSeats,
          finalTotal: seatTotal + convenienceFee,
        });

        setPaymentSuccess(true);
        toast.success("Payment successful! Booking confirmed.");

        // Add the booking to user bookings cache
        const bookingToAdd = {
          id: response.data.bookingId || Date.now(), // Use response booking ID or fallback
          movie,
          selectedDateObj,
          selectedTimeWithAmPm,
          selectedCinema,
          selectedSeats,
          finalTotal: seatTotal + convenienceFee,
          status: "confirmed",
          bookingDate: new Date().toISOString(),
          ...response.data // Include any additional data from the response
        };
        
        // Dispatch to Redux to update cached bookings
        

        // Clear timer on successful payment
        localStorage.removeItem(TIMER_KEY);

        // Set booking step to confirmation
        dispatch(setBookingStep("confirmation"));

        // Keep the success screen visible for user to see confirmation
        // Don't automatically clear booking data - let user navigate manually
      } else {
        throw new Error("Payment processing failed. Please try again.");
      }
    } catch (error) {
      // Handle different types of errors
      let errorMessage = "Payment failed. Please try again.";

      if (error.response) {
        // Server responded with error status
        const status = error.response.status;

        if (status === 403) {
          errorMessage =
            "Payment not authorized. Please check your credentials and try again.";
        } else if (status === 400) {
          errorMessage =
            data?.message ||
            "Invalid payment information. Please check your details.";
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage =
            data?.message || `Payment failed (${status}). Please try again.`;
        }
      } else if (error.request) {
        // Network error
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      setPaymentError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate breakdown using Redux data
  const seatTotal = bookingResponse?.ticketFee;
  const convenienceFee = bookingResponse?.convenienceFee;
  const base = ((seatTotal * 7) / 100).toFixed(2);
  const taxes = base * 0.18;
  const finalTotal = seatTotal + convenienceFee;

  // Payment success screen
  if (paymentSuccess) {
    const displayData = successBookingData || {
      movie,
      selectedDateObj,
      selectedTimeWithAmPm,
      selectedCinema,
      selectedSeats,
      finalTotal,
    };

    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6 pb-10">
        <div className="container mx-auto max-w-4xl">
          {/* Success Header with Steps */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-400">Your booking has been confirmed</p>
            </div>

            {/* Progress Steps - All Completed */}
            <div className="mt-6">
              {/* Desktop Steps */}
              <div className="hidden md:flex items-center justify-between max-w-2xl mx-auto">
                {/* Step 1: Movie & Show */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                    ✓
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      Movie & Show
                    </p>
                    <p className="text-xs text-green-400">Completed</p>
                  </div>
                </div>

                {/* Connector Line */}
                <div className="flex-1 h-px bg-green-500 mx-4"></div>

                {/* Step 2: Select Seats */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                    ✓
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      Select Seats
                    </p>
                    <p className="text-xs text-green-400">Completed</p>
                  </div>
                </div>

                {/* Connector Line */}
                <div className="flex-1 h-px bg-green-500 mx-4"></div>

                {/* Step 3: Payment */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                    ✓
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Payment</p>
                    <p className="text-xs text-green-400">Completed</p>
                  </div>
                </div>

                {/* Connector Line */}
                <div className="flex-1 h-px bg-green-500 mx-4"></div>

                {/* Step 4: Confirmation */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                    ✓
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      Confirmation
                    </p>
                    <p className="text-xs text-green-400">Completed</p>
                  </div>
                </div>
              </div>

              {/* Mobile Steps */}
              <div className="md:hidden">
                <div className="flex items-center justify-center space-x-3">
                  {/* Step indicators only */}
                  <div className="flex items-center flex-col gap-0.5">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full text-xs font-medium flex items-center justify-center">
                      ✓
                    </div>
                    <span className="text-xs text-green-400">Movie</span>
                  </div>

                  <div className="w-8 h-px bg-green-500"></div>

                  <div className="flex items-center flex-col gap-0.5">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full text-xs font-medium flex items-center justify-center">
                      ✓
                    </div>
                    <span className="text-xs text-green-400">Seats</span>
                  </div>

                  <div className="w-8 h-px bg-green-500"></div>

                  <div className="flex items-center flex-col gap-0.5">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full text-xs font-medium flex items-center justify-center">
                      ✓
                    </div>
                    <span className="text-xs text-green-400">Pay</span>
                  </div>

                  <div className="w-8 h-px bg-green-500"></div>

                  <div className="flex items-center flex-col gap-0.5">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full text-xs font-medium flex items-center justify-center">
                      ✓
                    </div>
                    <span className="text-xs text-green-400">Done</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details Card */}
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <div className="bg-gray-700 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-white font-semibold mb-4">
                  Booking Details
                </h3>

                {/* Movie Info with Thumbnail */}
                <div className="flex gap-4 mb-4">
                  <img
                    src={displayData.movie?.thumbnail}
                    alt={displayData.movie?.title}
                    className="w-16 h-20 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium text-base mb-1">
                      {displayData.movie?.title}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Cinema: {displayData.selectedCinema?.theaterName}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Date: {displayData.selectedDateObj?.date}{" "}
                      {displayData.selectedDateObj?.monthName}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Time: {displayData.selectedTimeWithAmPm}
                    </p>
                  </div>
                </div>

                {/* Seats and Total */}
                <div className="border-t border-gray-600 pt-3">
                  <p className="text-gray-300 text-sm mb-2">
                    Seats:{" "}
                    <span className="text-white font-medium">
                      {displayData.selectedSeats
                        ?.map((seat) => seat.seatNumber || seat.number)
                        .join(", ")}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm">
                    Total:{" "}
                    <span className="text-primary font-semibold text-lg">
                      ₹{displayData.finalTotal}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowShareDialog(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Share Your Booking
                </button>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>

          {/* Share Dialog */}
          <ShareDialog 
            isOpen={showShareDialog}
            onClose={() => setShowShareDialog(false)}
            bookingData={displayData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-18 px-6 pb-10">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mt-6 bg-gray-800 rounded-lg p-4 mb-6 flex">
            <button
              onClick={() =>
                handleNavigationAttempt(() =>
                  navigate(`/movies/${movie?.id}/seat-selection`)
                )
              }
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer mr-2 "
            >
              <ArrowLeftIcon className="w-5 h-5 text-white " />
            </button>
            {/* Progress Steps */}
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

              {/* Step 2: Select Seats */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
                  ✓
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Select Seats</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="flex-1 h-px bg-primary mx-4"></div>

              {/* Step 3: Payment (Current) */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium animate-pulse">
                  3
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-primary">Payment</p>
                  <p className="text-xs text-gray-400">In Progress</p>
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
                  <span className="text-xs text-gray-400">Movie</span>
                </div>

                <div className="w-6 h-px bg-primary"></div>

                <div className="flex items-center flex-col gap-0.5">
                  <div className="w-6 h-6 bg-primary text-white rounded-full text-xs font-medium flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-xs text-gray-400">Seats</span>
                </div>

                <div className="w-6 h-px bg-primary"></div>

                <div className="flex items-center flex-col gap-0.5">
                  <div className="w-6 h-6 bg-primary text-white rounded-full text-xs font-medium flex items-center justify-center animate-pulse">
                    3
                  </div>
                  <span className="text-xs text-primary">Pay</span>
                </div>

                <div className="w-6 h-px bg-gray-600"></div>

                <div className="flex items-center flex-col gap-0.5">
                  <div className="w-6 h-6 bg-gray-600 text-gray-400 rounded-full text-xs font-medium flex items-center justify-center">
                    4
                  </div>
                  <span className="text-xs text-gray-400">Done</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning about page refresh */}
          <div className="mt-4 p-3 bg-red-900/30 border border-red-600 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <XCircleIcon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">
                <strong>Warning:</strong> Do not refresh or close this page
                during payment. Your transaction will be cancelled and you'll
                need to start over.
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Payment Details
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-4">
                  Select Payment Method
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/20 text-white"
                        : "border-gray-600 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    <CreditCardIcon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm">Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      paymentMethod === "upi"
                        ? "border-primary bg-primary/20 text-white"
                        : "border-gray-600 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    <div className="w-6 h-6 mx-auto mb-2 bg-orange-500 rounded"></div>
                    <span className="text-sm">UPI</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("wallet")}
                    className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      paymentMethod === "wallet"
                        ? "border-primary bg-primary/20 text-white"
                        : "border-gray-600 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    <div className="w-6 h-6 mx-auto mb-2 bg-green-500 rounded"></div>
                    <span className="text-sm">Wallet</span>
                  </button>
                </div>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === "upi" && (
                <div>
                  {/* <label className="block text-gray-300 text-sm font-medium mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="username@paytm"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                  /> */}

                  <p className="text-center">
                    UPI payment is currently not available
                  </p>
                </div>
              )}

              {/* Wallet Payment */}
              {paymentMethod === "wallet" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-300">
                    Wallet payment is currently not available
                  </p>
                </div>
              )}

              {/* Error Message */}
              {paymentError && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-2">
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                  <span className="text-red-300 text-sm">{paymentError}</span>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-white font-medium">Secure Payment</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Your payment information is encrypted and secure. This is a
                  mock payment gateway for demonstration purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
              <div className="flex items-center gap-8 justify-start mb-4 ">
                <h3 className="text-lg font-semibold text-white ">
                  Booking Summary
                </h3>

                <span className="font-mono text-md flex items-center gap-1 ">
                  <ClockIcon className="w-6 h-6 " />
                  {formatTime(timeLeft)}
                </span>
              </div>
              {/* Movie Details */}
              {movie && (
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <div className="flex gap-3">
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-16 h-20 rounded object-cover"
                    />
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
                </div>
              )}

              {/* Selected Seats */}
              <div className="mb-4 pb-4 border-b border-gray-700">
                <h4 className="font-medium text-white mb-2">Selected Seats</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedSeats?.map((seat, index) => (
                    <span
                      key={index}
                      className="bg-primary px-2 py-1 rounded text-xs text-white"
                    >
                      {seat.seatNumber || seat.number}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>{selectedSeats?.length} Seats </span>
                  <span>₹{seatTotal}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-gray-300">
                    <span className="flex items-center gap-2">
                      Convenience Fee
                      <svg
                        className={`w-4 h-4 text-white transition-transform cursor-pointer ${
                          isOpenConvenince ? "rotate-180" : ""
                        }`}
                        onClick={() => setIsOpenConvenince((prev) => !prev)}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  {isOpenConvenince && (
                    <div className="bg-gray-900/30 bg-opac p-2 space-y-2">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Base</span>
                        <span>₹{base}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Taxes (GST 18%)</span>
                        <span>₹{taxes}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-lg font-bold text-white border-t border-gray-600 pt-2">
                  <span>Total</span>
                  <span className="text-primary">₹{finalTotal}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                  isProcessing
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white hover:scale-105"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ₹${finalTotal}`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Custom Exit Warning Dialog */}
        {showExitWarning && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <XCircleIcon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Leave Payment?
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Your payment session will be cancelled
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 text-sm">
                  Are you sure you want to leave this page? Your current payment
                  session will be cancelled and you'll need to start the booking
                  process again.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelExit}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Stay & Continue
                </button>
                <button
                  onClick={confirmExit}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Yes, Leave
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timer Timeout Dialog */}
        {showTimeoutDialog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Time's Up!
                  </h3>
                  <p className="text-gray-400 text-sm">Session Expired</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 text-sm">
                  Your payment session has expired due to inactivity. For
                  security reasons, you'll need to start the booking process
                  again.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleTimeoutBrowseMovies}
                  className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors cursor-pointer font-semibold"
                >
                  Browse Movies
                </button>
                <button
                  onClick={handleTimeoutGoHome}
                  className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Refresh Warning Dialog */}
        {showRefreshWarning && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <XCircleIcon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Warning!</h3>
                  <p className="text-gray-400 text-sm">
                    Transaction will be cancelled
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 text-sm">
                  Refreshing this page will cancel your transaction and you'll
                  lose your selected seats. Do not refresh the page during
                  payment processing.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRefreshCancel}
                  className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors cursor-pointer font-semibold"
                >
                  Stay on Page
                </button>
                <button
                  onClick={handleRefreshConfirm}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Confirm Refresh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
