import api from './api';
import toast from 'react-hot-toast';

/**
 * Download ticket PDF for a confirmed booking
 * @param {number} bookingId - The booking ID
 * @param {string} token - JWT authentication token
 * @returns {Promise<boolean>} - Returns true if download successful
 */
export const downloadTicketByBookingId = async (bookingId, token) => {
  try {
    const response = await api.get(`/api/bookings/${bookingId}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'blob'
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename from response header or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = `ticket-booking-${bookingId}.pdf`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error downloading ticket:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('Access denied. This booking does not belong to you.');
    } else if (error.response?.status === 404) {
      throw new Error('Booking not found.');
    } else if (error.response?.status === 400) {
      throw new Error('Ticket cannot be downloaded for this booking status.');
    } else {
      throw new Error('Failed to download ticket. Please try again.');
    }
  }
};

/**
 * Generate custom ticket PDF (Legacy endpoint)
 * @param {Object} ticketData - Ticket request data
 * @param {string} ticketData.movie - Movie name
 * @param {string} ticketData.showtime - Show time
 * @param {Array<string>} ticketData.seats - Array of seat numbers
 * @param {string} ticketData.customerName - Customer name
 * @param {string} ticketData.customerEmail - Customer email
 * @param {number} ticketData.totalPrice - Total price
 * @returns {Promise<boolean>} - Returns true if download successful
 */
export const generateCustomTicket = async (ticketData) => {
  try {
    const response = await api.post('/api/bookings/generate', ticketData, {
      responseType: 'blob'
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename from response header or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'movie-ticket.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error generating custom ticket:', error);
    throw new Error('Failed to generate ticket. Please try again.');
  }
};

/**
 * Utility function to handle ticket download with proper error handling and user feedback
 * @param {number} bookingId - The booking ID
 * @param {string} token - JWT authentication token
 * @param {Function} setLoading - Loading state setter (optional)
 * @returns {Promise<void>}
 */
export const handleTicketDownload = async (bookingId, token, setLoading = null) => {
  if (!token) {
    toast.error('Please login to download ticket');
    return;
  }

  if (!bookingId) {
    toast.error('Invalid booking ID');
    return;
  }

  if (setLoading) setLoading(true);

  try {
    await downloadTicketByBookingId(bookingId, token);
    toast.success('Ticket downloaded successfully!');
  } catch (error) {
    toast.error(error.message);
  } finally {
    if (setLoading) setLoading(false);
  }
};
