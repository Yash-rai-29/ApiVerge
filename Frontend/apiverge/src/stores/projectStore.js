// src/stores/projectStore.js

import { create } from 'zustand';
import { projectsApi } from '../api/projectsApi';

export const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  
  // Load projects
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectsApi.getAll();
      set({ projects: data, isLoading: false });
    } catch (error) {
      set({ error: error.displayMessage || 'Failed to load projects', isLoading: false });
    }
  },
  
  // Load a specific project
  fetchProject: async (id) => {
    if (!id) return;
    
    set({ isLoading: true, error: null });
    try {
      const data = await projectsApi.getById(id);
      set({ currentProject: data, isLoading: false });
    } catch (error) {
      set({ error: error.displayMessage || 'Failed to load project', isLoading: false });
    }
  },
  
  // Create a new project
  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await projectsApi.create(projectData);
      set((state) => ({ 
        projects: [...state.projects, newProject],
        currentProject: newProject,
        isLoading: false
      }));
      return newProject;
    } catch (error) {
      set({ error: error.displayMessage || 'Failed to create project', isLoading: false });
      throw error;
    }
  },
  
  // Update project
  updateProject: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await projectsApi.update(id, data);
      set((state) => ({
        projects: state.projects.map(p => p.id === id ? updatedProject : p),
        currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject,
        isLoading: false
      }));
      return updatedProject;
    } catch (error) {
      set({ error: error.displayMessage || 'Failed to update project', isLoading: false });
      throw error;
    }
  },
  
  // Delete project
  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await projectsApi.remove(id);
      set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.displayMessage || 'Failed to delete project', isLoading: false });
      throw error;
    }
  },
  
  // Clear current project
  clearCurrentProject: () => {
    set({ currentProject: null });
  }
}));