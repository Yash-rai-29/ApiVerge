// src/stores/uiStore.js

import { create } from 'zustand';

// Store for UI state
export const useUiStore = create((set) => ({
  sidebarOpen: window.innerWidth >= 768, // Default open on desktop
  darkMode: localStorage.getItem('darkMode') === 'true',
  selectedProject: null,
  notification: null,
  
  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  openSidebar: () => set({ sidebarOpen: true }),
  
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.darkMode;
    localStorage.setItem('darkMode', newDarkMode);
    return { darkMode: newDarkMode };
  }),
  
  setSelectedProject: (project) => set({ selectedProject: project }),
  
  showNotification: (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    set({ notification: { id, message, type } });
    
    // Auto-dismiss
    if (duration) {
      setTimeout(() => {
        set((state) => {
          if (state.notification?.id === id) {
            return { notification: null };
          }
          return state;
        });
      }, duration);
    }
  },
  
  dismissNotification: () => set({ notification: null }),
}));