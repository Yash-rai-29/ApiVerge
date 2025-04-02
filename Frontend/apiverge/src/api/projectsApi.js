// src/api/projectsApi.js

import apiClient from './apiConfig';

// Base API path for projects
const BASE_PATH = '/b/projects/';

export const projectsApi = {
  // Get all projects
  getAll: async () => {
    const response = await apiClient.get(BASE_PATH);
    return response.data;
  },
  
  // Get a single project by ID
  getById: async (projectId) => {
    const response = await apiClient.get(`${BASE_PATH}${projectId}`);
    return response.data;
  },
  
  // Create a new project
  create: async (projectData) => {
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(projectData).forEach(key => {
      // Skip file fields initially - we'll handle them separately
      if (key !== 'openapi_file') {
        formData.append(key, projectData[key]);
      }
    });
    
    // Add required fields if missing
    if (!formData.get('name')) {
      throw new Error('Project name is required');
    }
    
    // Set defaults for required fields
    if (!formData.get('type')) {
      formData.append('type', 'url');  // Default to URL type
    }
    
    if (!formData.get('account_type')) {
      formData.append('account_type', 'individual'); // Default to individual
    }
    
    // Handle file upload if present
    if (projectData.openapi_file) {
      formData.append('openapi_file', projectData.openapi_file);
    }
    
    const response = await apiClient.post(BASE_PATH, formData);
    return response.data;
  },
  
  // Update an existing project
  update: async (projectId, projectData) => {
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(projectData).forEach(key => {
      // Skip file fields initially
      if (key !== 'openapi_file') {
        // Only add fields that have values
        if (projectData[key] !== undefined && projectData[key] !== null) {
          formData.append(key, projectData[key]);
        }
      }
    });
    
    // Handle file upload if present
    if (projectData.openapi_file) {
      formData.append('openapi_file', projectData.openapi_file);
    }
    
    const response = await apiClient.put(`${BASE_PATH}${projectId}`, formData);
    return response.data;
  },
  
  // Delete a project
  delete: async (projectId) => {
    const response = await apiClient.delete(`${BASE_PATH}${projectId}`);
    return response.data;
  },
  
  // Import OpenAPI spec
  importOpenApi: async (projectId, specData) => {
    const formData = new FormData();
    
    if (specData.type === 'url') {
      formData.append('openapi_url', specData.url);
    } else if (specData.type === 'file' && specData.file) {
      formData.append('openapi_file', specData.file);
    } else {
      throw new Error('Invalid OpenAPI specification data');
    }
    
    const response = await apiClient.post(`${BASE_PATH}${projectId}/import-schema`, formData);
    return response.data;
  },
  
  // Run tests for a project
  runTests: async (projectId, testConfig = {}) => {
    const response = await apiClient.post(`${BASE_PATH}${projectId}/run-tests`, testConfig);
    return response.data;
  },
  
  // Get project performance metrics
  getPerformance: async (projectId, timeRange = '7d') => {
    const response = await apiClient.get(`${BASE_PATH}${projectId}/performance`, {
      params: { timeRange }
    });
    return response.data;
  },
  
  // Get project endpoints
  getEndpoints: async (projectId) => {
    const response = await apiClient.get(`${BASE_PATH}${projectId}/endpoints`);
    return response.data;
  },
  
  // Get test history for a project
  getTestHistory: async (projectId) => {
    const response = await apiClient.get(`${BASE_PATH}${projectId}/test-history`);
    return response.data;
  }
};