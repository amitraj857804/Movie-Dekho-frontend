import { PlayIcon } from "@heroicons/react/24/solid";
import { selectAllMovies } from "../../components/store/movieSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Trailer from "../../components/Trailer";
import MovieCard from "../../components/MovieCard";

const TrendingMovies = () => {
  const navigate = useNavigate();
  const trendingMovies = useSelector(selectAllMovies);

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 custom-scrollbar">
          {trendingMovies.map((movie) => (
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
