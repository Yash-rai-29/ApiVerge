import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaUsers, FaCreditCard, FaCog, FaSignOutAlt } from "react-icons/fa";

const UserMenu = ({ currentUser, showUserMenu, setShowUserMenu, setShowNotifications, handleLogout }) => {
  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-2 rounded-full focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShowUserMenu(!showUserMenu);
          setShowNotifications(false);
        }}
      >
        {currentUser?.photoURL ? (
          <img 
            src={currentUser.photoURL || 'path/to/default/image.png'} 
            alt={currentUser?.displayName || 'User'} 
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            {currentUser?.displayName?.charAt(0) || 'U'}
          </div>
        )}
        <span className="text-sm text-gray-700 font-medium hidden md:block">
          {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
        </span>
      </button>
      
      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User menu content */}
            {/* ... (Your existing user menu content) ... */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;