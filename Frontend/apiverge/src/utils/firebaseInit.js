/**
 * src/utils/firebaseInit.js
 * Initializes and configures the Firebase instance.
 * Place your Firebase configuration here. 
 *
 * Example .env file variables (replace with actual values):
 *   REACT_APP_FIREBASE_API_KEY=...
 *   REACT_APP_FIREBASE_AUTH_DOMAIN=...
 *   REACT_APP_FIREBASE_PROJECT_ID=...
 *   REACT_APP_FIREBASE_STORAGE_BUCKET=...
 *   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
 *   REACT_APP_FIREBASE_APP_ID=...
 */

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

initializeApp(firebaseConfig);
