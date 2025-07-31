import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  PlayIcon,
  ClockIcon,
  CalendarIcon,
  LanguageIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  FilmIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import {
  selectAllMovies,
  fetchAllMovies,
} from "../components/store/movieSlice";
import Trailer from "../components/Trailer";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState("movieDetails"); // Track active tab

  const movies = useSelector(selectAllMovies);
  const movie = movies.find((m) => m.id === parseInt(id));

  // Fetch movies if not available in store
  useEffect(() => {
    const loadMovies = async () => {
      if (movies.length === 0) {
        
        try {
          await dispatch(fetchAllMovies()).unwrap();
        } catch (error) {
          console.error("Error fetching movies:", error);
        }
      }
      setIsLoading(false);
    };

    loadMovies();
  }, [dispatch, movies.length]);

  // Scroll to top after loading is complete or when movie ID changes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [id, isLoading]);

  // Track mobile view based on window size
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 640); // 640px is the 'sm' breakpoint in Tailwind
    };

    // Set initial state
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobileView);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);
 

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-white mb-2">
            Loading Movie Details...
          </h1>
          <p className="text-gray-400">
            Please wait while we fetch the movie information.
          </p>
        </div>
      </div>
    );
  }

  // Handle case where movie is not found after loading
  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Movie Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            The movie you're looking for doesn't exist.
          </p>
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    let date;
    if (Array.isArray(dateString)) {
      date = new Date(dateString[0], dateString[1] - 1, dateString[2]);
    } else {
      date = new Date(dateString);
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBookNow = () => {
    navigate(`/movies/${movie.id}/date-selection`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically make an API call to save the favorite status
  };

  const handleWatchTrailer = (movie) => {
    setShowTrailer(true);
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // Truncate description for preview
  const getDisplayDescription = () => {
    const description =
      movie.description || "No synopsis available for this movie.";
    if (isExpanded || description.length <= 100) {
      return description;
    }
    return description.slice(0, 100) + "...";
  };

  // Mobile View Layout
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-gray-900 ">
        {/* Mobile Hero Section with Image */}
        <div className="relative h-[40%] top-18">
          {/* Back Button - Above Image */}
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 font-extrabold text-white p-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 backdrop-blur-md bg-black/30"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Watch Trailer Button - Center of Image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() => handleWatchTrailer(movie)}
              className="flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-gray-800 px-4 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 transform shadow-2xl"
            >
              <PlayIcon className="w-8 h-8 flex-shrink-0" />
            </button>
          </div>

          {/* Full Width Movie Image */}
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="w-full h-[380px]  object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

          {/* Movie Title - Bottom of Image */}
          <div className="absolute bottom-0 left-4 right-4 z-20">
            <h1 className="text-3xl font-bold text-white  drop-shadow-lg">
              {movie.title.toUpperCase()}
            </h1>
            <div className="flex items-center gap-4 mb-1">
              <span className="text-white">{movie.duration || "N/A"}</span>
              <span className="text-white">{movie.genre.split(",")[0]}</span>
              <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg bg-gray-800/80 backdrop-blur-sm">
                {movie.certification || "Not Rated"}
              </span>
            </div>
            <div className="absolute flex bottom-2 right-3 gap-2">
              <button
                onClick={toggleFavorite}
                className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white p-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm border border-white/20"
              >
                {isFavorite ? (
                  <HeartIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartOutline className="w-5 h-5" />
                )}
              </button>

              <button className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white p-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm border border-white/20">
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 mt-19 flex gap-10 font-bold text-xl text-primary/80">
          <span 
            className={`cursor-pointer transition-all duration-300 relative ${
              activeTab === "bookTicket" 
                ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-white after:via-primary after:to-orange-500 after:rounded-full after:-mb-1 text-white" 
                : "hover:text-white"
            }`}
            onClick={() => setActiveTab("bookTicket")}
          >
            Book Ticket
          </span>
          <span 
            className={`cursor-pointer transition-all duration-300 relative ${
              activeTab === "movieDetails" 
                ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-white after:via-primary after:to-orange-500 after:rounded-full after:-mb-1 text-white" 
                : "hover:text-white"
            }`}
            onClick={() => setActiveTab("movieDetails")}
          >
            Movie Details
          </span>
        </div>
        {/* Mobile Movie Information Section */}
        <div className=" px-4 py-6 ">
          {/* Conditional Content Based on Active Tab */}
          {activeTab === "movieDetails" && (
            <>
             <h1 className="text-xl font-bold text-white  drop-shadow-lg mb-1">
              {movie.title.toUpperCase()}
            </h1>
            <span className="text-white mr-3 ">{movie.duration || "N/A"}</span>
            <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg bg-gray-800/80 backdrop-blur-sm">
                {movie.certification || "Not Rated"}
              </span>
              {/* Description */}
              <div className="my-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                
                  {movie.description }
                </p>
              </div>

              {/* Movie Details */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">Release Date:</span>
                    <span className="text-white">
                      {formatDate(movie.releaseDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FilmIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">Genre:</span>
                    <span className="text-white">{movie.genre.split(",")[0]}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{movie.duration || "N/A"}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <LanguageIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">Language:</span>
                    <span className="text-white">{movie.language || "N/A"}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "bookTicket" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Book Your Tickets</h3>
              
              {/* Ticket Booking Content */}
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Select Show Time</h4>
                  <p className="text-gray-400 text-sm">Choose your preferred showtime and book tickets.</p>
                </div>
                
                <button
                  onClick={handleBookNow}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  Proceed to Book Tickets
                </button>
                
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Select your seats and complete your booking
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trailer Modal */}
        <Trailer
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          movie={movie}
        />
      </div>
    );
  }

  // Desktop View Layout
  return (
    <div className="min-h-screen bg-gray-900 ">
      <div className="bg-gradient-to-b  from-gray-800 via-gray-700 to-red-800/30 w-[100%] px-6 pt-30 pb-10">
        <div className="container mx-auto px-12 ">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 font-extrabold text-white p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 backdrop-blur-sm "
            >
              <ArrowLeftIcon className="w-6 h-6" />
              Back
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="md:w-[70%] lg:w-[80%] md:h-80 xl:h-125  rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Movie Information */}
            <div className="lg:col-span-2 md:col-span-1 lg:space-y-2 xl:space-y-4 md:w-[100%] md:-ml-16 lg:-ml-4">
              <h3 className="text-4xl font-bold text-white mb-4">
                {movie.title.toUpperCase()}
              </h3>

              <div className="mb-4">
                <p className="text-gray-300 sm:text-sm xl:text-xl sm:leading-tight xl:leading-relaxed">
                  {getDisplayDescription()}
                  {movie.description && movie.description.length > 100 && (
                    <button
                      onClick={toggleDescription}
                      className="  text-primary z-50 relative hover:text-primary/80 font-semibold text-sm transition-colors duration-300 cursor-pointer"
                    >
                      {isExpanded ? ".Read Less" : "Read More"}
                    </button>
                  )}
                </p>
              </div>

              {/* Movie Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-45 lg:gap-6 xl:mt-8">
                <div className="sm:space-y-2 xl:space-y-6">
                  <h4 className="text-xl font-semibold text-white">
                    Movie Information
                  </h4>

                  <div className="space-y-1 md:col-span-1 md:space-y-0 lg:space-y-1 xl:space-y-4">
                    <div className="flex items-center gap-3 flex-nowrap">
                      <CalendarIcon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-400 whitespace-nowrap">
                        Release Date:
                      </span>
                      <span className="text-white whitespace-nowrap">
                        {formatDate(movie.releaseDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-nowrap">
                      <FilmIcon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-400 whitespace-nowrap">
                        Genre:
                      </span>
                      <span className="text-white whitespace-nowrap">
                        {movie.genre.split(",")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-nowrap">
                      <ClockIcon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-400 whitespace-nowrap">
                        Duration:
                      </span>
                      <span className="text-white whitespace-nowrap">
                        {movie.duration || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-nowrap">
                      <LanguageIcon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-400 whitespace-nowrap">
                        Language:
                      </span>
                      <span className="text-white whitespace-nowrap">
                        {movie.language || "N/A"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleWatchTrailer(movie)}
                      className="w-[75%] flex items-center justify-center gap-3 mt-6 xl:mt-14 cursor-pointer text-lg bg-white hover:bg-white/80 backdrop-blur-sm text-gray-800 jg:px-2 md:px-28 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300 transform shadow-lg"
                    >
                      <PlayIcon className="w-6 h-6 flex-shrink-0" />
                      <span className="whitespace-nowrap">Watch Trailer</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 xl:space-y-6">
                  <h4 className="text-xl font-semibold text-white">
                    Certification
                  </h4>
                  <div className="inline-block   ">
                    <span className="text-white font-semibold text-md px-2 py-1 rounded-lg bg-gray-800 border-gray-600">
                      {movie.certification || "Not Rated"}
                    </span>
                    <div className="flex gap-4 lg:mt-6 md:mt-12 xl:mt-18">
                      <button
                        onClick={toggleFavorite}
                        className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm border border-white/20"
                      >
                        {isFavorite ? (
                          <HeartIcon className="w-4 h-4 text-red-500" />
                        ) : (
                          <HeartOutline className="w-4 h-4" />
                        )}
                      </button>

                      <button className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm border border-white/20">
                        <ShareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <Trailer
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        movie={movie}
      />
    </div>
  );
}

export default MovieDetails;
