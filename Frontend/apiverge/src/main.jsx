import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryProvider } from './contexts/QueryContext';
import { DataProvider } from './contexts/DataContext';

import './utils/firebaseInit'; // Create this file to hold your Firebase config.
import './index.css';

// Log to indicate that the main entry point is executing.
console.log('Rendering main app...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <DataProvider>
        <App />
        </DataProvider>
      </AuthProvider>
    </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
