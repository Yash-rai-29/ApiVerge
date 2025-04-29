import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaBell, FaSearch, FaQuestionCircle, FaCog, FaCreditCard, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import NotificationsDropdown from "./NotificationsDropdown";
import UserMenu from "./UserMenu";

const TopNavBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30 h-16">
      <div className="flex h-full px-4 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="ml-4 flex items-center">
            <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="ml-2 font-semibold text-gray-900">Apiverge</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2blue-500 focus:border-blue-500"
              placeholder="Search APIs, test cases, projects..."
            />
          </form>
        </div>

        {/* User Controls */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100">
            <FaQuestionCircle className="text-lg" />
          </button>
          
          <NotificationsDropdown 
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            setShowUserMenu={setShowUserMenu}
          />
          
          <UserMenu 
            currentUser={currentUser}
            showUserMenu={showUserMenu}
            setShowUserMenu={setShowUserMenu}
            setShowNotifications={setShowNotifications}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;