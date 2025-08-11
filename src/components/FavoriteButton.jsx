import { useDispatch, useSelector } from "react-redux";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import {
  addToFavorites,
  removeFromFavorites,
  selectIsMovieFavorite,
  selectFavoritesActionLoading,
} from "../components/store/favoritesSlice.js";
import { selectToken } from "../components/store/authSlice";
import toast from "react-hot-toast";

const FavoriteButton = ({
  movieId,
  movieData,
  className = "",
  size = "w-5 h-5",
  showTooltip = true,
  variant = "default", 
}) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isFavorite = useSelector(selectIsMovieFavorite(movieId));
  const isLoading = useSelector(selectFavoritesActionLoading);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation(); 

    if (!token) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(movieId)).unwrap();
      } else {
        await dispatch(addToFavorites({ movieId, movieData })).unwrap();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Unable to add/remove to favourites.Try again");
    }
  };

  const getButtonClasses = () => {
    const baseClasses =
      "flex items-center justify-center transition-all duration-300 cursor-pointer";

    switch (variant) {
      case "small":
        return `${baseClasses} p-1 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm`;
      case "large":
        return `${baseClasses} gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-semibold hover:scale-105 backdrop-blur-sm border border-white/20`;
      default:
        return `${baseClasses} p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:scale-105`;
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${getButtonClasses()} ${className} ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title={
        showTooltip
          ? isFavorite
            ? "Remove from favorites"
            : "Add to favorites"
          : ""
      }
    >
      {isLoading ? (
        <div
          className={`animate-spin rounded-full border-2 border-white border-t-transparent ${size}`}
        />
      ) : (
        <>
          {isFavorite ? (
            <HeartIcon className={`${size} text-red-500`} />
          ) : (
            <HeartOutline className={`${size} text-white`} />
          )}
          {variant === "large" && (
            <span className="text-sm">
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default FavoriteButton;
