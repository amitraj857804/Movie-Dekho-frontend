import { useState } from "react";
import "./App.css";
import {
  Home,
  Navbar,
  Footer,
  Movies,
  MoviesDetails,
  SeatLayout,
  MyBookings,
  Favorite,
} from "./index.js";
import Payment from "./pages/Payment.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthModalProvider } from "./hooks/useAuthModalContext.jsx";
import UserPanel from "./components/auth/UserPanel.jsx";

function App() {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  return (
    <>
      <Toaster />
      <AuthModalProvider>
        {!isAdminRoute && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MoviesDetails />} />
          <Route path="/movies/:id/seat-selection" element={<SeatLayout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/info" element={<UserPanel />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/favorite" element={<Favorite />} />
        </Routes>
        {!isAdminRoute && <Footer />}
      </AuthModalProvider>
    </>
  );
}

export default App;
