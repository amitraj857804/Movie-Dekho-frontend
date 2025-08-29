import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaPlay,
  FaStar,
  FaCreditCard,
  FaShieldAlt,
  FaHeadset,
  FaMobile,
  FaApple,
  FaGooglePlay
} from 'react-icons/fa';
import { MdMovie, MdTheaters, MdLocalMovies } from 'react-icons/md';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MdMovie className="text-primary text-3xl" />
              <h3 className="text-2xl font-bold text-primary">CineBook</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for movie bookings. Experience the magic of cinema with exclusive deals, premium seats, and seamless booking.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaYoutube className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaLinkedinIn className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-primary transition-colors flex items-center space-x-2">
                  <MdLocalMovies className="text-sm" />
                  <span>Movies</span>
                </Link>
              </li>
              <li>
                <Link to="/theaters" className="text-gray-400 hover:text-primary transition-colors flex items-center space-x-2">
                  <MdTheaters className="text-sm" />
                  <span>Theaters</span>
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-400 hover:text-primary transition-colors flex items-center space-x-2">
                  <FaTicketAlt className="text-sm" />
                  <span>My Bookings</span>
                </Link>
              </li>
              <li>
                <Link to="/favorite" className="text-gray-400 hover:text-primary transition-colors flex items-center space-x-2">
                  <FaStar className="text-sm" />
                  <span>Favorites</span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors flex items-center space-x-2">
                  <FaPlay className="text-sm" />
                  <span>Trailers</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Support & Info</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors flex items-center space-x-2">
                  <FaHeadset className="text-sm" />
                  <span>Help Center</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors flex items-center space-x-2">
                  <FaCreditCard className="text-sm" />
                  <span>Payment Options</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Download */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <FaPhone className="text-primary" />
                <span className="text-sm">+91 1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <FaEnvelope className="text-primary" />
                <span className="text-sm">support@cinebook.com</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <FaMapMarkerAlt className="text-primary mt-1" />
                <span className="text-sm">123 Cinema Street, Entertainment District, Mumbai, India</span>
              </div>
            </div>
            
            {/* Download Apps */}
            <div className="pt-4">
              <h5 className="text-sm font-semibold text-white mb-3">Download Our App</h5>
              <div className="flex flex-col space-y-2">
                <a href="#" className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                  <FaApple className="text-white text-xl" />
                  <div>
                    <p className="text-xs text-gray-400">Download on the</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </a>
                <a href="#" className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                  <FaGooglePlay className="text-white text-xl" />
                  <div>
                    <p className="text-xs text-gray-400">Get it on</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Trust Badges */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <FaShieldAlt className="text-primary" />
                <span className="text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <FaCreditCard className="text-primary" />
                <span className="text-sm">All Cards Accepted</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <FaMobile className="text-primary" />
                <span className="text-sm">Mobile Tickets</span>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">VISA</span>
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">MC</span>
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">UPI</span>
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">GPay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 py-6 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} CineBook. All rights reserved. | Made with ❤️ for Movie Lovers
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-primary transition-colors">Site Map</a>
              <span>|</span>
              <a href="#" className="hover:text-primary transition-colors">Careers</a>
              <span>|</span>
              <a href="#" className="hover:text-primary transition-colors">Press</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;