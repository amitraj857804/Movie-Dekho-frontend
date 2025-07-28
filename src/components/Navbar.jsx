import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAuthModalContext } from "../hooks/useAuthModalContext";

import {
  fetchUserName,
  selectUsername,
  selectUsernameLoading,
  selectToken,
  clearToken,
  clearUserName,
} from "./store/authStore";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = useSelector(selectUsername);
  const token = useSelector(selectToken);
  const isLoading = useSelector(selectUsernameLoading);
  const { openAuthModal } = useAuthModalContext();

  useEffect(() => {
    if (token && !username) {
      dispatch(fetchUserName())
        .unwrap()
        .then((username) => {
          // Username fetched successfully
        })
        .catch((error) => {
          dispatch(clearToken());
          toast.error("Session expired. Please login again.");
        });
    }
  }, [token, username, dispatch]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loginHandler = () => {
    
    openAuthModal("login");
  };

  const logoutHandler = () => {
    dispatch(clearToken());
    dispatch(clearUserName());
    setShowLogoutDropdown(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between
       px-6 md:px-16 lg:px36 py-5 sm:py-3 transition-all duration-300 ${
         isScrolled
           ? "backdrop-blur-sm bg-black/70 bordwer-b border-gray-300/20 shadow-lg"
           : "bg-transparent"
       }`}
    >
      <Link to="/" className="max-lg:flex-1">
        <img src={assets.logo} alt="" className="w-36 h-auto" />
      </Link>

      <div
        className={`max-lg:absolute max-lg:top-0 max-lg:left-0 max-lg:font-medium
      max-lg:text-lg z-50 flex flex-col lg:flex-row items-center max-lg:justify-center
      gap-8 min-lg:px-8 py-3 max-lg:h-screen min-lg:rounded-full backdrop-blur-sm
      ${
        isScrolled
          ? "bg-black/90 lg:bg-white/20 lg:border border-gray-300/30"
          : "bg-black/70 lg:bg-white/10 lg:border border-gray-300/20"
      } overflow-hidden
      transition-all duration-300 ${isOpen ? "max-lg:w-full" : "max-lg:w-0"}`}
      >
        <XIcon
          className="lg:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <Link
          onClick={() => {
            scrollTo(0, 0), setIsOpen(false);
          }}
          to="/"
        >
          Home
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0), setIsOpen(false);
          }}
          to="/movies"
        >
          Movies
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0), setIsOpen(false);
          }}
          to="/"
        >
          Theatres
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0), setIsOpen(false);
          }}
          to="/"
        >
          Releases
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0), setIsOpen(false);
          }}
          to="/favorite"
        >
          Favourite
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <SearchIcon className="max-lg:hidden w-6 h-6 cursor-pointer" />

        {token ? (
          <div className="relative">
            {isLoading ? (
              <span className="text-sm animate-pulse">Loading user...</span>
            ) : username ? (
              <div className="relative">
                <div
                  className={`flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
                    isScrolled
                      ? "bg-black/60 hover:bg-white/20"
                      : "bg-black/40 hover:bg-white/15"
                  }`}
                  onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-white">
                    Hi,{" "}
                    <span className="text-primary">{username?.charAt(0)}</span>
                    {username?.slice(1)}!
                  </span>
                  <svg
                    className={`w-4 h-4 text-white transition-transform ${
                      showLogoutDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {showLogoutDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        navigate("/user-panel");
                        setShowLogoutDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Your Profile
                    </button>
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => dispatch(fetchUserName())}
                className="text-xs bg-yellow-500 text-black px-2 py-1 rounded"
              >
                Retry Load User
              </button>
            )}
          </div>
        ) : (
          <button
            className={`px-3 py-1 sm:px-7 sm:py-2 bg-primary text-white hover:!bg-black/70 hover:lg:!bg-white/20  hover:border hover:border-gray-300/20
          transition-all duration-300 rounded-full font-medium cursor-pointer hover:scale-105 hover:shadow-lg backdrop-blur-sm ${
            isScrolled
              ? "hover:!bg-black/90 hover:lg:!bg-white/20"
              : "hover:!bg-black/70 hover:lg:!bg-white/10"
          }`}
            onClick={loginHandler}
          >
            Login/Signup
          </button>
        )}
      </div>
      <MenuIcon
        className="max-lg:ml-4 lg:hidden w-8 h-8 cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
    </div>
  );
}

export default Navbar;
