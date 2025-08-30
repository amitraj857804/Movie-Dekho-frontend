import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserBookings,
  selectHasFetchedUserBookings,
  selectUserBookingsLoading,
} from '../components/store/userBookingSlice';
import { selectToken } from '../components/store/authSlice';

/**
 * Custom hook to manage user bookings fetching with smart caching
 * Only fetches bookings once per user session
 * 
 * @param {boolean} autoFetch - Whether to automatically fetch on mount (default: true)
 * @returns {object} - { refetch: function to manually trigger refetch }
 */
export const useUserBookings = (autoFetch = true) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const hasFetched = useSelector(selectHasFetchedUserBookings);
  const loading = useSelector(selectUserBookingsLoading);

  useEffect(() => {
    if (autoFetch && token && !hasFetched && !loading) {
      dispatch(fetchUserBookings());
    }
  }, [dispatch, token, hasFetched, loading, autoFetch]);

  // Manual refetch function (useful for pull-to-refresh or retry scenarios)
  const refetch = () => {
    if (token) {
      dispatch(fetchUserBookings());
    }
  };

  return {
    refetch,
  };
};

export default useUserBookings;
