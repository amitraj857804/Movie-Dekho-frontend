import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  PlayIcon,
  ClockIcon,
  CalendarIcon,
  LanguageIcon,
  ArrowLeftIcon,
  ShareIcon,
  FilmIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import {
  selectAllMovies,
  selectMoviesLoading,
} from "../components/store/movieSlice";
import { useMovies } from "../hooks/useMovies";
import { useScrollOnLoadComplete } from "../hooks/useScrollToTop";
import Trailer from "../components/Trailer";
import FavoriteButton from "../components/FavoriteButton";
import BookTicket from "../components/BookTicket";
import { useAuthModalContext } from "../hooks/useAuthModalContext";
import AuthModal from "../components/auth/AuthModal";
import toast from "react-hot-toast";
import TrendingMovies from "./homepage/TrendingMovies";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState("bookTicket"); // Track active tab
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const { isAuthModalOpen, authModalTab, closeAuthModal, switchAuthTab } =
    useAuthModalContext();

  const movies = useSelector(selectAllMovies);
  const isLoading = useSelector(selectMoviesLoading);
  const movie = movies.find((m) => m.id === parseInt(id));

  const showMoreMovies = movies.filter((m) => m.id !== parseInt(id));

  // Use custom hooks for smart fetching
  useMovies();

  // Use custom hook for smooth scrolling when loading completes or ID changes
  useScrollOnLoadComplete(isLoading, [id]);

  // Track mobile view based on window size
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 640); // 640px is the 'sm' breakpoint in Tailwind
    };

    // Set initial state
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobileView);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-white mb-2">
            Loading Movie Details...
          </h1>
          <p className="text-gray-400">
            Please wait while we fetch the movie information.
          </p>
        </div>
      </div>
    );
  }

  // Handle case where movie is not found after loading
  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Movie Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            The movie you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90 cursor-pointer text-white px-6 py-2 rounded-full transition-colors duration-300"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    let date;
    if (Array.isArray(dateString)) {
      date = new Date(dateString[0], dateString[1] - 1, dateString[2]);
    } else {
      date = new Date(dateString);
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleWatchTrailer = (movie) => {
    setShowTrailer(true);
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // Truncate description for preview
  const getDisplayDescription = () => {
    const description =
      movie.description || "No synopsis available for this movie.";
    if (isExpanded || description.length <= 100) {
      return description;
    }
    return description.slice(0, 100) + "...";
  };

  // Share functionality handlers
  const handleShareClick = () => {
    setShowShareDialog(true);
  };

  const closeShareDialog = () => {
    setShowShareDialog(false);
    setCopiedToClipboard(false);
  };

  const copyToClipboard = async () => {
    const movieUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(movieUrl);
      setCopiedToClipboard(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = movieUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedToClipboard(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopiedToClipboard(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed: ", fallbackErr);
        toast.error("Failed to copy link");
      }
      document.body.removeChild(textArea);
    }
  };

  const shareOnSocialMedia = (platform) => {
    const movieUrl = encodeURIComponent(window.location.href);
    const movieTitle = encodeURIComponent(
      movie?.title || "Check out this movie"
    );
    const movieDescription = encodeURIComponent(
      movie?.description || "Watch this amazing movie"
    );

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${movieUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${movieUrl}&text=${movieTitle}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${movieTitle}%20${movieUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${movieUrl}&text=${movieTitle}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${movieUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    closeShareDialog();
  };

  // Mobile View Layout
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-gray-900 ">
        {/* Mobile Hero Section with Image */}
        <div className="relative h-[40%] top-18">
          {/* Back Button - Above Image */}
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={() => navigate("/movies")}
              className="flex items-center gap-2 font-extrabold text-white p-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 backdrop-blur-md bg-black/30"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Watch Trailer Button - Center of Image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() => handleWatchTrailer(movie)}
              className="flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-gray-800 px-4 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 transform shadow-2xl"
            >
              <PlayIcon className="w-8 h-8 flex-shrink-0" />
            </button>
          </div>

          {/* Full Width Movie Image */}
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="w-full h-[380px]  object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

          {/* Movie Title - Bottom of Image */}
          <div className="absolute bottom-0 left-4 right-4 z-20">
            <h1 className="text-3xl font-bold text-white  drop-shadow-lg">
              {movie.title.toUpperCase()}
            </h1>
            <div className="flex items-center gap-4 mb-1">
              <span className="text-white">{movie.duration || "N/A"}</span>
              <span className="text-white">{movie.genre.split(",")[0]}</span>
              <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg bg-gray-800/80 backdrop-blur-sm">
                {movie.certification || "Not Rated"}
              </span>
            </div>
            <div className="absolute flex bottom-2 right-3 gap-4 sm:gap-2">
              <FavoriteButton
                movieId={movie.id}
                movieData={movie}
                variant="small"
                size="w-5 h-5"
                showTooltip={true}
              />

              <button
                onClick={handleShareClick}
                className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white p-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm border border-white/20"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 mt-19 flex gap-10 font-bold text-xl text-primary/80">
          <span
            className={`cursor-pointer transition-all duration-300 relative ${
              activeTab === "bookTicket"
                ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-white after:via-primary after:to-orange-500 after:rounded-full after:-mb-1 text-white"
                : "hover:text-white"
            }`}
            onClick={() => setActiveTab("bookTicket")}
          >
            Book Ticket
          </span>
          <span
            className={`cursor-pointer transition-all duration-300 relative ${
              activeTab === "movieDetails"
                ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-white after:via-primary after:to-orange-500 after:rounded-full after:-mb-1 text-white"
                : "hover:text-white"
            }`}
            onClick={() => setActiveTab("movieDetails")}
          >
            Movie Details
          </span>
        </div>

        {activeTab === "bookTicket" && <BookTicket />}
        {/* Mobile Movie Information Section */}
        <div className=" px-4 py-2 ">
          {/* Conditional Content Based on Active Tab */}
          {activeTab === "movieDetails" && (
            <>
              <h1 className="text-xl font-bold text-white  drop-shadow-lg mb-1">
                {movie.title.toUpperCase()}
              </h1>
              <span className="text-white mr-3 ">
                {movie.duration || "N/A"}
              </span>
              <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg bg-gray-800/80 backdrop-blur-sm">
                {movie.certification || "Not Rated"}
              </span>
              {/* Description */}
              <div className="my-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Movie Details */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">Release Date:</span>
                    <span className="text-white">
                      {formatDate(movie.releaseDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FilmIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">Genre:</span>
                    <span className="text-white">
                      {movie.genre.split(",")[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">
                      {movie.duration || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <LanguageIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">Language:</span>
                    <span className="text-white">
                      {movie.language || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
          <TrendingMovies
            headingText={"Also Showing Now"}
            showMoreMovies={showMoreMovies}
          />
        </div>

        {/* Trailer Modal */}
        <Trailer
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          movie={movie}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          activeTab={authModalTab}
          onTabChange={switchAuthTab}
        />

        {/* Share Dialog */}
        {showShareDialog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Share Movie
                </h3>
                <button
                  onClick={closeShareDialog}
                  className="text-gray-400 hover:text-white transition-colors "
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-3">
                  Share "{movie?.title}" with your friends
                </p>

                {/* Copy Link Section */}
                <div className="bg-gray-700 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-3">
                      <p className="text-gray-400 text-xs mb-1">Movie Link</p>
                      <p className="text-white text-sm truncate">
                        {window.location.href}
                      </p>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-all duration-300 ${
                        copiedToClipboard
                          ? "bg-green-600 text-white"
                          : "bg-primary hover:bg-primary/90 text-white"
                      }`}
                    >
                      {copiedToClipboard ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span className="text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-4 h-4" />
                          <span className="text-sm hidden sm:flex">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Media Sharing */}
              <div>
                <p className="text-gray-400 text-sm mb-3">
                  Share on social media
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => shareOnSocialMedia("whatsapp")}
                    className="flex items-center gap-3 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                    <span className="font-medium">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => shareOnSocialMedia("facebook")}
                    className="flex items-center gap-3 p-3 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="font-medium">Facebook</span>
                  </button>

                  <button
                    onClick={() => shareOnSocialMedia("twitter")}
                    className="flex items-center gap-3 p-3 bg-black hover:bg-gray-900 text-white rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="font-medium">Twitter</span>
                  </button>

                  <button
                    onClick={() => shareOnSocialMedia("telegram")}
                    className="flex items-center gap-3 p-3 bg-[#0088CC] hover:bg-[#0088CC]/90 text-white rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    <span className="font-medium">Telegram</span>
                  </button>

                  <button
                    onClick={() => shareOnSocialMedia("linkedin")}
                    className="flex items-center gap-3 p-3 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white rounded-lg transition-colors col-span-2"
                  >
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-[#0A66C2] font-bold text-sm">
                        in
                      </span>
                    </div>
                    <span className="font-medium">LinkedIn</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    // Desktop View Layout
    return (
      <div className="min-h-screen bg-gray-900 ">
        <div className="bg-gradient-to-b  from-gray-800 via-red-900/30 to-red-800/30 w-[100%] px-6 pt-30 pb-10">
          <div className="container mx-auto px-12 ">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/movies")}
                className="flex items-center gap-2 font-extrabold text-white p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 backdrop-blur-sm "
              >
                <ArrowLeftIcon className="w-6 h-6" />
                Back
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Movie Poster */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="md:w-[70%] lg:w-[80%] md:h-80  rounded-lg shadow-2xl"
                  />
                </div>
              </div>

              {/* Movie Information */}
              <div className="lg:col-span-2 md:col-span-1 lg:space-y-2  md:w-[100%] md:-ml-16 lg:-ml-4">
                <h3 className="text-4xl font-bold text-white mb-4">
                  {movie.title.toUpperCase()}
                </h3>

                <div className="mb-4">
                  <p className="text-gray-300 sm:text-sm  sm:leading-tight xl:leading-relaxed">
                    {getDisplayDescription()}
                    {movie.description && movie.description.length > 100 && (
                      <button
                        onClick={toggleDescription}
                        className="  text-primary z-50 relative hover:text-primary/80 font-semibold text-sm xl:text-md transition-colors duration-300 cursor-pointer"
                      >
                        {isExpanded ? ".Read Less" : "Read More"}
                      </button>
                    )}
                  </p>
                </div>

                {/* Movie Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-45 lg:gap-6 xl:mt-8">
                  <div className="sm:space-y-2 ">
                    <h4 className="text-xl font-semibold text-white">
                      Movie Information
                    </h4>

                    <div className="space-y-1 md:col-span-1 md:space-y-0 lg:space-y-1 ">
                      <div className="flex items-center gap-3 flex-nowrap">
                        <CalendarIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-gray-400 whitespace-nowrap">
                          Release Date:
                        </span>
                        <span className="text-white whitespace-nowrap">
                          {formatDate(movie.releaseDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-nowrap">
                        <FilmIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-gray-400 whitespace-nowrap">
                          Genre:
                        </span>
                        <span className="text-white whitespace-nowrap">
                          {movie.genre.split(",")[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-nowrap">
                        <ClockIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-gray-400 whitespace-nowrap">
                          Duration:
                        </span>
                        <span className="text-white whitespace-nowrap">
                          {movie.duration || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-nowrap">
                        <LanguageIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-gray-400 whitespace-nowrap">
                          Language:
                        </span>
                        <span className="text-white whitespace-nowrap">
                          {movie.language || "N/A"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleWatchTrailer(movie)}
                        className="w-[75%] flex items-center justify-center gap-3 mt-6 cursor-pointer text-lg bg-white hover:bg-white/80 backdrop-blur-sm text-gray-800 jg:px-2 md:px-28 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300 transform shadow-lg"
                      >
                        <PlayIcon className="w-6 h-6 flex-shrink-0" />
                        <span className="whitespace-nowrap">Watch Trailer</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold text-white">
                      Certification
                    </h4>
                    <div className="inline-block   ">
                      <span className="text-white font-semibold text-md px-2 py-1 rounded-lg bg-gray-800 border-gray-600">
                        {movie.certification || "Not Rated"}
                      </span>
                      <div className="flex gap-4 lg:mt-6 md:mt-12 ">
                        <FavoriteButton
                          movieId={movie.id}
                          movieData={movie}
                          variant="default"
                          size="w-4 h-4"
                          showTooltip={true}
                        />

                        <button
                          onClick={handleShareClick}
                          className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm border border-white/20"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book tickets - selcet Date,time and theatre */}
        <BookTicket />

        {/* Trailer Modal */}
        <Trailer
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          movie={movie}
        />
        <TrendingMovies
          headingText={"Also Showing Now"}
          showMoreMovies={showMoreMovies}
        />
        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          activeTab={authModalTab}
          onTabChange={switchAuthTab}
        />

        {/* Share Dialog */}
        {showShareDialog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Share Movie
                </h3>
                <button
                  onClick={closeShareDialog}
                  className="text-gray-400 hover:text-white transition-colors hover:bg-gray-700 p-2 rounded-md"
                >
                  <XMarkIcon className="w-5 h-5  cursor-pointer " />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-3">
                  Share "{movie?.title}" with your friends
                </p>

                {/* Copy Link Section */}
                <div className="bg-gray-700 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-3">
                      <p className="text-gray-400 text-xs mb-1">Movie Link</p>
                      <p className="text-white text-sm truncate">
                        {window.location.href}
                      </p>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md transition-all duration-300 ${
                        copiedToClipboard
                          ? "bg-green-600 text-white"
                          : "bg-primary hover:bg-primary/90 text-white"
                      }`}
                    >
                      {copiedToClipboard ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span className="text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-4 h-4" />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Media Sharing */}
              <div>
                <p className="text-gray-400 text-sm mb-3">
                  Share on social media
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => shareOnSocialMedia("whatsapp")}
                    className="flex items-center gap-3 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                    <span className="font-medium">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => shareOnSocialMedia("facebook")}
                    className="flex items-center gap-3 p-3 bg-[#1877F2]  hover:bg-[#1877F2]/90 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="font-medium">Facebook</span>
                  </button>

                  <button
                    onClick={() => shareOnSocialMedia("twitter")}
                    className="flex items-center gap-3 p-3 bg-black hover:bg-gray-950 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="font-medium">Twitter</span>
                  </button>

                  <button
                    onClick={() => shareOnSocialMedia("telegram")}
                    className="flex items-center gap-3 p-3 bg-[#0088CC] hover:bg-[#0088CC]/90 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    <span className="font-medium">Telegram</span>
                  </button>

                  <button
                    onClick={() => shareOnSocialMedia("linkedin")}
                    className="flex items-center gap-3 p-3 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white rounded-lg transition-colors col-span-2 cursor-pointer"
                  >
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-[#0A66C2] font-bold text-sm">
                        in
                      </span>
                    </div>
                    <span className="font-medium">LinkedIn</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MovieDetails;
