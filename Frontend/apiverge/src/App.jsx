// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryProvider } from './contexts/QueryContext';
import PrivateRoute from './routes/PrivateRoute';
import PublicOnlyRoute from './routes/PublicOnlyRoute';
// Layouts
import PublicLayout from './components/layout/PublicLayout';
import ProtectedLayout from './components/layout/ProtectedLayout';

// Public Pages
import Home from './pages/public/Home';
import Pricing from './pages/public/Pricing';
import Solutions from './pages/public/Solutions';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';
import Terms from './pages/public/Terms';
import Features from './pages/public/Features';

// Protected Pages
import Dashboard from './pages/protected/Dashboard';
import Team from './pages/protected/Team';
import Settings from './pages/protected/Settings';
import Profiles from './pages/protected/Profiles';
import Projects from './pages/protected/Projects';
import Billings from './pages/protected/Billings';

import Notifications from './components/common/Notifications';


function App() {
  return (
    <AuthProvider>
    <QueryProvider>
      <Notifications />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/features" element={<Features />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Public Routes that should redirect authenticated users */}
          <Route 
            path="/login" 
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicOnlyRoute>
                <SignUp />
              </PublicOnlyRoute>
            } 
          />
        </Route>

        {/* Protected Routes */}
        <Route 
          element={
            <PrivateRoute>
              <ProtectedLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/projects/*" element={<Projects />} />
          <Route path="/billings" element={<Billings />} />
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryProvider>
  </AuthProvider>
  );
}

// Simple 404 Page
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page not found</p>
      <a 
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

export default App;