import { PlayIcon } from "@heroicons/react/24/solid";
import { selectAllMovies } from "../../components/store/movieSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Trailer from "../../components/Trailer";

const TrendingMovies = () => {
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  const trendingMovies = useSelector(selectAllMovies);

  const handleWatchTrailer = (movie) => {
    setSelectedMovie(movie);
    console.log(movie);
    setShowTrailer(true);
  };

  return (
    <section className="py-16 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Latest Releases
          </h2>
          <button
          onClick={()=>navigate("/movies")}
          className="text-primary hover:text-primary/80 font-semibold transition-colors duration-300 cursor-pointer">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 custom-scrollbar">
          {trendingMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-full  md:h-70 xl:h-115 object-cover transition-transform duration-300 group-hover:scale-110 "
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-[30%] left-0 right-0 p-4 flex flex-col gap-3">
                    <button
                    onClick={()=> navigate(`/movies/${movie.id}`)}
                     className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-2 px-3 rounded-full transition-colors duration-300 font-semibold cursor-pointer">
                      Book Now
                    </button>
                    <button
                      onClick={() => handleWatchTrailer(movie)}
                      className=" w-full flex items-center justify-center gap-3 cursor-pointer text-lg bg-white hover:bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-full font-semibold  transition-all duration-300 transform  shadow-lg"
                    >
                      <PlayIcon className="w-6 h-6" />
                      Watch Trailer
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl my-2 line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex justify-between mb-2 ">
                  <span className="text-sm">{movie.duration}</span>
                  <span className="bg-white/20 backdrop-blur-sm px-2 text-sm rounded-md">
                    {movie.certification}
                  </span>
                </div>
                <span className="text-sm ">{`${
                  movie.language ? movie.language : "N/A"
                }`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Trailer
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        movie={selectedMovie}
      />
    </section>
  );
};

export default TrendingMovies;
