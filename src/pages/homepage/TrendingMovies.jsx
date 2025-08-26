import { PlayIcon } from "@heroicons/react/24/solid";
import { selectAllMovies } from "../../components/store/movieSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Trailer from "../../components/Trailer";
import MovieCard from "../../components/MovieCard";

const TrendingMovies = () => {
  const navigate = useNavigate();
  const allMovies = useSelector(selectAllMovies);

  // Function to parse date (handles both array and string formats)
  const parseDate = (dateString) => {
    if (!dateString) return new Date(0); // Default to epoch if no date
    
    if (Array.isArray(dateString)) {
      // Handle [year, month, day] format
      return new Date(dateString[0], dateString[1] - 1, dateString[2]);
    } else {
      // Handle string format
      return new Date(dateString);
    }
  };

  // Sort movies by release date (newest first) and take only first 5
  const latestMovies = allMovies
    .slice() // Create a copy to avoid mutating original array
    .sort((a, b) => {
      const dateA = parseDate(a.releaseDate);
      const dateB = parseDate(b.releaseDate);
      return dateB.getTime() - dateA.getTime(); // Newest first
    })
    .slice(0, 5); // Take only first 5 movies

  return (
    <section className="py-16 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Latest Releases
          </h2>
          <button
            onClick={() => navigate("/movies")}
            className="text-primary hover:text-primary/80 font-semibold transition-colors duration-300 cursor-pointer"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 custom-scrollbar">
          {latestMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              showFavoriteButton={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingMovies;
