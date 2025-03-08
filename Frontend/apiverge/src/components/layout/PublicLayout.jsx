// src/components/layout/PublicLayout.jsx

import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { FaArrowUp } from "react-icons/fa";

const PublicLayout = () => {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // Handle route changes for page transitions
  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
      // Scroll to top on page change
      window.scrollTo(0, 0);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Background decorative elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      {/* Header */}
      <Header />
      
      {/* Main Content with Page Transitions */}
      <main className="flex-grow relative z-10 pt-20">
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
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full mx-auto"
            >
              {/* Page-specific content */}
              <div className="container mx-auto px-4 md:px-8 py-4 md:py-8">
                <Outlet />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <Footer />
      
      {/* Cookie Consent Banner - Can be shown conditionally */}
      <CookieConsent />
    </div>
  );
};

// Simple Cookie Consent Banner Component
const CookieConsent = () => {
  const [show, setShow] = useState(true);
  
  // Check if consent was already given
  useEffect(() => {
    const consentGiven = localStorage.getItem('cookie-consent');
    if (consentGiven) {
      setShow(false);
    }
  }, []);
  
  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };
  
  if (!show) return null;
  
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm mb-4 sm:mb-0 sm:mr-6">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          <a href="/cookies" className="underline ml-1 text-blue-300 hover:text-blue-200">Learn more</a>
        </p>
        <div className="flex space-x-3">
          <button 
            onClick={acceptCookies}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            Accept
          </button>
          <button 
            onClick={() => setShow(false)}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicLayout;