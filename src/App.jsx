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
  SignUpPage,
} from "./index.js";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0);
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MoviesDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
