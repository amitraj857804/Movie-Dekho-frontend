import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllMovies, selectMoviesLoading, selectMoviesError } from '../components/store/movieSlice';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useMovies } from '../hooks/useMovies';
import MovieCard from '../components/MovieCard';
import { useAuthModalContext } from '../hooks/useAuthModalContext';
import AuthModal from '../components/auth/AuthModal';

function Movies() {
  const allMovies = useSelector(selectAllMovies);
  const isLoading = useSelector(selectMoviesLoading);
  const error = useSelector(selectMoviesError);
  
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    switchAuthTab,
  } = useAuthModalContext();

  // Use custom hooks for smart fetching and scrolling
  useScrollToTop();
  const { refetch } = useMovies();

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

  // Sort movies by release date (newest first)
  const movies = allMovies
    .slice() // Create a copy to avoid mutating original array
    .sort((a, b) => {
      const dateA = parseDate(a.releaseDate);
      const dateB = parseDate(b.releaseDate);
      return dateB.getTime() - dateA.getTime(); // Newest first
    });

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6 sm:pb-20 pb-14">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white sm:text-primary text-center bg-gray-800 rounded-lg p-2 mb-6 ">
          All Movies
        </h1>
        
        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl text-red-400 mb-4">Unable to Load Movies</h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <button 
                onClick={refetch}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && !error && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl text-gray-400 mb-4">Loading movies...</h2>
            <p className="text-gray-500">Please wait while we fetch the latest movies</p>
          </div>
        )}
        
        {/* Movies Grid */}
        {!isLoading && !error && movies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                showFavoriteButton={true}
              />
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && movies.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl text-gray-400 mb-4">No Movies Available</h2>
              <p className="text-gray-500 mb-4">There are currently no movies in our database.</p>
              <button 
                onClick={refetch}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        activeTab={authModalTab}
        onTabChange={switchAuthTab}
      />
    </div>
  )
}

export default Movies