// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { signupUser, loginUser, logoutUser } from '../api/auth';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Store user data in localStorage with ID token
  const saveUserToLocalStorage = useCallback((user, idToken = null) => {
    if (user) {
      // Only store non-sensitive data
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        lastLogin: new Date().toISOString(),
        // Store the ID token if provided
        idToken: idToken || null,
      };
      localStorage.setItem('authUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('authUser');
    }
  }, []);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data', error);
        localStorage.removeItem('authUser');
      }
    }

    const auth = getAuth();
    
    // Set persistence immediately
    setPersistence(auth, browserLocalPersistence)
      .catch(error => console.error('Error setting auth persistence:', error));
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        // User is logged in - Get the token first
        firebaseUser.getIdToken(true).then(idToken => {
          // Set current user with all needed data
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || null,
            photoURL: firebaseUser.photoURL || null,
            emailVerified: firebaseUser.emailVerified,
            metadata: {
              creationTime: firebaseUser.metadata?.creationTime,
              lastSignInTime: firebaseUser.metadata?.lastSignInTime,
            },
            getIdToken: async () => await firebaseUser.getIdToken(true),
            idToken: idToken, // Include the token in the current user object
          });
          
          // Save to local storage with the token
          saveUserToLocalStorage(firebaseUser, idToken);
          setLoading(false);
        }).catch(error => {
          console.error('Error getting ID token:', error);
          
          // Still set the user even if token retrieval fails
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || null,
            photoURL: firebaseUser.photoURL || null,
            emailVerified: firebaseUser.emailVerified,
            metadata: {
              creationTime: firebaseUser.metadata?.creationTime,
              lastSignInTime: firebaseUser.metadata?.lastSignInTime,
            },
            getIdToken: async () => await firebaseUser.getIdToken(true),
          });
          
          saveUserToLocalStorage(firebaseUser);
          setLoading(false);
        });
      } else {
        // User is logged out
        setCurrentUser(null);
        saveUserToLocalStorage(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [saveUserToLocalStorage]);

  // Set up a token refresh mechanism
  useEffect(() => {
    // Set up a timer to refresh the token every 45 minutes (before the typical 1-hour expiry)
    if (currentUser) {
      const tokenRefreshInterval = setInterval(async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            const newToken = await user.getIdToken(true);
            
            // Update the currentUser state with the new token
            setCurrentUser(prev => ({
              ...prev,
              idToken: newToken
            }));
            
            // Update the token in localStorage as well
            const storedUser = localStorage.getItem('authUser');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              parsedUser.idToken = newToken;
              localStorage.setItem('authUser', JSON.stringify(parsedUser));
            }
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }, 45 * 60 * 1000); // 45 minutes
      
      return () => clearInterval(tokenRefreshInterval);
    }
  }, [currentUser]);

  /**
   * Signs up a new user by creating a Firebase user and then storing additional
   * user data in Firestore via external API call.
   *
   * @param {Object} userData - Object containing user information
   * @returns {Promise<Object>} Firebase user object
   */
  const signUp = async (userData) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        accountType,
        organizationName,
      } = userData;

      // 1. Create the Firebase user
      const firebaseUser = await signupUser(email, password);

      // 2. Retrieve the ID token from Firebase
      const idToken = await firebaseUser.getIdToken();

      // 3. Build the payload and call the external API
      const payload = {
        email,
        first_name: firstName,
        last_name: lastName,
        account_type: accountType,
        organization_name: accountType === 'organization' ? organizationName : undefined,
      };

      // Update user profile in Firebase
      try {
        await firebaseUser.updateProfile({
          displayName: `${firstName} ${lastName}`, // Fixed template string syntax
        });
        await firebaseUser.reload();
      } catch (profileError) {
        console.error('Error updating user profile:', profileError);
        // Continue even if profile update fails
      }

      // API call to create user in backend
      await axios.post(
        'https://apiverge-base-515423273437.us-central1.run.app/b/user/users',
        payload,
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // Fixed template string syntax
            'Content-Type': 'application/json',
          },
        }
      );
      
      setLoading(false);
      return firebaseUser;
    } catch (error) {
      setLoading(false);
      
      // Format error message for better user experience
      let errorMessage = 'An error occurred during sign up. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please use a different email or try logging in.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please use a stronger password.';
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      setAuthError(errorMessage);
      console.error('Error during sign up:', error);
      throw new Error(errorMessage);
    }
  };

  /**
   * Logs in an existing user and sets the authentication persistence.
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    setAuthError(null);
    setLoading(true);
    
    try {
      const auth = getAuth();
      // Ensure persistence is set
      await setPersistence(auth, browserLocalPersistence);
      const result = await loginUser(email, password);
      
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      
      // Format error message for better user experience
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many unsuccessful login attempts. Please try again later or reset your password.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      }
      
      setAuthError(errorMessage);
      console.error('Login error:', error);
      throw new Error(errorMessage);
    }
  };

  /**
   * Logs out the currently authenticated user.
   */
  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
      localStorage.removeItem('authUser');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Logout error:', error);
      throw error;
    }
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!currentUser;

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    authError,
    signUp,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;