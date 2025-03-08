// src/contexts/DataContext.jsx

import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiConfig';

// Create context
const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiClient.get('/b/user/users/me');
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
  
  // Fetch organization data if user is part of one
  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const response = await apiClient.get('/api/organizations/current');
      return response.data;
    },
    enabled: !!user?.organization_id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
  
  // Fetch team members if user is part of an organization
  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const response = await apiClient.get('/api/organizations/members');
      return response.data;
    },
    enabled: !!organization,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
  
  // Fetch user's notification settings
  const { data: notificationSettings, isLoading: notificationSettingsLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const response = await apiClient.get('/api/user/notification-settings');
      return response.data;
    },
    enabled: !!user,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
  
  // Fetch user's notification count (for displaying badge)
  const { data: notificationCount, isLoading: notificationCountLoading } = useQuery({
    queryKey: ['notification-count'],
    queryFn: async () => {
      const response = await apiClient.get('/api/user/notifications/count');
      return response.data.count;
    },
    enabled: !!user,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
  
  // Fetch API models (for dropdown selectors)
  const { data: aiModels, isLoading: aiModelsLoading } = useQuery({
    queryKey: ['ai-models'],
    queryFn: async () => {
      const response = await apiClient.get('/b/aimodels/aimodels');
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
  
  // Value to be provided by context
  const value = {
    user,
    organization,
    teamMembers,
    notificationSettings,
    notificationCount,
    aiModels,
    isLoading: userLoading || orgLoading || teamLoading || notificationSettingsLoading || notificationCountLoading || aiModelsLoading,
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};