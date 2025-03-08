// src/api/baseApiService.js

import apiClient from './apiConfig';

export const createApiService = (resourceUrl) => {
  return {
    getAll: async (params = {}) => {
      const response = await apiClient.get(resourceUrl, { params });
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`${resourceUrl}/${id}`);
      return response.data;
    },
    
    create: async (data) => {
      const response = await apiClient.post(resourceUrl, data);
      return response.data;
    },
    
    update: async (id, data) => {
      const response = await apiClient.put(`${resourceUrl}/${id}`, data);
      return response.data;
    },
    
    patch: async (id, data) => {
      const response = await apiClient.patch(`${resourceUrl}/${id}`, data);
      return response.data;
    },
    
    remove: async (id) => {
      const response = await apiClient.delete(`${resourceUrl}/${id}`);
      return response.data;
    },
    
    // For custom endpoints that don't follow REST conventions
    custom: async (method, endpoint, data = null, params = {}) => {
      const config = { params };
      const url = endpoint.startsWith('/') ? endpoint : `${resourceUrl}/${endpoint}`;
      
      switch (method.toLowerCase()) {
        case 'get':
          return (await apiClient.get(url, config)).data;
        case 'post':
          return (await apiClient.post(url, data, config)).data;
        case 'put':
          return (await apiClient.put(url, data, config)).data;
        case 'patch':
          return (await apiClient.patch(url, data, config)).data;
        case 'delete':
          return (await apiClient.delete(url, config)).data;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    }
  };
};