# Ticket Download Feature Documentation

## Overview
The ticket download feature allows users to download PDF tickets for their confirmed movie bookings. This feature integrates with the backend API endpoint `/api/bookings/{bookingId}/download` to generate and download properly formatted movie tickets.

## Features

### 1. API Integration
- **Endpoint**: `GET /api/bookings/{bookingId}/download`
- **Authentication**: JWT Bearer token required
- **Response**: PDF file (application/pdf)
- **Error Handling**: Comprehensive error handling for various scenarios

### 2. Frontend Components

#### TicketAPI (`src/api/ticketApi.js`)
- `downloadTicketByBookingId(bookingId, token)`: Core function to download ticket
- `handleTicketDownload(bookingId, token, setLoading)`: Utility function with error handling and user feedback
- `generateCustomTicket(ticketData)`: Legacy endpoint for custom tickets

#### DownloadTicketButton (`src/components/DownloadTicketButton.jsx`)
- Reusable component for ticket download functionality
- Props:
  - `bookingId`: The booking ID to download ticket for
  - `status`: Booking status (only shows for 'confirmed' bookings)
  - `className`: Additional CSS classes
  - `size`: Button size ('sm', 'md', 'lg')
  - `showIcon`: Whether to show download icon
  - `downloadingText`: Text to show when downloading
  - `defaultText`: Default button text
  - `onDownloadStart`: Callback when download starts
  - `onDownloadComplete`: Callback when download completes
  - `onDownloadError`: Callback when download fails

#### MyBookings Integration
- Shows download button only for confirmed bookings
- Real-time download status with loading indicator
- Toast notifications for user feedback

### 3. User Experience

#### Download Flow
1. User navigates to "My Bookings" page
2. System displays all user bookings with status
3. For confirmed bookings, a "Download Ticket" button is shown
4. User clicks download button
5. System validates booking status and user authentication
6. PDF ticket is generated and automatically downloaded
7. User receives success/error feedback via toast notifications

#### Validation Rules
- Only confirmed bookings can have tickets downloaded
- User must be authenticated (JWT token required)
- User can only download tickets for their own bookings
- Backend validates booking ownership

### 4. Error Handling

#### Frontend Error Messages
- **No Authentication**: "Please login to download ticket"
- **Invalid Booking ID**: "Invalid booking ID"
- **Non-confirmed Booking**: "Tickets can only be downloaded for confirmed bookings"

#### Backend Error Handling
- **401 Unauthorized**: "Session expired. Please login again."
- **403 Forbidden**: "Access denied. This booking does not belong to you."
- **404 Not Found**: "Booking not found."
- **400 Bad Request**: "Ticket cannot be downloaded for this booking status."
- **500 Internal Server Error**: "Failed to download ticket. Please try again."

### 5. PDF Ticket Content

The generated PDF ticket includes:
- Movie title and details
- Theater name and screen type
- Show date and time
- Seat numbers
- Booking ID
- Customer email
- Total amount and payment status
- QR code for verification
- Booking timestamp

### 6. Security Features

- JWT token validation
- User ownership verification
- Booking status validation
- Secure PDF generation with QR code

### 7. Usage Examples

#### Using DownloadTicketButton Component
```jsx
import DownloadTicketButton from '../components/DownloadTicketButton';

// Basic usage
<DownloadTicketButton
  bookingId={booking.id}
  status={booking.status}
/>

// With custom props
<DownloadTicketButton
  bookingId={booking.id}
  status={booking.status}
  size="lg"
  className="custom-class"
  onDownloadComplete={() => console.log('Download completed')}
/>
```

#### Direct API Usage
```javascript
import { handleTicketDownload } from '../api/ticketApi';

// With loading state
const downloadTicket = async () => {
  try {
    await handleTicketDownload(bookingId, token, setLoading);
  } catch (error) {
    console.error('Download failed:', error);
  }
};
```

### 8. File Structure
```
src/
├── api/
│   └── ticketApi.js              # Ticket download API functions
├── components/
│   └── DownloadTicketButton.jsx  # Reusable download button component
└── pages/
    └── MyBookings.jsx            # Main bookings page with download feature
```

### 9. Dependencies
- **axios**: For API requests
- **react-hot-toast**: For user notifications
- **@heroicons/react**: For download icon
- **redux**: For authentication state management

### 10. Browser Compatibility
- Modern browsers with blob and URL support
- Automatic PDF download functionality
- Graceful error handling for unsupported browsers

## Implementation Notes

1. **Authentication**: The feature requires valid JWT token stored in Redux state
2. **File Naming**: Downloaded files are automatically named as `ticket-booking-{bookingId}.pdf`
3. **Responsive Design**: Download button adapts to different screen sizes
4. **Accessibility**: Proper ARIA labels and keyboard navigation support
5. **Performance**: Efficient blob handling and memory cleanup after download

## Future Enhancements

1. **Batch Download**: Allow downloading multiple tickets at once
2. **Email Integration**: Send tickets via email
3. **Print Preview**: Show ticket preview before download
4. **Offline Support**: Cache tickets for offline viewing
5. **Share Feature**: Share tickets via social media or messaging apps