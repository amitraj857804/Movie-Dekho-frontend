import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFavoriteMovies,
  selectHasFetchedFavorites,
  selectFavoritesLoading,
} from '../components/store/favoritesSlice';
import { selectToken } from '../components/store/authSlice';

/**
 * Custom hook to manage favorites fetching with smart caching
 * Only fetches favorites once per user session
 * 
 * @param {boolean} autoFetch - Whether to automatically fetch on mount (default: true)
 * @returns {object} - { refetch: function to manually trigger refetch }
 */
export const useFavorites = (autoFetch = true) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const hasFetched = useSelector(selectHasFetchedFavorites);
  const loading = useSelector(selectFavoritesLoading);

  useEffect(() => {
    if (autoFetch && token && !hasFetched && !loading) {
      dispatch(fetchFavoriteMovies());
    }
  }, [dispatch, token, hasFetched, loading, autoFetch]);

  // Manual refetch function (useful for pull-to-refresh or retry scenarios)
  const refetch = () => {
    if (token) {
      dispatch(fetchFavoriteMovies());
    }
  };

  return {
    refetch,
  };
};

export default useFavorites;
