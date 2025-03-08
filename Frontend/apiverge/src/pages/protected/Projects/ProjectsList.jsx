// src/pages/protected/Projects/ProjectsList.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../../../hooks/useProjects';
import { useUiStore } from '../../../stores/uiStore';
import { FaPlus, FaTrash, FaEdit, FaSpinner, FaSearch } from 'react-icons/fa';

const ProjectsList = () => {
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);
  
  // Fetch projects data
  const { data, isLoading, error, refetch } = useProjects();
  
  // Destructure projects from data, defaulting to an empty array if undefined or null
  const projectsArray = Array.isArray(data?.projects) ? data.projects : [];
  
  // Local state for search term
  const [searchTerm, setSearchTerm] = useState('');
  const lowerSearchTerm = searchTerm.toLowerCase();

  // Filter projects based on search term, handling missing name/description gracefully
  const filteredProjects = projectsArray.filter((project) => {
    const projectName = project.name ? project.name.toLowerCase() : '';
    const projectDescription = project.description ? project.description.toLowerCase() : '';
    return (
      projectName.includes(lowerSearchTerm) ||
      projectDescription.includes(lowerSearchTerm)
    );
  });
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage and monitor your API testing projects</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/projects/create')}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FaPlus className="mr-2" /> New Project
          </motion.button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p className="font-medium">Error loading projects</p>
          <p className="text-sm mt-1">{error.displayMessage || 'An unexpected error occurred'}</p>
          <button 
            onClick={() => refetch()}
            className="mt-2 text-sm bg-white px-3 py-1 rounded border border-red-300 hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.project_uuid}
              project={project}
              onEdit={() => navigate(`/projects/${project.project_uuid}/edit`)}
              onDelete={() => navigate(`/projects/${project.project_uuid}`)}
              onClick={() => navigate(`/projects/${project.project_uuid}`)}
            />
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No matching projects found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search term or clear the search</p>
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first project to get started</p>
          <button
            onClick={() => navigate('/projects/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onClick, onEdit, onDelete }) => {
  // Helper function to convert UNIX timestamp (seconds) to a readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    // Convert seconds to milliseconds
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
    >
      <div 
        className="p-5 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg truncate">{project.name || 'Unnamed Project'}</h3>
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              project.status === 'active' ? 'bg-green-100 text-green-800' : 
              project.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'
            }`}
          >
            {project.status ? capitalizeFirstLetter(project.status) : 'Active'}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {project.description || 'No description provided'}
        </p>
        
        <div className="flex text-sm text-gray-500 mb-4">
          <div className="mr-4">
            <span className="font-medium">{project.endpoints_count != null ? project.endpoints_count : 0}</span> Endpoints
          </div>
          <div>
            <span className="font-medium">{project.tests_count != null ? project.tests_count : 0}</span> Tests
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Updated {formatDate(project.updated_at) || `Created on ${formatDate(project.created_at)}`}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              title="Edit Project"
            >
              <FaEdit />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              title="Delete Project"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default ProjectsList;
