import { selectAllMovies } from "../../components/store/movieSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../components/MovieCard";

const TrendingMovies = ({ headingText, showMoreMovies }) => {
  const navigate = useNavigate();
  const allMovies = useSelector(selectAllMovies);

  // Function to parse date (handles both array and string formats)
  const parseDate = (dateString) => {
    if (!dateString) return new Date(0);

    if (Array.isArray(dateString)) {
      return new Date(dateString[0], dateString[1] - 1, dateString[2]);
    } else {
      return new Date(dateString);
    }
  };

  // Single function to process movies with proper error handling
  const getLatestMovies = (movies) => {
    if (!movies || !Array.isArray(movies) || movies.length === 0) {
      return [];
    }

    return movies
      .slice() // Create copy
      .filter((movie) => movie && movie.releaseDate) // Remove invalid movies
      .sort((a, b) => {
        const dateA = parseDate(a.releaseDate);
        const dateB = parseDate(b.releaseDate);

        // Handle invalid dates
        const timeA = dateA.getTime();
        const timeB = dateB.getTime();

        if (isNaN(timeA) && isNaN(timeB)) return 0;
        if (isNaN(timeA)) return 1; // Put invalid dates at end
        if (isNaN(timeB)) return -1;

        return timeB - timeA; // Newest first
      })
      .slice(0, 5);
  };

  // Use the function with proper fallback
  const latestMovies = getLatestMovies(showMoreMovies || allMovies);

  return (
    <section className="py-16 bg-gray-900/50">
      <div className={`container mx-auto ${headingText? "px-2" : "px-6"} `}>
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {headingText || "Latest Releases"}
          </h2>
          <button
            onClick={() => navigate("/movies")}
            className="text-primary hover:!text-white font-semibold transition-colors duration-300 cursor-pointer"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 custom-scrollbar">
          {latestMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} showFavoriteButton={true} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingMovies;
