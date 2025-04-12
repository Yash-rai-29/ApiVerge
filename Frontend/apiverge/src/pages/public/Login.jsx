// src/pages/public/Login.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaEnvelope, 
  FaLock, 
  FaGoogle, 
  FaGithub, 
  FaEye, 
  FaEyeSlash,
  FaShieldAlt,
  FaCode,
  FaRocket
} from 'react-icons/fa';


const Login = () => {
  const navigate = useNavigate();
  const { login, loading, authError } = useAuth();
  
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    }
  };
  
  const handleSocialLogin = (provider) => {
    // Placeholder for social login functionality
    console.log(`Login with ${provider}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-blue-50 to-indigo-100">
      {/* Left Section - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-800 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-indigo-200">Log in to continue your API testing journey</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16"
          >
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start"
              >
                <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
                  <FaShieldAlt className="text-2xl fill-indigo-800" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Secure Testing Environment</h3>
                  <p className="text-indigo-200">Your API credentials and test data are encrypted and secure</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-start"
              >
                <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
                  <FaCode className="text-2xl fill-indigo-800" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Intelligent API Analysis</h3>
                  <p className="text-indigo-200">AI-powered insights to improve your API performance and security</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-start"
              >
                <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
                  <FaRocket className="text-2xl fill-indigo-800" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Streamlined Workflow</h3>
                  <p className="text-indigo-200">Pick up right where you left off with your saved test suites</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white"></div>
          <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-white"></div>
        </div>
      </div>
      
      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Log In to Your Account
            </h2>
            <p className="mt-2 text-gray-600">
              Access your API testing dashboard and projects
            </p>
          </div>
            
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start"
            >
              <div className="flex-shrink-0 mt-0.5 mr-2">
                <svg className="h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>{error}</div>
            </motion.div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading  || !form.email || !form.password}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-medium 
                ${loading  || !form.email || !form.password
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {loading  ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </motion.button>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FaGoogle className="mr-2 text-red-500" /> 
                  Google
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FaGithub className="mr-2" /> 
                  GitHub
                </motion.button>
              </div>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up for free
            </Link>
          </p>

{authError && (
  <div className="mb-4 text-red-500 text-sm">
    {authError}
  </div>
)}

          
          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex justify-center space-x-4">
              <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-700">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-700">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-xs text-gray-500 hover:text-gray-700">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;