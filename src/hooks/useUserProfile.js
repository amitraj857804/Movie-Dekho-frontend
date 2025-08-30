import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserProfile,
  selectHasFetchedUserProfile,
  selectUserProfileLoading,
} from '../components/store/userProfileSlice';
import { selectToken } from '../components/store/authSlice';

/**
 * Custom hook to manage user profile fetching with smart caching
 * Only fetches profile once per user session
 * 
 * @param {boolean} autoFetch - Whether to automatically fetch on mount (default: true)
 * @returns {object} - { refetch: function to manually trigger refetch }
 */
export const useUserProfile = (autoFetch = true) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const hasFetched = useSelector(selectHasFetchedUserProfile);
  const loading = useSelector(selectUserProfileLoading);

  useEffect(() => {
    if (autoFetch && token && !hasFetched && !loading) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token, hasFetched, loading, autoFetch]);

  // Manual refetch function (useful for pull-to-refresh or retry scenarios)
  const refetch = () => {
    if (token) {
      dispatch(fetchUserProfile());
    }
  };

  return {
    refetch,
  };
};

export default useUserProfile;
