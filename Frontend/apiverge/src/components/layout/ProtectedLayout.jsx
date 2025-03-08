import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";  // Ensure this hook is properly defined
import Sidebar from "../common/Sidebar";
import { 
  FaBars, 
  FaTimes, 
  FaUserCircle, 
  FaBell, 
  FaSearch, 
  FaQuestionCircle,
  FaCog,
  FaCreditCard,
  FaUsers,
  FaSignOutAlt
} from "react-icons/fa";

const ProtectedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Invoke the hook properly
  const { currentUser, logout } = useAuth() || { 
    currentUser: { displayName: 'Demo User', email: 'user@example.com', photoURL: null },
    logout: () => console.log('Logout') 
  };

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      } else if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowUserMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Simulated notifications (would come from your backend/API)
  useEffect(() => {
    setNotifications([
      { id: 1, type: 'info', message: 'Your API test suite completed successfully', time: '10 min ago', read: false },
      { id: 2, type: 'warning', message: 'Performance degradation detected in payment API', time: '1 hour ago', read: false },
      { id: 3, type: 'error', message: 'Authentication failed for order API endpoint', time: '3 hours ago', read: true },
    ]);
  }, []);

  // Page transition
  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Get appropriate class for notification
  const getNotificationClass = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30 h-16">
        <div className="flex h-full px-4 items-center justify-between">
          {/* Left Side - Logo and Menu Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            
            <div className="ml-4 flex items-center">
              <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="ml-2 font-semibold text-gray-900">Apiverge</span>
            </div>
          </div>
          
          {/* Center - Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search APIs, test cases, projects..."
              />
            </form>
          </div>
          
          {/* Right Side - User Controls */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Help Button */}
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100">
              <FaQuestionCircle className="text-lg" />
            </button>
            
            {/* Notifications */}
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
              
              {/* Notifications Dropdown */}
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
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-3 border-b border-gray-100 flex items-start ${notification.read ? 'opacity-60' : ''}`}
                          >
                            <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm text-gray-800">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-200 text-center">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* User Menu */}
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
              
              {/* User Dropdown Menu */}
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
                    <div className="p-3 border-b border-gray-200">
                      <p className="font-medium text-gray-900">{currentUser?.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                    </div>
                    <div className="py-1">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaUserCircle className="mr-2 text-gray-500" />
                        Profile
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaUsers className="mr-2 text-gray-500" />
                        Team Members
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaCreditCard className="mr-2 text-gray-500" />
                        Billing
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaCog className="mr-2 text-gray-500" />
                        Settings
                      </button>
                    </div>
                    <div className="py-1 border-t border-gray-100">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || !isMobile) && (
            <>
              {/* Mobile Overlay */}
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
              
              {/* Sidebar Component */}
              <motion.aside
                initial={isMobile ? { x: -280 } : { x: 0 }}
                animate={{ x: 0 }}
                exit={isMobile ? { x: -280 } : { x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed md:sticky top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 z-30`}
              >
                <Sidebar closeSidebar={() => isMobile && setSidebarOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className={`flex-1 overflow-x-hidden transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64' : ''}`}>
          <AnimatePresence mode="wait">
            {pageLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50"
              >
                <div className="loader">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              </motion.div>
            ) : (
              <motion.main
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 md:p-6 lg:p-8"
              >
                <Outlet />
              </motion.main>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
