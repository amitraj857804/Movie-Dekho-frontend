import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavoriteMovies,
  selectFavoriteMovies,
  selectFavoritesLoading,
  selectFavoritesError,
  selectFavoritesActionLoading,
  clearAllFavorites,
} from "../components/store/favoritesSlice";
import { selectToken } from "../components/store/authSlice";
import { useAuthModalContext } from "../hooks/useAuthModalContext";
import MovieCard from "../components/MovieCard";
import AuthModal from "../components/auth/AuthModal";
import { useNavigate } from "react-router-dom";

function Favorite() {
  const dispatch = useDispatch();
  const favoriteMovies = useSelector(selectFavoriteMovies);
  const loading = useSelector(selectFavoritesLoading);
  const actionLoading = useSelector(selectFavoritesActionLoading);
  const error = useSelector(selectFavoritesError);
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  const {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    switchAuthTab,
  } = useAuthModalContext();

  useEffect(() => {
    // Only fetch favorites once when component mounts and user is logged in
    if (token && favoriteMovies.length === 0) {
      dispatch(fetchFavoriteMovies());
    }
  }, [dispatch, token, favoriteMovies.length]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);


  // Close auth modal when user successfully logs in
  useEffect(() => {
    if (token && isAuthModalOpen) {
      closeAuthModal();
    }
  }, [token, isAuthModalOpen, closeAuthModal]);

  const handleClearAllFavorites = async () => {
    try {
      await dispatch(clearAllFavorites()).unwrap();
    } catch (error) {
      console.error("Error clearing all favorites:", error);
      // Could show a toast notification here
    }
  };

  if (!token) {
    return (
      <>
        <div className="min-h-screen bg-gray-900 pt-20 px-6">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white  sm:text-primary text-center bg-gray-800 rounded-lg p-2  mb-8">
              My Favorites
            </h1>
            <div className="text-center py-16">
              <h2 className="text-xl text-gray-400 mb-4">Please Login</h2>
              <p className="text-gray-500 mb-6">
                You need to be logged in to view your favourite movies
              </p>
              <button
                onClick={() => openAuthModal("login")}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full transition-colors duration-300 font-semibold cursor-pointer"
              >
                Login to View Favorites
              </button>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          activeTab={authModalTab}
          onTabChange={switchAuthTab}
        />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            My Favourites
          </h1>
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl text-gray-400 mb-4">
              Loading favourites...
            </h2>
            <p className="text-gray-500">
              Please wait while we fetch your favourite movies
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            My Favourites
          </h1>
          <div className="text-center py-16">
            <h2 className="text-xl text-red-400 mb-4">
              Failed to load Favourites
            </h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchFavoriteMovies())}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition-colors duration-300 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 pt-20 px-6 py-16">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold  text-white sm:text-primary text-center bg-gray-800 rounded-lg p-2 mb-6">
            My Favourites
          </h1>

          {favoriteMovies.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-400">
                  You have {favoriteMovies.length} favourite movie
                  {favoriteMovies.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {favoriteMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showFavoriteButton={true}
                  />
                ))}
              </div>
              <div className="flex justify-end">

           
              <button
                onClick={handleClearAllFavorites}
                disabled={actionLoading}
                className={`text-xl  bottom-0 sm:mb-2 -mb-6 font-semibold cursor-pointer mt-5 transition-all duration-300 ${
                  actionLoading
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-primary hover:!text-white"
                }`}
              >
                {actionLoading ? "Removing..." : "Remove all"}
              </button>
                 </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                {/* Heart icon */}
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-800/50">
                  <svg
                    className="w-12 h-12 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl text-gray-400 mb-4">
                  No favourites yet
                </h2>
                <p className="text-gray-500 mb-6">
                  Start adding movies to your favourites by clicking the heart
                  icon on any movie you love!
                </p>
                <button
                  onClick={() => navigate("/movies")}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full transition-colors duration-300 font-semibold cursor-pointer"
                >
                  Browse Movies
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        activeTab={authModalTab}
        onTabChange={switchAuthTab}
      />
    </>
  );
}

export default Favorite;
