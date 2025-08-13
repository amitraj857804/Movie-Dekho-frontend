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

      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&playsinline=1&enablejsapi=1`;

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
      <div className="relative bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 pt-4 pb-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-wide">
                {movie?.title || "Movie Trailer"}
              </h2>
              <p className="text-primary/80 text-sm font-medium mt-1">
                Official Trailer
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="group relative text-gray-400 hover:text-white transition-all duration-300 p-3 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 rounded-xl cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
          >
            <XMarkIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Video Container */}
        <div className="p-2">
          <div className="relative w-full h-0 sm:pb-[56.25%] pb-[56.25%]  rounded-lg overflow-hidden">
            {embedUrl ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`${embedUrl}&vq=hd1080`}
                title={`${movie?.title} Trailer`}
                style={{
                  objectFit: 'cover',
                  filter: 'contrast(1.1) saturate(1.1)',
                }}
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

       
        </div>
      </div>
    </div>
  );
}

export default Trailer;
