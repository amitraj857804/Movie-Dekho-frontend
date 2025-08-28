import { useAuthModalContext } from "../../hooks/useAuthModalContext";
import MovieCarousel from "./MovieCarousel";
import TrendingMovies from "./TrendingMovies";
import AuthModal from "../../components/auth/AuthModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMovies, selectAllMovies } from "../../components/store/movieSlice";
import { selectToken } from "../../components/store/authSlice";
import { fetchFavoriteMovies } from "../../components/store/favoritesSlice";

function Home() {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    switchAuthTab,
  } = useAuthModalContext();

  const dispatch = useDispatch();
  const fetchedMovies = useSelector(selectAllMovies);
  const token = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch movies on component mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        await dispatch(fetchAllMovies()).unwrap();
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we don't have movies already
    if (!fetchedMovies || fetchedMovies.length === 0) {
      loadMovies();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, fetchedMovies]);

  // Fetch favorites when user is logged in
  useEffect(() => {
    if (token) {
      dispatch(fetchFavoriteMovies());
    }
  }, [dispatch, token]);

  // Scroll to top after loading is complete
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [isLoading]); 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
         
        </div>
      </div>
    );
  }



  return (
    <div className={`min-h-screen bg-gray-900 custom-scrollbar `}>
      {/* Hero Section with Movie Carousel */}
      <section className="relative">
        <MovieCarousel />
      </section>

      {/* Trending Movies Section */}
      <TrendingMovies />

      {/* Additional content section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Welcome to CineBook
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Discover the latest movies, book your tickets, and enjoy an amazing
            cinematic experience. Our platform brings you the best of
            entertainment with seamless booking and exclusive offers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Latest Movies
              </h3>
              <p className="text-gray-400">
                Watch the newest releases in stunning quality
              </p>
            </div>

            <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Easy Booking
              </h3>
              <p className="text-gray-400">
                Book your seats with just a few clicks
              </p>
            </div>

            <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Best Experience
              </h3>
              <p className="text-gray-400">
                Premium sound and visual experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal - rendered via portal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        activeTab={authModalTab}
        onTabChange={switchAuthTab}
      />
    </div>
  );
}

export default Home;
