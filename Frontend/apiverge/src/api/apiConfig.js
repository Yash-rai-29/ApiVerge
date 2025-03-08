// src/api/apiConfig.js

import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: 'https://apiverge-base-515423273437.us-central1.run.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get stored user from localStorage
    const storedUser = localStorage.getItem('authUser');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        
        // If we have a getIdToken function (from Firebase)
        if (user.getIdToken) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        } else if (user.idToken) {
          // If we just have a stored token
          config.headers.Authorization = `Bearer ${user.idToken}`;
        }
      } catch (error) {
        console.error('Error applying auth token to request:', error);
      }
    }

    // Handle FormData content type
    if (config.data instanceof FormData) {
      // Don't set content-type as axios will set it with boundary
      delete config.headers['Content-Type'];
    }
    
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Trigger logout if needed
      console.error('Authentication error:', error.response.status);
      console.error('Authentication error:', error.response);
      // You could redirect to login or handle token refresh here
    }
    
    // Format error messages for UI
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.detail || 
                          error.response.data.message || 
                          (typeof error.response.data === 'string' ? error.response.data : 'An error occurred');
      error.displayMessage = errorMessage;
    } else {
      error.displayMessage = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;