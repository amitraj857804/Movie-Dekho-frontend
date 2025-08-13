# 🎬 Cinebook - Movie Booking Platform Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Authentication System](#authentication-system)
9. [Responsive Design](#responsive-design)
10. [Advanced UI Features](#advanced-ui-features)
11. [Installation & Setup](#installation--setup)
12. [Development Guide](#development-guide)
13. [Build & Deployment](#build--deployment)

---

## 🎯 Project Overview

**Cinebook** is a modern, responsive movie booking platform built with React.js and Vite. It provides users with a comprehensive movie browsing and booking experience, featuring user authentication, favorites management, trailer viewing, and a multi-step ticket booking system with advanced seat selection and payment flow.

### Key Highlights
- **Frontend Framework**: React 19 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4.1
- **Icons**: Hero Icons & Lucide React
- **Routing**: React Router DOM 7
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Advanced UI**: Mobile-optimized seat selection with curved screen design
- **Enhanced UX**: Immersive trailer modal with cinematic styling

---

## 🛠️ Tech Stack

### Core Technologies
- **React 19.1.0** - UI Library
- **Vite 7.0.0** - Build Tool & Dev Server
- **Tailwind CSS 4.1.11** - Utility-first CSS Framework
- **TypeScript Ready** - Type safety support

### State Management & Data
- **Redux Toolkit 2.8.2** - State Management
- **React Redux 9.2.0** - React bindings for Redux
- **Axios 1.10.0** - HTTP Client

### UI & UX Libraries
- **@heroicons/react 2.2.0** - Icon library
- **Lucide React 0.525.0** - Additional icons
- **React Icons 5.5.0** - Icon components
- **React Hot Toast 2.5.2** - Toast notifications

### Form & Navigation
- **React Router DOM 7.6.2** - Client-side routing
- **React Hook Form 7.59.0** - Form validation

### Development Tools
- **ESLint 9.29.0** - Code linting
- **Vite React Plugin** - React support for Vite

---

## 📁 Project Structure

```
movie-dekho-frontend/
├── 📁 public/
│   ├── cinebook-logo.svg      # Main logo
│   └── vite.svg              # Vite logo
├── 📁 src/
│   ├── 📁 api/
│   │   └── api.js            # Axios instance & API configuration
│   ├── 📁 assets/
│   │   ├── assets.js         # Asset exports
│   │   ├── backgroundImage.png
│   │   ├── appStore.svg
│   │   ├── googlePlay.svg
│   │   ├── marvelLogo.svg
│   │   ├── profile.png
│   │   ├── screenImage.svg
│   │   ├── chartIcon.svg
│   │   └── favicon.svg
│   ├── 📁 components/
│   │   ├── 📁 auth/          # Authentication components
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OtpLogin.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── UserPanel.jsx
│   │   ├── 📁 inputField/
│   │   │   └── InputField.jsx
│   │   ├── 📁 store/         # Redux store & slices
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── favoritesSlice.js
│   │   │   └── movieSlice.js
│   │   ├── BookTicket.jsx    # Multi-step booking component
│   │   ├── FavoriteButton.jsx
│   │   ├── Footer.jsx
│   │   ├── MovieCard.jsx
│   │   ├── Navbar.jsx
│   │   └── Trailer.jsx
│   ├── 📁 hooks/
│   │   ├── useAuthModal.js
│   │   └── useAuthModalContext.jsx
│   ├── 📁 pages/
│   │   ├── 📁 homepage/
│   │   │   ├── Home.jsx
│   │   │   ├── MovieCarousel.jsx
│   │   │   └── TrendingMovies.jsx
│   │   ├── Favorite.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── Movies.jsx
│   │   ├── MyBookings.jsx
│   │   └── SeatLayout.jsx
│   ├── App.jsx              # Main app component
│   ├── App.css             # Global styles
│   ├── index.css           # Base styles
│   ├── index.js            # Export barrel
│   └── main.jsx            # App entry point
├── eslint.config.js        # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies & scripts
├── vite.config.js         # Vite configuration
└── README.md             # Basic project info
```

---

## ✨ Features

### 🎭 Core Features
1. **Movie Browsing**
   - Grid-based movie catalog
   - Movie search functionality
   - Genre-based filtering
   - Movie details with trailers

2. **User Authentication**
   - Email/password login
   - OTP-based login
   - User registration with validation
   - Password reset functionality
   - Session management with auto-logout
   - User profile management with password change

3. **Advanced Movie Booking System**
   - Multi-step booking process:
     - **Date Selection**: Dynamic date generation (current + next 4 days)
     - **Cinema Selection**: Theater options with facilities
     - **Showtime Selection**: Available time slots with AM/PM formatting
     - **Seat Selection**: Interactive seat layout with real-time availability
   - **Enhanced Seat Layout Features**:
     - Mobile-responsive scrollable seat container
     - Curved cinema screen design with 3D effects
     - Center-aligned seats with dynamic spacing for different row lengths
     - Real-time seat availability updates
     - Visual seat legends (Available, Selected, Booked)
   - **Smart Pricing System**:
     - Dynamic pricing calculation
     - Convenience fee calculation (2% of subtotal)
     - Real-time total updates
- **Comprehensive Data Passing**:
     - Essential date/time information transfer between components
     - Movie details, cinema information, and seat data preservation

4. **Favorites Management**
   - Add/remove movies from favorites
   - Persistent favorites storage
   - Quick access to favorite movies

5. **Enhanced Trailer Experience**
   - **Cinematic Modal Design**: Premium header with gradient backgrounds
   - **Interactive Elements**: Animated close button with rotation effects
   - **Video Optimization**: YouTube embed with HD quality settings
   - **Responsive Design**: Mobile and desktop optimized layouts
   - **Accessibility**: Keyboard navigation (Escape to close)

6. **Responsive Design**
   - Mobile-first approach with optimized touch interactions
   - Tablet optimization with adaptive layouts
   - Desktop layouts with multi-column designs
   - Touch-friendly interfaces with proper spacing

### 🔧 Advanced Features
- **Dynamic Date Generation**: Always shows current date + next 4 days with proper formatting
- **Mobile-Optimized Seat Selection**: Scrollable containers without layout expansion
- **Curved Screen Visualization**: 3D perspective effects for realistic cinema experience
- **Center-Aligned Seat Rows**: Dynamic spacing calculations for different row lengths
- **Enhanced Trailer Modal**: Premium styling with animated interactions
- **Payment Flow Integration**: Seamless navigation to payment gateway
- **State Persistence**: Redux with localStorage integration
- **Route Protection**: Authenticated routes with proper redirects
- **Comprehensive Error Handling**: User-friendly error boundaries and messages
- **Toast Notifications**: Real-time user feedback system

---

## 🏗️ Component Architecture

### 📱 Page Components

#### **Home (`/src/pages/homepage/Home.jsx`)**
- Landing page with hero section
- Movie carousel display
- Trending movies section
- Authentication modal integration

#### **Movies (`/src/pages/Movies.jsx`)**
- Complete movie catalog
- Search and filter functionality
- Grid layout with movie cards

#### **MovieDetails (`/src/pages/MovieDetails.jsx`)**
- Detailed movie information
- Trailer playback
- Booking initiation
- Mobile/desktop responsive layouts
- Tab-based mobile navigation

#### **BookTicket (`/src/components/BookTicket.jsx`)**
- **Multi-step Booking Wizard**:
  1. **Date Selection**: Dynamic date generation with formatted display
  2. **Cinema Selection**: Theater options with location details
  3. **Time Selection**: Available showtimes with AM/PM formatting
- **Data Management**: 
  - Date object processing with day names and month formatting
  - Simple and efficient data passing to seat layout component
  - Responsive design with mobile-optimized interactions

#### **SeatLayout (`/src/pages/SeatLayout.jsx`)**
- **Advanced Seat Selection System**:
  - **Mobile-Responsive Design**: Scrollable seat container without layout expansion
  - **Curved Screen Visualization**: 3D perspective effects for realistic cinema experience
  - **Dynamic Seat Alignment**: Center-aligned seats with spacing for different row lengths
  - **Real-time Availability**: Live seat status updates (Available/Selected/Booked)
  - **Interactive Selection**: Touch-optimized seat selection with visual feedback
- **Enhanced UI Features**:
  - Step-by-step progress indicator (Movie → Seats → Payment → Done)
  - Booking summary with movie details and selected seats
  - Dynamic pricing calculation with convenience fees
  - Legend for seat status understanding
- **Technical Implementation**:
  - Row spacing calculations for center alignment
  - Mobile scroll containers with overflow controls
  - API integration for real-time seat data
  - Comprehensive booking data management

#### **Trailer (`/src/components/Trailer.jsx`)**
- **Cinematic Modal Experience**:
  - **Premium Header Design**: Gradient backgrounds with accent bars
  - **Interactive Close Button**: Animated rotation effects on hover
  - **Enhanced Typography**: Movie title with official trailer branding
  - **Background Effects**: Gradient overlays for premium appearance
- **Video Integration**:
  - YouTube embed optimization with HD quality settings
  - Responsive video container with proper aspect ratios
  - Custom styling for enhanced video presentation
- **User Experience**:
  - Keyboard accessibility (Escape key to close)
  - Click outside to close functionality
  - Body scroll prevention when modal is open
  - Smooth open/close animations

#### **Favorites (`/src/pages/Favorite.jsx`)**
- User's favorite movies collection
- Authentication integration with protected access
- Movie management with add/remove functionality
- Grid layout with responsive design

### 🧩 Reusable Components

#### **Navbar (`/src/components/Navbar.jsx`)**
- **Responsive Navigation System**:
  - Desktop: Horizontal menu with user dropdown
  - Mobile: Hamburger menu with slide-out navigation
  - User authentication status display with loading states
  - Search functionality integration
- **User Experience Features**:
  - Scroll-based background opacity changes
  - Animated user dropdown with profile options
  - Logout functionality with session management
  - Username display with loading fallbacks

#### **MovieCard (`/src/components/MovieCard.jsx`)**
- **Interactive Movie Display Component**:
  - Hover effects with scale transformations
  - Rating and genre information display
  - Book Now and Watch Trailer action buttons
  - Responsive image handling with fallbacks
- **Integration Features**:
  - Navigation to movie details and booking
  - Trailer modal triggering
  - Favorite button integration

#### **FavoriteButton (`/src/components/FavoriteButton.jsx`)**
- **Smart Favorite Management**:
  - Toggle favorite status with visual feedback
  - Multiple size variants (small, medium, large)
  - Authentication state handling
  - Real-time state updates with Redux integration

#### **AuthModal (`/src/components/auth/AuthModal.jsx`)**
- **Modal-based Authentication System**:
  - Tab switching between Login/Register/OTP
  - Form validation with real-time feedback
  - Responsive design for all screen sizes
  - Body scroll prevention when modal is active
- **Advanced Features**:
  - Navigation context preservation
  - Escape key to close functionality
  - Dynamic modal positioning

#### **InputField (`/src/components/inputField/InputField.jsx`)**
- **Reusable Form Input Component**:
  - Validation integration with React Hook Form
  - Error display with customizable styling
  - Multiple input types support
  - Mobile-responsive error handling

---

## 🔄 State Management

### Redux Store Structure

```javascript
store: {
  auth: {
    token: string,
    username: string,
    isLoading: boolean
  },
  movieData: {
    movies: Array,
    isLoading: boolean,
    error: string
  },
  favorites: {
    favorites: Array,
    isLoading: boolean,
    error: string
  }
}
```

### 🎫 Slices Overview

#### **authSlice.js**
- User authentication state
- Token management
- Username fetching
- Login/logout actions

#### **movieSlice.js**
- Movie data management
- Fetch all movies
- Movie caching

#### **favoritesSlice.js**
- User favorites management
- Add/remove favorites
- Fetch user favorites
- Complete movie object storage

---

## 🌐 API Integration

### Base Configuration (`/src/api/api.js`)
```javascript
import axios from "axios";

export default axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});
```

### API Endpoints Used
- **Movies**:
  - `GET /movies` - Fetch all movies
  - `GET /movies/:id` - Get specific movie details
- **Favorites**:
  - `GET /favorites` - Get user favorites
  - `POST /favorites` - Add to favorites
  - `DELETE /favorites` - Remove from favorites
  - `DELETE /favorites/clear` - Clear all favorites
- **Authentication**:
  - `POST /auth/login` - User login
  - `POST /auth/register` - User registration
  - `POST /auth/otp-login` - OTP-based authentication
  - `GET /api/user/profile` - Get user profile
- **Booking System**:
  - `GET /api/seats/slot/:slotId` - Fetch seat layout for specific slot
  - `POST /api/booking` - Create new booking
  - `GET /api/bookings` - Get user bookings

---

## 🔐 Authentication System

### Authentication Flow
1. **User Login** → Token received → Stored in Redux + localStorage
2. **Token Validation** → Username fetched → Stored in state
3. **Route Protection** → Check token validity
4. **Session Expiry** → Auto-logout + notification

### Authentication Context (`/src/hooks/useAuthModalContext.jsx`)
- Modal state management
- Tab switching logic
- Authentication form handling

### Components
- **Login.jsx**: Email/password authentication
- **SignUp.jsx**: User registration
- **OtpLogin.jsx**: OTP-based login
- **ResetPassword.jsx**: Password recovery
- **UserPanel.jsx**: User profile management

---

## 📱 Responsive Design

### Breakpoint Strategy
- **Mobile**: < 640px (sm) - Touch-optimized interfaces
- **Tablet**: 640px - 1024px (md/lg) - Hybrid layouts
- **Desktop**: > 1024px (xl) - Multi-column designs

### Mobile-First Features
- **MovieDetails Mobile Layout**:
  - Full-width hero image with overlay
  - Tab-based navigation (Book Ticket/Movie Details)
  - Touch-optimized interactions with proper spacing
  - Swipe-friendly carousels

- **SeatLayout Mobile Optimization**:
  - **Scrollable Seat Container**: Horizontal scroll within fixed container
  - **Center-Aligned Seats**: Dynamic spacing for different row lengths
  - **Touch-Friendly Selection**: Properly sized touch targets
  - **Mobile Step Indicator**: Simplified progress visualization
  - **Responsive Screen Design**: Curved screen adapts to mobile viewport

- **BookTicket Mobile Enhancement**:
  - Simplified date selection grid
  - Touch-friendly time slot buttons
  - Responsive pricing breakdown
  - Optimized theater selection interface

- **Trailer Modal Responsive Design**:
  - Mobile: Full-screen experience with touch controls
  - Desktop: Centered modal with backdrop
  - Responsive video sizing with proper aspect ratios

### Advanced Responsive Components
- **Grid Layouts**: Adaptive column counts based on screen size
- **Navigation**: Transforms between horizontal menu and hamburger
- **Typography**: Scale-responsive font sizes with mobile readability
- **Touch Targets**: Meet accessibility standards (44px minimum)
- **Scroll Behavior**: Optimized for mobile touch scrolling

### Responsive Design Patterns
```jsx
// Example: Conditional rendering based on screen size
const [isMobileView, setIsMobileView] = useState(false);

useEffect(() => {
  const checkMobileView = () => {
    setIsMobileView(window.innerWidth < 640);
  };
  window.addEventListener("resize", checkMobileView);
  return () => window.removeEventListener("resize", checkMobileView);
}, []);

// Responsive seat spacing calculation
const getRowSpacing = (currentRowSeats, maxSeatsInAnyRow) => {
  const seatDifference = maxSeatsInAnyRow - currentRowSeats;
  return Math.floor(seatDifference / 2);
};
```

---

## 🎨 Advanced UI Features

### Cinema Experience Design
- **Curved Screen Visualization**:
  ```jsx
  // 3D perspective effect for realistic cinema screen
  style={{
    transform: "perspective(300px) rotateX(45deg)",
    borderRadius: "100px 100px 20px 20px",
    background: "linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.4), rgba(99, 102, 241, 0.1))"
  }}
  ```
- **Interactive Seat Selection**:
  - Real-time availability updates
  - Visual feedback on selection
  - Dynamic pricing calculation
  - Mobile scroll optimization

### Enhanced Modal Systems
- **Trailer Modal Enhancements**:
  - Cinematic header design with gradient backgrounds
  - Animated close button with rotation effects
  - Premium styling with accent bars
  - Body scroll prevention and keyboard navigation
- **Authentication Modal**:
  - Tab-based navigation between forms
  - Form validation with real-time feedback
  - Responsive design across all devices

### Mobile-Specific Optimizations
- **Seat Layout Mobile Features**:
  ```jsx
  // Mobile-specific scroll container
  <div className="overflow-x-auto md:overflow-x-visible">
    <div className="flex justify-center md:justify-center min-w-max md:min-w-0">
      {/* Seat rows with dynamic spacing */}
    </div>
  </div>
  ```
- **Touch Interaction Improvements**:
  - Proper touch target sizing
  - Scroll momentum preservation
  - Gesture-friendly navigation

### Animation and Transitions
- **Hover Effects**: Scale transformations and color transitions
- **Loading States**: Smooth loading animations with skeleton screens
- **Step Indicators**: Animated progress visualization
- **Button Interactions**: Hover and active state animations

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/amitraj857804/Movie-Dekho-frontend.git
cd movie-dekho-frontend
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Configuration**
Create `.env` file in root directory:
```env
VITE_BACKEND_URL=your_backend_api_url
```

4. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```

5. **Access Application**
Open [http://localhost:5173](http://localhost:5173)

---

## 🚀 Development Guide

### Available Scripts

```json
{
  "dev": "vite",           // Start development server
  "build": "vite build",   // Production build
  "lint": "eslint .",      // Code linting
  "preview": "vite preview" // Preview production build
}
```

### Development Workflow

1. **Component Development**
   - Create components in appropriate directories
   - Follow naming conventions (PascalCase)
   - Implement responsive design patterns

2. **State Management**
   - Create Redux slices for new features
   - Use createAsyncThunk for API calls
   - Implement proper error handling

3. **Styling Guidelines**
   - Use Tailwind CSS utility classes
   - Follow mobile-first responsive design
   - Maintain consistent spacing and colors

4. **Code Quality**
   - Run ESLint before commits
   - Follow React best practices
   - Use proper prop types and validation

### Key Development Patterns

#### **Mobile-Responsive Seat Layout**
```javascript
// Dynamic spacing calculation for center alignment
const getRowSpacing = (currentRowSeats, maxSeatsInAnyRow) => {
  const seatDifference = maxSeatsInAnyRow - currentRowSeats;
  const spacesOnEachSide = Math.floor(seatDifference / 2);
  return spacesOnEachSide;
};

// Mobile scroll container implementation
<div className="overflow-x-auto md:overflow-x-visible">
  <div className="flex justify-center min-w-max md:min-w-0">
    {/* Leading spacers for mobile center alignment */}
    {Array.from({ length: spacingCount }, (_, index) => (
      <div key={`spacer-start-${index}`} className="w-8 h-8 md:hidden"></div>
    ))}
    {/* Seat elements */}
    {/* Trailing spacers */}
  </div>
</div>
```

#### **Simple Data Passing Between Components**
```javascript
// Streamlined booking data structure
const handleTimeSelect = (time, slot, amPm) => {
  const selectedDateObj = dates.find((d) => d.date === selectedDate);
  
  navigate(`/movies/${id}/seat-selection`, {
    state: {
      movie,
      selectedDateObj: selectedDateObj, // Complete date object
      selectedTimeWithAmPm: `${time}${amPm}`, // Formatted time
      selectedCinema: slot,
    }
  });
};
```

#### **Responsive Modal Design**
```jsx
// Trailer modal with enhanced styling
const TrailerModal = ({ isOpen, onClose, movie }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-[999] bg-transparent backdrop-blur-sm">
      <div className="relative bg-gray-900 rounded-xl shadow-2xl">
        {/* Enhanced header with gradient */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          {/* Premium styling implementation */}
        </div>
      </div>
    </div>
  );
};
```

#### **Redux Integration with Enhanced Error Handling**
```javascript
// Enhanced async thunks with comprehensive error handling
export const fetchAllMovies = createAsyncThunk(
  'movies/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/movies');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movies');
    }
  }
);

// Component integration with loading states
const Component = () => {
  const movies = useSelector(selectAllMovies);
  const isLoading = useSelector(selectMoviesLoading);
  const error = useSelector(selectMoviesError);
  
  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchAllMovies());
    }
  }, [dispatch, movies.length]);
};
```

#### **Advanced CSS Transformations**
```css
/* Curved cinema screen effect */
.cinema-screen {
  transform: perspective(300px) rotateX(45deg);
  background: linear-gradient(to right, 
    rgba(99, 102, 241, 0.1), 
    rgba(99, 102, 241, 0.4), 
    rgba(99, 102, 241, 0.1)
  );
  border-radius: 100px 100px 20px 20px;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

/* Mobile seat container scroll */
.seat-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
```

---

## 🏭 Build & Deployment

### Production Build

1. **Build Application**
```bash
npm run build
```

2. **Preview Build**
```bash
npm run preview
```

### Build Output
- Optimized JavaScript bundles
- Minified CSS
- Asset optimization
- Tree-shaking for smaller bundle size

### Deployment Options
- **Vercel**: Optimal for Vite projects
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting option
- **Custom Server**: Express.js integration

### Environment Variables for Production
```env
VITE_BACKEND_URL=https://your-production-api.com
```

---

## 📚 Additional Resources

### File Naming Conventions
- Components: `PascalCase.jsx`
- Utilities: `camelCase.js`
- Constants: `UPPER_CASE.js`
- Styles: `kebab-case.css`

### Folder Organization
- Group related components together
- Separate pages from reusable components
- Keep styles close to components
- Centralize utilities and helpers

### Performance Considerations
- **Lazy Loading**: Route-based code splitting for optimal bundle sizes
- **Image Optimization**: Responsive image loading with proper sizing
- **Bundle Splitting**: Component-level code splitting for faster initial loads
- **Caching Strategies**: Redux state persistence and API response caching
- **Mobile Optimization**: 
  - Touch event optimization for seat selection
  - Scroll performance improvements with hardware acceleration
  - Optimized re-renders with React.memo and useMemo

### Recent Enhancements
- **Enhanced Seat Selection**: Mobile-responsive scrollable containers with center alignment
- **Curved Screen Design**: 3D perspective effects for realistic cinema visualization
- **Trailer Modal Redesign**: Premium styling with animated interactions
- **Streamlined Data Flow**: Essential date/time information passing between components
- **Advanced Mobile UX**: Touch-optimized interfaces with proper spacing and scroll behavior

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Amit Raj**
- GitHub: [@amitraj857804](https://github.com/amitraj857804)
- Email: amitraj857804@gmail.com

---

*Last Updated: December 2025*
