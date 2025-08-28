import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";

import { selectAllMovies } from "../../components/store/movieSlice";
import { useSelector } from "react-redux";
import Trailer from "../../components/Trailer";
import { useNavigate } from "react-router-dom";

const MovieCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  // Get last 5 movies for carousel
  const AllMovies = useSelector(selectAllMovies);
  const movies = AllMovies.slice(0,5)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  }, [movies.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality - stop when trailer is open
  useEffect(() => {
    if (!isAutoPlaying || showTrailer) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, showTrailer, nextSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const currentMovie = movies[currentIndex];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    // Handle LocalDate format from Spring Boot (e.g., "2025-07-29" or [2025, 7, 29])
    let date;

    // If it's an array format [year, month, day], convert to Date
    if (Array.isArray(dateString)) {
      date = new Date(dateString[0], dateString[1] - 1, dateString[2]); // month is 0-indexed
    } else {
      date = new Date(dateString);
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let release_date;
  if (movies && currentMovie) {
    release_date = formatDate(currentMovie.releaseDate);
  }

  return (
    <div
      className="relative w-full h-[70vh] md:h-[70vh] lg:h-[85vh] overflow-hidden rounded-xl shadow-2xl pt-10 "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Images with Smooth Transition */}
      <div className="absolute inset-0">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full h-full object-top object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-2">
          <div className="max-w-2xl">
            {/* Movie Title with Animation */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-fade-in">
              {currentMovie?.title}
            </h1>

            {/* Movie Details */}
            <div className="flex items-center gap-4 mb-4 text-sm md:text-base">
              <span className="bg-black/90 lg:bg-white/20 lg:border border-gray-300/30 backdrop-blur-sm px-2.5 rounded-md ">
                {currentMovie?.certification}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-300">{release_date}</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-300">{currentMovie?.duration}</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentMovie?.genre?.split(",").map((genre,index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Movie Overview */}
            <p className="text-gray-200 text-lg leading-relaxed mb-8 line-clamp-3">
              {currentMovie?.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
              onClick={()=> navigate(`/movies/${currentMovie.id}`)}
               className="flex items-center justify-center gap-3 cursor-pointer bg-primary hover:bg-primary/90   backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105">
                Book Now
              </button>
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center justify-center gap-3 cursor-pointer bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <PlayIcon className="w-6 h-6" />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm cursor-pointer"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm cursor-pointer"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? "bg-primary scale-145"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{
            width: `${((currentIndex + 1) / movies.length) * 100}%`,
          }}
        />
      </div>

      <Trailer
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        movie={currentMovie}
      />
    </div>
  );
};

export default MovieCarousel;
