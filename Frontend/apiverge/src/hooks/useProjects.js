// src/hooks/useProjects.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projectsApi';

// Hook to fetch all projects
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });
};

// Hook to fetch a single project
export const useProject = (projectId) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId),
    enabled: !!projectId, // Only fetch if projectId is provided
  });
};

// Hook to create a new project
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (projectData) => projectsApi.create(projectData),
    onSuccess: () => {
      // Invalidate projects list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// Hook to update a project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, data }) => projectsApi.update(projectId, data),
    onSuccess: (data) => {
      // Invalidate both the projects list and the specific project
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.id] });
    },
  });
};

// Hook to delete a project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (projectId) => projectsApi.delete(projectId),
    onSuccess: () => {
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// Hook to import OpenAPI spec to a project
export const useImportOpenApi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, specData }) => projectsApi.importOpenApi(projectId, specData),
    onSuccess: (_, variables) => {
      // Invalidate the specific project and its endpoints
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['endpoints', variables.projectId] });
    },
  });
};

// Hook to run tests for a project
export const useRunTests = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, testConfig }) => projectsApi.runTests(projectId, testConfig),
    onSuccess: (_, variables) => {
      // Invalidate test history
      queryClient.invalidateQueries({ queryKey: ['test-history', variables.projectId] });
    },
  });
};

// Hook to fetch project endpoints
export const useProjectEndpoints = (projectId) => {
  return useQuery({
    queryKey: ['endpoints', projectId],
    queryFn: () => projectsApi.getEndpoints(projectId),
    enabled: !!projectId,
  });
};

// Hook to fetch project test history
export const useProjectTestHistory = (projectId) => {
  return useQuery({
    queryKey: ['test-history', projectId],
    queryFn: () => projectsApi.getTestHistory(projectId),
    enabled: !!projectId,
  });
};

// Hook to fetch project performance data
export const useProjectPerformance = (projectId, timeRange = '7d') => {
  return useQuery({
    queryKey: ['performance', projectId, timeRange],
    queryFn: () => projectsApi.getPerformance(projectId, timeRange),
    enabled: !!projectId,
  });
};