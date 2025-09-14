import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllMovies,
  selectHasFetchedMovies,
  selectMoviesLoading,
} from '../components/store/movieSlice';

/**
 * Custom hook to manage movies fetching with smart caching
 * Only fetches movies once per session, prevents continuous API calls
 * 
 * @param {boolean} autoFetch - Whether to automatically fetch on mount (default: true)
 * @returns {object} - { refetch: function to manually trigger refetch }
 */
export const useMovies = (autoFetch = true) => {
  const dispatch = useDispatch();
  const hasFetched = useSelector(selectHasFetchedMovies);
  const loading = useSelector(selectMoviesLoading);

  useEffect(() => {
    if (autoFetch && !hasFetched && !loading) {
      dispatch(fetchAllMovies());
    }
  }, [dispatch, hasFetched, loading, autoFetch]);

  // Manual refetch function (useful for pull-to-refresh or retry scenarios)
  const refetch = () => {
    dispatch(fetchAllMovies());
  };

  return {
    refetch,
  };
};

export default useMovies;
