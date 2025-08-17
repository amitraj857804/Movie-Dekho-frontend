import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { MapPinIcon } from "@heroicons/react/24/outline";
import { selectAllMovies } from "./store/movieSlice";
import { setBookingData, setBookingStep } from "./store/bookingSlice";

function BookTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movies = useSelector(selectAllMovies);
  const movie = movies.find((m) => m.id === parseInt(id));
  const [movieSlots, setMovieSlots] = useState(movie?.slots || []);

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Extract unique dates from movieSlots and sort them chronologically
  const getAvailableDates = () => {
    if (!movieSlots || movieSlots.length === 0) {
      return [];
    }

    const uniqueDates = new Map();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    movieSlots.forEach((slot) => {
      if (slot.showDate) {
        // Create a proper date object for sorting
        const dateObj = new Date(slot.showDate);

        const fullDate = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD format

        if (!uniqueDates.has(fullDate)) {
          uniqueDates.set(fullDate, {
            date: dateObj.getDate().toString().padStart("2", "0"),
            monthName: monthNames[dateObj.getMonth()],
            dayName: dayNames[dateObj.getDay()],
            fullDate: fullDate,
            sortDate: dateObj.getTime(),
          });
        }
      }
    });

    // Convert to array and sort by date
    return Array.from(uniqueDates.values()).sort(
      (a, b) => a.sortDate - b.sortDate
    );
  };

  const dates = getAvailableDates();

  // Auto-select the first available date when dates are loaded
  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].date);
    }
  }, [dates, selectedDate]);

  // Function to get showtimes for selected date grouped by theater
  const getShowtimesForDate = (selectedDate) => {
    if (!movieSlots || !selectedDate) {
      return [];
    }

    // Find the matching date object from our available dates
    const selectedDateObj = dates.find((d) => d.date === selectedDate);

    if (!selectedDateObj) {
      return [];
    }

    // Match with movie slots using the same date format
    const matchingSlots = movieSlots.filter((slot) => {
      if (!slot.showDate) {
        return false;
      }
      return slot.showDate === selectedDateObj.fullDate;
    });

    // Group slots by theater name
    const theaterGroups = {};

    matchingSlots.forEach((slot) => {
      const theaterName = slot.theaterName || "Cinema Name";

      if (!theaterGroups[theaterName]) {
        theaterGroups[theaterName] = {
          theaterName: theaterName,
          location: slot.location || slot.address || "Location",
          showtimes: [],
          slots: [],
        };
      }
      
      // Add showtimes from this slot
      if (slot.startTime) {
        const hr =
          slot.startTime.split(":")[0] > 12
            ? (slot.startTime.split(":")[0] - 12).toString().padStart(2, "0")
            : slot.startTime.split(":")[0].padStart(2, "0");
        const min = slot.startTime.split(":")[1].padStart(2, "0");
        theaterGroups[theaterName].showtimes.push({
          time: `${hr} : ${min}`,
          amPm: slot.startTime.split(":")[0] > 12 ? " PM" : " AM",
          slotId: slot.slotId,
          slot: slot,
          sortTime: slot.startTime[0] * 60 + slot.startTime[1], // For proper sorting
        });
      }

      theaterGroups[theaterName].slots.push(slot);
    });

    // Sort showtimes for each theater chronologically
    Object.values(theaterGroups).forEach((theater) => {
      theater.showtimes.sort((a, b) => a.sortTime - b.sortTime);
    });

    return Object.values(theaterGroups);
  };

  const selectedDateShowtimes = getShowtimesForDate(selectedDate);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Clear previous selections when date changes
    setSelectedTime("");
    setSelectedCinema("");
  };

  const handleTimeSelect = (time, slot, amPm) => {
    setSelectedTime(time);
    setSelectedCinema(slot);

    // Get the selected date object for complete date information
    const selectedDateObj = dates.find((d) => d.date === selectedDate);

    // Store booking data in Redux
    const bookingData = {
      movie,
      selectedDateObj: selectedDateObj, // Complete date object with day, month, year
      selectedTimeWithAmPm: `${time}${amPm}`, // Full time with AM/PM
      selectedCinema: slot,
    };

    dispatch(setBookingData(bookingData));
    dispatch(setBookingStep('seat-selection'));

    // Navigate to seat selection (no state needed now)
    navigate(`/movies/${id}/seat-selection`);
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Movie Not Found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition-colors duration-300"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 px-6 py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-gray-800 rounded-lg p-6">
          {/* Step 1: Select Date */}

          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              Select Date
            </h2>
            {dates.length > 0 ? (
              <div className="grid grid-cols-5 gap-4 sm:w-[35%]">
                {dates.map((dateObj) => (
                  <button
                    key={dateObj.fullDate}
                    onClick={() => handleDateSelect(dateObj.date)}
                    className={`p-2 h-20 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      selectedDate === dateObj.date
                        ? "border-primary bg-primary text-white shadow-lg "
                        : "border-gray-600 bg-gray-700 text-white hover:border-primary/50 hover:bg-gray-600"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`text-sm ${
                          selectedDate === dateObj.date
                            ? "opacity-90"
                            : "opacity-75"
                        }`}
                      >
                        {dateObj.dayName}
                      </div>
                      <div className="font-semibold">{dateObj.date}</div>
                      <div
                        className={`text-sm ${
                          selectedDate === dateObj.date
                            ? "opacity-90"
                            : "opacity-75"
                        }`}
                      >
                        {dateObj.monthName}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-400">No show dates available</p>
                <p className="text-sm text-gray-500 mt-1">
                  Please check back later
                </p>
              </div>
            )}
          </div>

          {/* Showtimes for Selected Date */}
          {selectedDate && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Available Shows for {selectedDate}{" "}
                {dates.find((d) => d.date === selectedDate)?.monthName}
              </h2>

              {selectedDateShowtimes.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateShowtimes.map((theater, index) => (
                    <div
                      key={theater.theaterName + index}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex  items-start mb-3 sm:gap-20 gap-2">
                        <div className="w-[40%] sm:w-[20%]">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {theater.theaterName}
                          </h3>
                          <p className="text-gray-400 flex items-center   ">
                            <MapPinIcon className="w-4 h-4" />
                            {theater.location}
                          </p>
                        </div>
                        {/* Show Times */}
                        <div className="">
                          <div className="flex items-start flex-wrap gap-2">
                            {theater.showtimes.length > 0 ? (
                              theater.showtimes.map((showtime, timeIndex) => (
                                <button
                                  key={timeIndex}
                                  onClick={() =>
                                    handleTimeSelect(
                                      showtime.time,
                                      showtime.slot,
                                      showtime.amPm
                                    )
                                  }
                                  className={`px-3 py-2 rounded-lg border transition-all duration-300 cursor-pointer text-xs ${
                                    selectedTime === showtime.time &&
                                    selectedCinema?.slotId === showtime.slotId
                                      ? "border-primary bg-primary text-white"
                                      : "border-gray-500 bg-gray-600 text-white  hover:bg-primary"
                                  }`}
                                >
                                  {showtime.time}
                                  {showtime.amPm}
                                </button>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No showtimes available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-700 rounded-lg p-6 text-center">
                  <p className="text-gray-400">
                    No shows available for this date
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Please select another date
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookTicket;
