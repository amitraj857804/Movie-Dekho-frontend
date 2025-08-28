import React, { useState } from "react";
import { XMarkIcon, ShareIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const ShareDialog = ({ 
  isOpen, 
  onClose, 
  bookingData,
  className = "" 
}) => {
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen || !bookingData) return null;

  const {
    movie,
    selectedDateObj,
    selectedTimeWithAmPm,
    selectedCinema,
    selectedSeats,
    finalTotal
  } = bookingData;

  // Format date
  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    return new Date(dateObj.dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Create sharing message
  const createShareMessage = () => {
    const movieTitle = movie?.title || "Movie";
    const cinemaName = selectedCinema?.theatreName || "Cinema";
    const date = formatDate(selectedDateObj);
    const time = selectedTimeWithAmPm || "";
    const seatNumbers = selectedSeats?.map(seat => seat.seatNumber || seat.id).join(", ") || "";
    const total = finalTotal || 0;

    return `🎬 Just booked tickets for "${movieTitle}"!

📅 Date: ${date}
⏰ Time: ${time}
🏛️ Cinema: ${cinemaName}
💺 Seats: ${seatNumbers}
💰 Total: ₹${total}

Excited for the show! 🍿✨

#MovieNight #${movieTitle.replace(/\s+/g, '')} #CineBook`;
  };

  // Copy to clipboard
  const handleCopyLink = async () => {
    try {
      setIsSharing(true);
      const shareText = createShareMessage();
      await navigator.clipboard.writeText(shareText);
      toast.success("Booking details copied to clipboard!");
      onClose();
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    } finally {
      setIsSharing(false);
    }
  };

  // Share via Web Share API (if supported)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: `Movie Booking - ${movie?.title}`,
          text: createShareMessage(),
        });
        onClose();
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error("Sharing failed");
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      handleCopyLink();
    }
  };

  // Social media sharing functions
  const shareToWhatsApp = () => {
    const message = encodeURIComponent(createShareMessage());
    window.open(`https://wa.me/?text=${message}`, '_blank');
    onClose();
  };

  const shareToFacebook = () => {
    const message = encodeURIComponent(createShareMessage());
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${message}`, '_blank');
    onClose();
  };

  const shareToTwitter = () => {
    const message = encodeURIComponent(createShareMessage());
    window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
    onClose();
  };

  const shareToTelegram = () => {
    const message = encodeURIComponent(createShareMessage());
    window.open(`https://telegram.me/share/url?text=${message}`, '_blank');
    onClose();
  };

  const shareToLinkedIn = () => {
    const message = encodeURIComponent(createShareMessage());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${message}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className={`bg-gray-800 rounded-xl max-w-md w-full border border-gray-600 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <ShareIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Share Your Booking
              </h3>
              <p className="text-gray-400 text-sm">
                Let everyone know about your movie plans!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Booking Preview */}
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <h4 className="text-white font-semibold mb-2">{movie?.title}</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>📅 {formatDate(selectedDateObj)} at {selectedTimeWithAmPm}</p>
              <p>🏛️ {selectedCinema?.name}</p>
              <p>💺 Seats: {selectedSeats?.map(seat => seat.seatNumber || seat.id).join(", ")}</p>
              <p className="text-primary font-semibold">💰 Total: ₹{finalTotal}</p>
            </div>
          </div>

          {/* Quick Share Button */}
          <button
            onClick={handleNativeShare}
            disabled={isSharing}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer mb-4 disabled:opacity-50"
          >
            {isSharing ? "Sharing..." : navigator.share ? "Share" : "Copy to Clipboard"}
          </button>

          {/* Social Media Options */}
          <div className="space-y-3">
            <p className="text-gray-400 text-sm text-center">Or share to:</p>
            
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <button
                onClick={shareToWhatsApp}
                className="flex items-center gap-3 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
                <span className="text-sm font-medium">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareToFacebook}
                className="flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium">Facebook</span>
              </button>

              {/* Twitter */}
              <button
                onClick={shareToTwitter}
                className="flex items-center gap-3 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span className="text-sm font-medium">Twitter</span>
              </button>

              {/* Telegram */}
              <button
                onClick={shareToTelegram}
                className="flex items-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-sm font-medium">Telegram</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
