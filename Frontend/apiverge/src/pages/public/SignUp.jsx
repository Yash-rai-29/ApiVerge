// src/pages/public/SignUp.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaEnvelope, 
  FaLock, 
  FaGoogle, 
  FaGithub, 
  FaUserAlt, 
  FaBuilding, 
  FaUserTie, 
  FaCheckCircle,
  FaEye,
  FaEyeSlash 
} from 'react-icons/fa';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, loading, authError } = useAuth();
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    accountType: 'individual',
    organizationName: '',
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formStep, setFormStep] = useState(1);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Password strength checker
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };
  
  const handleStepNext = () => {
    setFormStep(2);
  };
  
  const handleStepBack = () => {
    setFormStep(1);
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await signUp(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Sign-up failed');
      setIsLoading(false);
    }
  };
  
  const handleSocialSignUp = (provider) => {
    // Placeholder for social sign up functionality
    console.log(`Sign up with ${provider}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-blue-50 to-indigo-100">
      {/* Left Section - Hidden on mobile */}
      {authError && (
  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start">
    <div className="flex-shrink-0 mt-0.5 mr-2">
      <svg className="h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    </div>
    <div>{authError}</div>
  </div>
)}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">Apiverge</h1>
            <p className="text-blue-200">Revolutionize your API testing workflow</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold mb-6">Why choose Apiverge?</h2>
            <div className="space-y-6">
              <FeatureItem 
                text="AI-powered test generation for comprehensive API coverage"
                delay={0.4}
              />
              <FeatureItem 
                text="Seamless OpenAPI schema integration and validation"
                delay={0.6}
              />
              <FeatureItem 
                text="Real-time performance monitoring and error detection"
                delay={0.8}
              />
              <FeatureItem 
                text="Collaborative workspace for your entire development team"
                delay={1.0}
              />
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="z-10 relative"
        >
          <p className="text-sm text-blue-200">
            "Apiverge has cut our API testing time in half while improving our test coverage by 80%."
          </p>
          <p className="mt-2 font-semibold">Michael Chen, CTO at TechCorp</p>
        </motion.div>
        
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
              {formStep === 1 ? "Create Your Account" : "Complete Your Profile"}
            </h2>
            <p className="mt-2 text-gray-600">
              {formStep === 1 
                ? "Start your journey with Apiverge today" 
                : "Just a few more details to get you started"
              }
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
          
          <form onSubmit={handleSignUp}>
            {/* Step Indicator */}
            <div className="mb-8 relative">
              <div className="flex justify-between items-center">
                <div className={`flex flex-col items-center ${formStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${formStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="text-xs font-medium">Account</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${formStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex flex-col items-center ${formStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${formStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="text-xs font-medium">Profile</span>
                </div>
              </div>
            </div>
            
            {formStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
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
                      placeholder="Create a strong password"
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
                  
                  {/* Password strength indicator */}
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              passwordStrength <= 1 ? 'bg-red-500' : 
                              passwordStrength === 2 ? 'bg-yellow-500' :
                              passwordStrength === 3 ? 'bg-blue-500' : 'bg-green-500'
                            }`} 
                            style={{ width: `${passwordStrength * 25}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {passwordStrength <= 1 ? 'Weak' : 
                           passwordStrength === 2 ? 'Fair' :
                           passwordStrength === 3 ? 'Good' : 'Strong'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Password should be at least 8 characters with uppercase, numbers and symbols.</p>
                    </div>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleStepNext}
                  disabled={!form.email || form.password.length < 8}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-medium 
                    ${!form.email || form.password.length < 8 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                  Continue
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
                      onClick={() => handleSocialSignUp('Google')}
                      className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <FaGoogle className="mr-2 text-red-500" /> 
                      Google
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => handleSocialSignUp('GitHub')}
                      className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <FaGithub className="mr-2" /> 
                      GitHub
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {formStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUserAlt className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        required
                        value={form.firstName}
                        onChange={handleChange}
                        className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-1">
                    <motion.div 
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      onClick={() => setForm({...form, accountType: 'individual'})}
                      className={`cursor-pointer rounded-lg border ${
                        form.accountType === 'individual' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      } p-4 text-center`}
                    >
                      <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        form.accountType === 'individual' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <FaUserAlt />
                      </div>
                      <p className={`font-medium ${form.accountType === 'individual' ? 'text-blue-700' : 'text-gray-700'}`}>
                        Individual
                      </p>
                      <p className="text-xs mt-1 text-gray-500">Personal account for single user</p>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      onClick={() => setForm({...form, accountType: 'organization'})}
                      className={`cursor-pointer rounded-lg border ${
                        form.accountType === 'organization' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      } p-4 text-center`}
                    >
                      <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        form.accountType === 'organization' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <FaBuilding />
                      </div>
                      <p className={`font-medium ${form.accountType === 'organization' ? 'text-blue-700' : 'text-gray-700'}`}>
                        Organization
                      </p>
                      <p className="text-xs mt-1 text-gray-500">Team account with multiple users</p>
                    </motion.div>
                  </div>
                </div>
                
                {form.accountType === 'organization' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUserTie className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="organizationName"
                        id="organizationName"
                        required={form.accountType === 'organization'}
                        value={form.organizationName}
                        onChange={handleChange}
                        className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Acme Inc."
                      />
                    </div>
                  </motion.div>
                )}
                
                <div className="pt-2 flex justify-between space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleStepBack}
                    className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading  || !form.firstName || !form.lastName || (form.accountType === 'organization' && !form.organizationName)}
                    className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-medium 
                      ${loading  || !form.firstName || !form.lastName || (form.accountType === 'organization' && !form.organizationName)
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
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in
            </Link>
          </p>
          
          <p className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Feature Item Component for the left section
const FeatureItem = ({ text, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-start"
  >
    <FaCheckCircle className="text-blue-300 mt-1 mr-3" />
    <p>{text}</p>
  </motion.div>
);

export default SignUp;