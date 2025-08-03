import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllMovies, fetchAllMovies } from '../components/store/movieSlice';
import MovieCard from '../components/MovieCard';

function Movies() {
  const dispatch = useDispatch();
  const movies = useSelector(selectAllMovies);

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchAllMovies());
    }
  }, [dispatch, movies.length]);

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
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
    </div>
  )
}

export default Movies