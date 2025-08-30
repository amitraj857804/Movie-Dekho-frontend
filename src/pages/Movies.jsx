import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllMovies, fetchAllMovies } from '../components/store/movieSlice';
import { useScrollToTop } from '../hooks/useScrollToTop';
import MovieCard from '../components/MovieCard';
import { useAuthModalContext } from '../hooks/useAuthModalContext';
import AuthModal from '../components/auth/AuthModal';

function Movies() {
  const dispatch = useDispatch();
  const allMovies = useSelector(selectAllMovies);
  
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    switchAuthTab,
  } = useAuthModalContext();

  // Use custom hook for smooth scrolling to top
  useScrollToTop();

  useEffect(() => {
    if (allMovies.length === 0) {
      dispatch(fetchAllMovies());
    }
  }, [dispatch, allMovies.length]);

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
        
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                showFavoriteButton={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl text-gray-400 mb-4">Loading movies...</h2>
            <p className="text-gray-500">Please wait while we fetch the latest movies</p>
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