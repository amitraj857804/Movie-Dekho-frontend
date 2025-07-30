import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

function Trailer({ isOpen, onClose, movie }) {
  // Don't render if modal is not open
  
  if (!isOpen) return null;

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
const handleClose = () => {
  document.body.style.overflow = "";  // ✅ Reset scroll first
  onClose();                         // Then close modal
};
  // Function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) {
 
      return null;
    }

    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // Extract video ID from various YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];

      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

      return embedUrl;
    }

    console.log("No match found, returning original URL:", url);
    // If no match found, return the original URL (in case it's a different video platform)
    return url;
  };

  const embedUrl = getYouTubeEmbedUrl(movie?.trailer);

  return (
    <div
      className="fixed inset-0 z-[999] bg-transparent  bg-opacity-75 backdrop-blur-sm flex items-center justify-center pt-16 pb-0"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 pt-3 pb-2 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {movie?.title || "Movie Trailer"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Video Container */}
        <div className="p-6">
          <div className="relative w-full h-0 sm:pb-[48.25%] pb-[80.25%] bg-gray-800 rounded-lg overflow-hidden">
            {embedUrl ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={embedUrl}
                title={`${movie?.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">Trailer not available</p>
                  <p className="text-gray-500 text-sm mt-2">
                    The trailer for "{movie?.title}" is currently unavailable.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Movie Info */}
          {movie && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Overview
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                  {movie.description || "No overview available."}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-white">
                      {movie.vote_average
                        ? `${movie.vote_average.toFixed(1)}/10`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Runtime:</span>
                    <span className="text-white">
                      {movie.duration ? `${movie.duration}` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Language:</span>
                    <span className="text-white">
                      {movie.original_language?.toUpperCase() || "N/A"}
                    </span>
                  </div>
                  
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Trailer;
