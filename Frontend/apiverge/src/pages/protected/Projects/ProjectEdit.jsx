// src/pages/protected/Projects/ProjectEdit.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject, useUpdateProject } from '../../../hooks/useProjects';
import { useUiStore } from '../../../stores/uiStore';
import { FaArrowLeft, FaSpinner, FaUpload, FaLink } from 'react-icons/fa';

const ProjectEdit = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);
  
  // Get project data
  const { 
    data: project, 
    isLoading: projectLoading, 
    error: projectError 
  } = useProject(projectId);
  
  // Update project mutation
  const updateProjectMutation = useUpdateProject();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'url',
    account_type: 'individual',
    openapi_url: '',
    openapi_file: null
  });
  
  // UI state
  const [filePreview, setFilePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with project data when available
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        type: project.type || 'url',
        account_type: project.account_type || 'individual',
        openapi_url: project.openapi_url || '',
        openapi_file: null
      });
    }
  }, [project]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files.length > 0) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create a preview for JSON files
      if (file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = JSON.parse(event.target.result);
            setFilePreview(JSON.stringify(json, null, 2).substring(0, 500) + '...');
          } catch (e) {
            setFilePreview('Invalid JSON format');
          }
        };
        reader.readAsText(file);
      } else {
        setFilePreview(`File selected: ${file.name}`);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProjectMutation.mutateAsync({
        projectId: projectId,
        data: formData
      });
      
      showNotification('Project updated successfully', 'success');
      navigate(`/projects/${projectId}`);
    } catch (error) {
      showNotification(error.displayMessage || 'Failed to update project', 'error');
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (projectLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
      </div>
    );
  }
  
  // Error state
  if (projectError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Error Loading Project</h2>
        <p className="mb-4">{projectError.displayMessage || 'Failed to load project details'}</p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-white border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
        >
          Back to Projects
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
        >
          <FaArrowLeft className="mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Edit Project: {project?.name}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Project Basic Info */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Project Information</h2>
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="My API Project"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of what this project is about"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type *
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="account_type"
                    value="individual"
                    checked={formData.account_type === 'individual'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Individual</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="account_type"
                    value="organization"
                    checked={formData.account_type === 'organization'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Organization</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* API Specification */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">API Specification (Optional)</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Method
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="url"
                    checked={formData.type === 'url'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">URL</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="file"
                    checked={formData.type === 'file'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">File Upload</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Leave blank if you don't want to update the OpenAPI specification
              </p>
            </div>
            
            {formData.type === 'url' ? (
              <div className="mb-4">
                <label htmlFor="openapi_url" className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAPI URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLink className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="openapi_url"
                    name="openapi_url"
                    value={formData.openapi_url}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/openapi.json"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label htmlFor="openapi_file" className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAPI File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="openapi_file" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="openapi_file" 
                          name="openapi_file" 
                          type="file" 
                          className="sr-only"
                          onChange={handleChange}
                          accept=".json,.yaml,.yml" 
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      JSON or YAML files up to 10MB
                    </p>
                  </div>
                </div>
                
                {/* File Preview */}                
                {filePreview && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">File Preview:</p>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">{filePreview}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}`)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEdit;