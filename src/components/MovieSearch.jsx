import { useState, useEffect, useRef, useCallback } from "react";
import { SearchIcon, XIcon, LoaderIcon } from "lucide-react";
import { searchMovies } from "../api/searchApi";
import MovieCard from "./MovieCard";
import { useNavigate } from "react-router-dom";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const MovieSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 500);

  // Focus on input when search opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Prevent background scrolling when search is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Handle search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
      setHasSearched(false);
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Perform search with abort controller
  const performSearch = useCallback(
    async (searchQuery) => {
      // Cancel previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const results = await searchMovies(searchQuery, {
          signal: abortControllerRef.current.signal,
        });

        // Only update state if the response is for the current query
        if (searchQuery === query) {
          setSearchResults(results);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to search movies. Please try again.");
          setSearchResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  // Handle movie card click
  const handleMovieClick = (movieId) => {
    console.log("Movie clicked:", movieId); // Debug log
    // Close the search modal first
    handleCloseAndCleanup();
    // Then navigate to the movie details
    navigate(`/movies/${movieId}`);
  };

  // Handle close and cleanup
  const handleCloseAndCleanup = () => {
    console.log("Closing and cleaning up search modal"); // Debug log
    // Clear search state
    setQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    onClose();
  };

  const handleClear = () => {
    setQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseAndCleanup();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* Internet Explorer and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
      <div className="fixed inset-0 z-[9989] bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 h-full flex flex-col">
        {/* Search Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Search Movies</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 transition-colors"
            aria-label="Close search"
          >
            <XIcon className="w-8 h-8 cursor-pointer" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="relative">
            <SearchIcon className="absolute z-[9999] left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for movies..."
              className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-gray-300/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
              aria-label="Search movies"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <XIcon className="w-5 h-5 cursor-pointer" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div 
          className="flex-1 overflow-y-auto hide-scrollbar"
        >
          {isLoading && (
            <div
              className="flex items-center justify-center py-12"
              aria-live="polite"
            >
              <LoaderIcon className="w-8 h-8 text-red-500 animate-spin" />
              <span className="ml-3 text-white">Searching movies...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-500 text-lg mb-2">{error}</p>
                <button
                  onClick={() => performSearch(query)}
                  className="text-white hover:text-red-500 underline transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!isLoading &&
            !error &&
            hasSearched &&
            searchResults.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <SearchIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-white text-lg mb-2">No movies found</p>
                  <p className="text-gray-400">
                    Try searching with different keywords
                  </p>
                </div>
              </div>
            )}

          {!isLoading && !error && !hasSearched && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <SearchIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">
                  Start typing to search movies
                </p>
                <p className="text-gray-400">
                  Find your favorite movies quickly
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && searchResults.length > 0 && (
            <div>
              <p className="text-white mb-6">
                Found {searchResults.length} movie
                {searchResults.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showFavoriteButton={true}
                    onCloseModal={handleCloseAndCleanup}
                    disableCardClick={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default MovieSearch;
