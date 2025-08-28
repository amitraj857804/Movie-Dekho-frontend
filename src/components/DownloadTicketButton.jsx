import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectToken } from './store/authSlice';
import { handleTicketDownload } from '../api/ticketApi';
import toast from 'react-hot-toast';

/**
 * Reusable download ticket button component
 * @param {Object} props
 * @param {number|string} props.bookingId - The booking ID
 * @param {string} props.status - Booking status
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.showIcon - Whether to show download icon
 * @param {string} props.downloadingText - Text to show when downloading
 * @param {string} props.defaultText - Default button text
 */
const DownloadTicketButton = ({
  bookingId,
  status = 'confirmed',
  className = '',
  size = 'md',
  showIcon = true,
  downloadingText = 'Downloading...',
  defaultText = 'Download Ticket',
  onDownloadStart,
  onDownloadComplete,
  onDownloadError
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const token = useSelector(selectToken);

  // Size variants
  const sizeClasses = {
    sm: 'px-1 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleDownload = async () => {
    // Check if booking is confirmed
    if (status?.toLowerCase() !== 'confirmed') {
      toast.error('Tickets can only be downloaded for confirmed bookings');
      return;
    }

    if (!token) {
      toast.error('Please login to download ticket');
      return;
    }

    if (!bookingId) {
      toast.error('Invalid booking ID');
      return;
    }

    setIsDownloading(true);
    
    try {
      if (onDownloadStart) onDownloadStart();
      
      await handleTicketDownload(bookingId, token);
      
      if (onDownloadComplete) onDownloadComplete();
    } catch (error) {
      console.error('Download failed:', error);
      if (onDownloadError) onDownloadError(error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Don't render if booking is not confirmed
  if (status?.toLowerCase() !== 'confirmed') {
    return null;
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`
        flex items-center gap-2 bg-primary hover:bg-primary/90 text-white 
        rounded-lg font-medium transition-colors 
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isDownloading ? (
        <>
          <div className={`border-2 border-white/30 border-t-white rounded-full animate-spin ${iconSizes[size]}`}></div>
          <span>{downloadingText}</span>
        </>
      ) : (
        <>
          {showIcon && <ArrowDownTrayIcon className={iconSizes[size]} />}
          <span>{defaultText}</span>
        </>
      )}
    </button>
  );
};

export default DownloadTicketButton;
