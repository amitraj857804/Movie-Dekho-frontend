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
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthModalProvider } from "./hooks/useAuthModalContext.jsx";


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
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />
       
      </Routes>
      {!isAdminRoute && <Footer />}
      </AuthModalProvider>
    </>
  );
}

export default App;
