import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell } from "react-icons/fa";

const NotificationsDropdown = ({ showNotifications, setShowNotifications, setShowUserMenu }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([
      { id: 1, type: 'info', message: 'Your API test suite completed successfully', time: '10 min ago', read: false },
      { id: 2, type: 'warning', message: 'Performance degradation detected in payment API', time: '1 hour ago', read: false },
      { id: 3, type: 'error', message: 'Authentication failed for order API endpoint', time: '3 hours ago', read: true },
    ]);
  }, []);

  return (
    <div className="relative">
      <button 
        className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 relative"
        onClick={(e) => {
          e.stopPropagation();
          setShowNotifications(!showNotifications);
          setShowUserMenu(false);
        }}
      >
        <FaBell className="text-lg" />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform translate-x-1.5 -translate-y-1.5"></span>
        )}
      </button>
      
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Notifications content */}
            {/* ... (Your existing notifications content) ... */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;