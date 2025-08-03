import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayIcon } from "@heroicons/react/24/solid";
import FavoriteButton from './FavoriteButton';
import Trailer from './Trailer';

const MovieCard = ({ movie, showFavoriteButton = true }) => {
    const navigate = useNavigate();
    const [showTrailer, setShowTrailer] = useState(false);

    const handleWatchTrailer = (e) => {
        e.stopPropagation();
        setShowTrailer(true);
    };

    const handleBookNow = (e) => {
        e.stopPropagation();
        navigate(`/movies/${movie.id}`);
    };

    const handleCardClick = () => {
        navigate(`/movies/${movie.id}`);
    };

    return (
        <>
            <div
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={handleCardClick}
            >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                        src={movie.thumbnail}
                        alt={movie.title}
                        className="w-full md:h-70  object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Favorite button overlay */}
                    {showFavoriteButton && (
                        <div className="absolute top-2 right-2 z-10">
                            <FavoriteButton 
                                movieId={movie.id}
                                movieData={movie}
                                variant="small"
                                size="w-5 h-5"
                                className="bg-black/50 hover:bg-black/70"
                            />
                        </div>
                    )}

                    {/* Hover overlay with action buttons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute top-[30%] left-0 right-0 p-4 flex flex-col gap-3">
                            <button
                                onClick={handleBookNow}
                                className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-2 px-3 rounded-full transition-colors duration-300 font-semibold cursor-pointer"
                            >
                                Book Now
                            </button>
                            <button
                                onClick={handleWatchTrailer}
                                className="w-full flex items-center justify-center gap-3 cursor-pointer text-lg bg-white hover:bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-full font-semibold transition-all duration-300 transform shadow-lg"
                            >
                                <PlayIcon className="w-6 h-6" />
                                Watch Trailer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Movie info */}
                <div className="mt-4">
                    <h3 className="text-white font-semibold text-xl mb-2 line-clamp-2">
                        {movie.title}
                    </h3>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-300">{movie.duration}</span>
                        <div className="flex items-center gap-2">
                            <span className="bg-white/20 backdrop-blur-sm px-2 text-sm rounded-md text-white">
                                {movie.certification}
                            </span>
                        </div>
                    </div>
                    <span className="text-sm text-gray-400">
                        {movie.language ? movie.language : "N/A"}
                    </span>
                </div>
            </div>

            {/* Trailer Modal */}
            <Trailer
                isOpen={showTrailer}
                onClose={() => setShowTrailer(false)}
                movie={movie}
            />
        </>
    );
};

export default MovieCard;
