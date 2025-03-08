// src/pages/protected/Projects/index.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectsList from './ProjectsList';
import ProjectDetail from './ProjectDetail';
import ProjectCreate from './ProjectCreate';
import ProjectEdit from './ProjectEdit';
import ProjectImport from './ProjectImport';
import EndpointDetail from './EndpointDetail';
import EndpointCreate from './EndpointCreate';
import TestRunner from './TestRunner';
import TestResults from './TestResults';

const Projects = () => {
  return (
    <Routes>
      {/* List all projects */}
      <Route path="/" element={<ProjectsList />} />
      
      {/* Create new project */}
      <Route path="/create" element={<ProjectCreate />} />
      
      {/* Project details and management */}
      <Route path="/:projectId" element={<ProjectDetail />} />
      <Route path="/:projectId/edit" element={<ProjectEdit />} />
      <Route path="/:projectId/import" element={<ProjectImport />} />
      
      {/* Endpoint routes */}
      <Route path="/:projectId/endpoints/:endpointId" element={<EndpointDetail />} />
      <Route path="/:projectId/add-endpoint" element={<EndpointCreate />} />
      
      {/* Test routes */}
      <Route path="/:projectId/run-tests" element={<TestRunner />} />
      <Route path="/:projectId/test-runs/:runId" element={<TestResults />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/projects" replace />} />
    </Routes>
  );
};

export default Projects;