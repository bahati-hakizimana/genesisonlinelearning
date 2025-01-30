import { FaSearch, FaBars, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import avatar from "../assets/images/avatar.png";
import Login from "../pages/Modals/Login.jsx";
import Register from "../pages/Modals/Registration.jsx";
import Profile from "../pages/Modals/UserProfile.jsx";
import logout from "../constants/logout.js";
import ForgotPassword from "../pages/Modals/ForgotPassword.jsx";

const shortcuts = [
  { name: "About Us", path: "/about-us" },
  { name: "Scheme of Work", path: "/scheme-of-work" },
  { name: "Lesson Plan", path: "/lesson-plan" },
  { name: "Books", path: "/books" },
  { name: "Notes", path: "/notes" },
  { name: "Exams", path: "/exams" },
  { name: "Works", path: "/works" },
  { name: "Downloads", path: "/downloads" },
];

function AuthHeader({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleLogout = async () => {
    await logout(setIsLoading);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target)
    ) {
      setNotificationsOpen(false);
    }
  };

  const handleSearchChange = (event) => {
    const trimmedSearchTerm = event.target.value.trim().toLowerCase();
    setSearchTerm(trimmedSearchTerm);
    if (trimmedSearchTerm) {
      const filteredSuggestions = shortcuts.filter((shortcut) =>
        shortcut.name.toLowerCase().includes(trimmedSearchTerm)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch notifications (mocked for now)
    const fetchNotifications = async () => {
      const fetchedNotifications = [
        { id: 1, message: "Your subscription is about to expire!" },
        { id: 2, message: "New notes have been added to the Biology section." },
      ];
      setNotifications(fetchedNotifications);
    };
    fetchNotifications();
  }, []);

  return (
    <header className="bg-[#333333] sticky top-0 left-0 min-h-20 w-full shadow-md z-50">
      <div className="flex h-full items-center justify-between max-w-7xl mx-auto px-4 py-3">
        <div className="flex space-x-6">
          <button
            onClick={toggleSidebar}
            className="px-2 bg-transparent text-white rounded-md focus:outline-none"
          >
            <FaBars className="h-6 w-6" />
          </button>

          <form className="hidden sm:flex items-center relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="px-3 py-2 bg-white border border-gray-600 rounded-l-md focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-500 transition flex items-center justify-center"
            >
              <FaSearch className="h-5 w-5" />
            </button>
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-10">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    <Link to={suggestion.path}>{suggestion.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        <div className="relative mr-8 flex items-center space-x-4" ref={dropdownRef}>
          {user ? (
            <>
              {/* Notification Icon */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative"
                >
                  <FaBell className="h-6 w-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-xs rounded-full px-1">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-2 border-b text-gray-700 hover:bg-gray-100"
                        >
                          {notification.message}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-700">No new notifications</div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-white"
              >
                <span className="text-sm">{user?.first_name + " " + user?.last_name || "User"}</span>
                <img
                  src={avatar}
                  alt={`${user?.name || "User"}'s avatar`}
                  className="h-8 w-8 rounded-full"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {isLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex space-x-6">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
                >
                  Register
                </button>
              </div>
              <Login
                isModalOpen={isLoginModalOpen}
                setIsModalOpen={setIsLoginModalOpen}
                setIsRegisterModalOpen={setIsRegisterModalOpen}
              />
              <Register
                isModalOpen={isRegisterModalOpen}
                setIsModalOpen={setIsRegisterModalOpen}
                setIsLoginModalOpen={setIsLoginModalOpen}
              />
              <ForgotPassword
                isModalOpen={isForgotPasswordModalOpen}
                setIsModalOpen={setIsForgotPasswordModalOpen}
                setIsForgotPasswordModalOpen={setIsForgotPasswordModalOpen}
              />
            </>
          )}
        </div>
      </div>
      <Profile isModalOpen={isProfileModalOpen} setIsModalOpen={setIsProfileModalOpen} />
    </header>
  );
}

AuthHeader.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default AuthHeader;