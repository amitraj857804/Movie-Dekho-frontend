import React from 'react';
import { StarIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { dummyShowsData } from '../assets/assets';

const TrendingMovies = () => {
  // Get movies for trending section (excluding the first 5 used in carousel)
  const trendingMovies = dummyShowsData.slice(5, 11);

  return (
    <section className="py-16 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Trending Now
          </h2>
          <button className="text-primary hover:text-primary/80 font-semibold transition-colors duration-300 cursor-pointer">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 custom-scrollbar">
          {trendingMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full h-64 md:h-80 xl:h-125 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-white text-xs">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-300 text-xs">|</span>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-xs">
                          {movie.release_date.split('-')[0]}
                        </span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-primary hover:bg-primary/90 text-white text-xs py-2 px-3 rounded-full transition-colors duration-300">
                      Book Now
                    </button>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <StarIcon className="w-3 h-3 text-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </div>

                {/* Genre Tag */}
                <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {movie.genres[0]?.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingMovies;
