import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../common/Sidebar";
import TopNavBar from "./TopNavBar";
import PageLoader from "./PageLoader";

const ProtectedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const location = useLocation();

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

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNavBar />
      <div className="flex flex-1 pt-16">
        <AnimatePresence>
          {(sidebarOpen || !isMobile) && (
            <>
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
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
        <div className={`flex-1 overflow-x-hidden transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-6' : ''}`}>
          <AnimatePresence mode="wait">
            {pageLoading ? (
              <PageLoader />
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