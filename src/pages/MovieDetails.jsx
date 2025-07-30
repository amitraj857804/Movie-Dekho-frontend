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
  FilmIcon
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
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const movies = useSelector(selectAllMovies);
  const movie = movies.find((m) => m.id === parseInt(id));

  // Fetch movies if not available in store
  useEffect(() => {
    const loadMovies = async () => {
      if (movies.length === 0) {
        console.log("Fetching movies data...");
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
  }, [id, isLoading]); // Runs when component mounts, movie ID changes, or loading state changes

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
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-[80%] md:h-80 xl:h-125  rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Movie Information */}
            <div className="lg:col-span-2 space-y-2">
              <div>
                <h3 className="text-4xl font-bold text-white mb-4">
                  {movie.title.toUpperCase()}
                </h3>

                <div className="mb-4">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {getDisplayDescription()}
                    {movie.description && movie.description.length > 100 && (
                      <button
                        onClick={toggleDescription}
                        className="mt-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors duration-300 cursor-pointer"
                      >
                        {isExpanded ? ".Read Less" : "Read More"}
                      </button>
                    )}
                  </p>
                </div>
              </div>

              {/* Movie Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-white">
                    Movie Information
                  </h4>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      <span className="text-gray-400">Release Date:</span>
                      <span className="text-white">
                        {formatDate(movie.releaseDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FilmIcon className="w-5 h-5 text-primary" />
                      <span className="text-gray-400">Genre:</span>
                      <span className="text-white">
                        {movie.genre.split(",")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-5 h-5 text-primary" />
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">
                        {movie.duration || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <LanguageIcon className="w-5 h-5 text-primary" />
                      <span className="text-gray-400">Language:</span>
                      <span className="text-white">
                        {movie.language || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-white">
                    Certification
                  </h4>
                  <div className="inline-block bg-gray-800 px-2 py-1 rounded-lg border border-gray-600">
                    <span className="text-white font-semibold text-md">
                      {movie.certification || "Not Rated"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-6">
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
                <button
                  onClick={() => handleWatchTrailer(movie)}
                  className=" w-[75%] flex items-center justify-center gap-3 cursor-pointer text-lg bg-white hover:bg-white/80 backdrop-blur-sm text-gray-800 px-2 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300 transform  shadow-lg"
                >
                  <PlayIcon className="w-6 h-6" />
                  Watch Trailer
                </button>
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
