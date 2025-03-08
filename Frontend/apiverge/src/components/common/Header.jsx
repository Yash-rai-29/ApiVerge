// src/components/common/Header.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth() || {};

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setSolutionsOpen(false);
    setResourcesOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white text-gray-800 shadow-md py-2' 
          : 'bg-indigo-700 text-white py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative flex items-center">
                {/* Replace with your actual logo SVG or image */}
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-2 text-white font-bold text-lg">
                  A
                </div>
                <span className={`font-bold text-xl ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                  Apiverge
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-1"
          >
            <NavLink to="/" scrolled={scrolled}>
              Home
            </NavLink>
            
            {/* Solutions Dropdown */}
            <div className="relative group">
              <button 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center group-hover:text-blue-600 transition-colors ${
                  scrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-gray-100 hover:text-white'
                }`}
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                Solutions
                <FaChevronDown className="ml-1 h-3 w-3" />
              </button>
              
              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-10"
                    onMouseEnter={() => setSolutionsOpen(true)}
                    onMouseLeave={() => setSolutionsOpen(false)}
                  >
                    <div className="py-1">
                      <DropdownLink to="/solutions#api-testing">
                        API Testing
                      </DropdownLink>
                      <DropdownLink to="/solutions#ai-models">
                        Ai Models
                      </DropdownLink>
                      <DropdownLink to="/solutions#how-it-works">
                        How It Works
                      </DropdownLink>
                      <DropdownLink to="/solutions#industry-solutions">
                        Industry Solutions
                      </DropdownLink>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <NavLink to="/pricing" scrolled={scrolled}>
              Pricing
            </NavLink>
            
            {/* Resources Dropdown */}
            <div className="relative group">
              <button 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center group-hover:text-blue-600 transition-colors ${
                  scrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-gray-100 hover:text-white'
                }`}
                onClick={() => setResourcesOpen(!resourcesOpen)}
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                Resources
                <FaChevronDown className="ml-1 h-3 w-3" />
              </button>
              
              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-10"
                    onMouseEnter={() => setResourcesOpen(true)}
                    onMouseLeave={() => setResourcesOpen(false)}
                  >
                    <div className="py-1">
                      <DropdownLink to="/blog">
                        Blog
                      </DropdownLink>
                      <DropdownLink to="/documentation">
                        Documentation
                      </DropdownLink>
                      <DropdownLink to="/resources/case-studies">
                        Case Studies
                      </DropdownLink>
                      <DropdownLink to="/resources/webinars">
                        Webinars
                      </DropdownLink>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <NavLink to="/about" scrolled={scrolled}>
              About
            </NavLink>
            
            <NavLink to="/contact" scrolled={scrolled}>
              Contact
            </NavLink>
          </motion.nav>

          {/* Auth Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center space-x-3"
          >
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <FaUserCircle className="h-5 w-5" />
                  <span>My Account</span>
                  <FaChevronDown className="h-3 w-3" />
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                  
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={logout}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    scrolled 
                      ? 'text-gray-800 hover:text-blue-700' 
                      : 'text-white hover:text-blue-100'
                  }`}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scrolled 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-white hover:bg-gray-100 text-blue-600'
                  } transition-colors`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md focus:outline-none transition-colors ${
                scrolled 
                  ? 'text-gray-800 hover:text-blue-600' 
                  : 'text-white hover:text-gray-300'
              }`}
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/" onClick={closeMobileMenu}>
                Home
              </MobileNavLink>
              
              <div>
                <button 
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <span>Solutions</span>
                  {solutionsOpen ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
                </button>
                
                {solutionsOpen && (
                  <div className="pl-4 space-y-1">
                    <MobileNavLink to="/solutions#api-testing" onClick={closeMobileMenu}>
                      API Testing
                    </MobileNavLink>
                    <MobileNavLink to="/solutions#ai-models" onClick={closeMobileMenu}>
                      Ai Models
                    </MobileNavLink>
                    <MobileNavLink to="/solutions#how-it-works" onClick={closeMobileMenu}>
                      How It Works
                    </MobileNavLink>
                    <MobileNavLink to="/solutions#industry-solutions" onClick={closeMobileMenu}>
                      Industry Solutions
                    </MobileNavLink>
                  </div>
                )}
              </div>
              
              <MobileNavLink to="/pricing" onClick={closeMobileMenu}>
                Pricing
              </MobileNavLink>
              
              <div>
                <button 
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <span>Resources</span>
                  {resourcesOpen ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
                </button>
                
                {resourcesOpen && (
                  <div className="pl-4 space-y-1">
                    <MobileNavLink to="/blog" onClick={closeMobileMenu}>
                      Blog
                    </MobileNavLink>
                    <MobileNavLink to="/documentation" onClick={closeMobileMenu}>
                      Documentation
                    </MobileNavLink>
                    <MobileNavLink to="/resources/case-studies" onClick={closeMobileMenu}>
                      Case Studies
                    </MobileNavLink>
                    <MobileNavLink to="/resources/webinars" onClick={closeMobileMenu}>
                      Webinars
                    </MobileNavLink>
                  </div>
                )}
              </div>
              
              <MobileNavLink to="/about" onClick={closeMobileMenu}>
                About
              </MobileNavLink>
              
              <MobileNavLink to="/contact" onClick={closeMobileMenu}>
                Contact
              </MobileNavLink>
              
              <div className="pt-4 pb-3 border-t border-gray-200">
                {currentUser ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 flex items-center">
                      <div className="flex-shrink-0">
                        <FaUserCircle className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                          {currentUser.displayName || 'User'}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                    <MobileNavLink to="/dashboard" onClick={closeMobileMenu}>
                      Dashboard
                    </MobileNavLink>
          
                    <button 
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      onClick={logout}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMobileMenu}
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Desktop Navigation Link
const NavLink = ({ to, children, scrolled }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? 'text-blue-600'
          : scrolled 
            ? 'text-gray-700 hover:text-blue-600' 
            : 'text-gray-100 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

// Dropdown Menu Link
const DropdownLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
    >
      {children}
    </Link>
  );
};

// Mobile Navigation Link
const MobileNavLink = ({ to, onClick, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;