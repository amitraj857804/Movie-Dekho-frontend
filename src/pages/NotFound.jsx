
import { Link, useNavigate } from 'react-router-dom';
import { MdError, MdHome, MdArrowBack, MdLocalMovies } from 'react-icons/md';
import { FaFilm, FaSearch } from 'react-icons/fa';

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py">
      <div className="max-w-2xl mx-auto text-center pt-30 relative">
        {/* Error Icon and Code */}
        <div className="mb-8">
          <div className="flex justify-center items-center mb-4">
            <MdError className="text-red-500 text-5xl animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">404</h1>
          <div className="flex items-center justify-center space-x-2 text-primary">
            <FaFilm className="text-2xl" />
            <span className="text-xl font-semibold">Page Not Found</span>
            <FaFilm className="text-2xl" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Oops! This page seems to have gone missing
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            The page you're looking for doesn't exist or may have been moved. 
            Don't worry, let's get you back to enjoying great movies!
          </p>
        </div>

        {/* Suggestions */}
        <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">What you can do:</h3>
          <ul className="text-gray-300 space-y-2 text-left">
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span>Check if the URL is typed correctly</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span>Go back to the previous page</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span>Visit our homepage to browse movies</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span>Use the search feature to find what you're looking for</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto"
          >
            <MdArrowBack className="text-xl" />
            <span>Go Back</span>
          </button>
          
          <Link
            to="/"
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto text-center"
          >
            <MdHome className="text-xl" />
            <span>Home Page</span>
          </Link>
          
          <Link
            to="/movies"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto text-center"
          >
            <MdLocalMovies className="text-xl" />
            <span>Browse Movies</span>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            Still need help? {' '}
            <a 
              href="mailto:amitraj857804@gmail.com" 
              className="text-primary hover:text-primary-light transition-colors"
            >
              Contact our support team
            </a>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-4 opacity-20 pb-10">
          <FaFilm className="text-4xl text-gray-500 animate-bounce" style={{ animationDelay: '0s' }} />
          <FaFilm className="text-4xl text-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <FaFilm className="text-4xl text-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}

export default NotFound;
