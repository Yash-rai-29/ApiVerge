// src/pages/protected/Projects/ProjectImport.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject, useImportOpenApi } from '../../../hooks/useProjects';
import { useUiStore } from '../../../stores/uiStore';
import { FaArrowLeft, FaSpinner, FaUpload, FaLink, FaCode, FaCheckCircle } from 'react-icons/fa';

const ProjectImport = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);
  
  // Get project data
  const { 
    data: project, 
    isLoading: projectLoading, 
    error: projectError 
  } = useProject(projectId);
  
  // Import OpenAPI mutation
  const importOpenApiMutation = useImportOpenApi();
  
  // Form state
  const [importType, setImportType] = useState('url');
  const [openApiUrl, setOpenApiUrl] = useState('');
  const [openApiFile, setOpenApiFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importStats, setImportStats] = useState(null);
  
  // Handle file change
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setOpenApiFile(file);
      
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
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setImportSuccess(false);
    setImportStats(null);
    
    try {
      const specData = {
        type: importType,
        url: importType === 'url' ? openApiUrl : undefined,
        file: importType === 'file' ? openApiFile : undefined
      };
      
      const result = await importOpenApiMutation.mutateAsync({
        projectId,
        specData
      });
      
      setImportSuccess(true);
      setImportStats(result);
      showNotification('OpenAPI specification imported successfully', 'success');
    } catch (error) {
      showNotification(error.displayMessage || 'Failed to import OpenAPI specification', 'error');
    } finally {
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
        <h1 className="text-2xl font-bold">Import OpenAPI Specification</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {importSuccess ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Import Successful!</h2>
            <p className="text-gray-600 mb-6">
              The OpenAPI specification has been successfully imported.
            </p>
            
            {importStats && (
              <div className="bg-gray-50 p-4 rounded-lg inline-block">
                <h3 className="font-medium text-gray-700 mb-2">Import Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-500">Endpoints Imported:</p>
                    <p className="font-medium">{importStats.endpoints_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Schema Objects:</p>
                    <p className="font-medium">{importStats.schema_count || 0}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => navigate(`/projects/${projectId}`)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Project
              </button>
              <button
                onClick={() => setImportSuccess(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Import Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Import Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    importType === 'url' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setImportType('url')}
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-full mr-3 ${
                      importType === 'url' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <FaLink className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">URL</h3>
                      <p className="text-sm text-gray-500">Import from a URL</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="importType"
                    value="url"
                    checked={importType === 'url'}
                    onChange={() => setImportType('url')}
                    className="sr-only"
                  />
                </div>
                
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    importType === 'file' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setImportType('file')}
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-full mr-3 ${
                      importType === 'file' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <FaUpload className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">File Upload</h3>
                      <p className="text-sm text-gray-500">Upload a JSON or YAML file</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="importType"
                    value="file"
                    checked={importType === 'file'}
                    onChange={() => setImportType('file')}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>
            
            {importType === 'url' ? (
              <div className="mb-6">
                <label htmlFor="openApiUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAPI URL *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLink className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="openApiUrl"
                    value={openApiUrl}
                    onChange={(e) => setOpenApiUrl(e.target.value)}
                    required
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/openapi.json"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the URL of your OpenAPI/Swagger specification (JSON or YAML)
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <label htmlFor="openApiFile" className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAPI File *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="openApiFile" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="openApiFile" 
                          type="file" 
                          className="sr-only"
                          onChange={handleFileChange}
                          required
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
                
                {filePreview && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-700">File Preview:</p>
                      <button 
                        type="button"
                        className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        onClick={() => {
                          setOpenApiFile(null);
                          setFilePreview('');
                        }}
                      >
                        Clear
                      </button>
                    </div>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">{filePreview}</pre>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <FaCode className="text-blue-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">What happens during import?</h3>
                  <p className="text-sm text-blue-700">
                    We'll parse your OpenAPI specification to extract endpoints, parameters, request bodies, and response schemas.
                    This will allow you to test your API endpoints and generate test cases automatically.
                  </p>
                </div>
              </div>
            </div>
            
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
                disabled={isSubmitting || (importType === 'url' && !openApiUrl) || (importType === 'file' && !openApiFile)}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                  isSubmitting || (importType === 'url' && !openApiUrl) || (importType === 'file' && !openApiFile)
                    ? 'opacity-70 cursor-not-allowed' 
                    : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Importing...
                  </>
                ) : (
                  'Import Specification'
                )}
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProjectImport;