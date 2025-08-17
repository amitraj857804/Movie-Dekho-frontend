import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { selectToken } from '../components/store/authSlice';
import api from '../api/api';
import toast from 'react-hot-toast';

function MyBookings() {
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setLoading(false);
        setError('Please login to view your bookings');
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/api/bookings/my-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Bookings response:', response.data);
        setBookings(response.data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        
        if (error.response?.status === 401) {
          setError('Session expired. Please login again.');
          toast.error('Session expired. Please login again.');
        } else if (error.response?.status === 404) {
          setBookings([]);
          setError(null);
        } else {
          setError('Failed to load bookings. Please try again.');
          toast.error('Failed to load bookings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time function
  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get booking status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      default:
        return 'text-blue-400 bg-blue-400/20';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex gap-12 justify-start items-center ">
            <div className='w-2'>

            
            <button
              onClick={() => navigate('/')}
              className="gap-2 text-white hover:text-primary transition-colors mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
             
            </button>
            </div>
           

            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center ">
              My Bookings
            </h1>
           
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/30 border-b-primary rounded-full animate-spin"></div>
              <p className="text-gray-400">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-primary transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My Bookings
          </h1>
          <p className="text-gray-400">
            {bookings.length > 0 
              ? `You have ${bookings.length} booking${bookings.length > 1 ? 's' : ''}`
              : 'Your movie bookings will appear here'
            }
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <ExclamationCircleIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-6">
              <TicketIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-400 mb-2">No bookings yet</h2>
              <p className="text-gray-500 mb-6">Start exploring movies and book your first show!</p>
              <button
                onClick={() => navigate('/movies')}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Movies
              </button>
            </div>
          </div>
        )}

        {/* Bookings Grid */}
        {bookings.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {bookings.map((booking, index) => (
              <div
                key={booking.id || index}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={booking.movie?.thumbnail || booking.movieThumbnail || '/placeholder-movie.jpg'}
                      alt={booking.movie?.title || booking.movieTitle || 'Movie'}
                      className="w-20 h-28 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-movie.jpg';
                      }}
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {booking.movie?.title || booking.movieTitle || 'Movie Title'}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status || 'Confirmed'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold text-lg">
                          ₹{booking.totalAmount || booking.amount || '0'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Booking ID: {booking.id || booking.bookingId || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Cinema and Show Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPinIcon className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            {booking.cinema?.name || booking.theaterName || 'Theater Name'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            {booking.showDate ? formatDate(booking.showDate) : 'Date N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <ClockIcon className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            {booking.showTime ? formatTime(booking.showTime) : 'Time N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <TicketIcon className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            Seats: {Array.isArray(booking.seats) 
                              ? booking.seats.join(', ') 
                              : booking.seatNumbers?.join(', ') || 'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Date */}
                    <div className="border-t border-gray-700 pt-3">
                      <p className="text-gray-500 text-sm">
                        Booked on: {booking.bookingDate 
                          ? formatDate(booking.bookingDate) 
                          : booking.createdAt 
                            ? formatDate(booking.createdAt)
                            : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;