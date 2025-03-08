// src/pages/protected/Projects/ProjectCreate.jsx

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCreateProject } from '../../../hooks/useProjects';
import { useUiStore } from '../../../stores/uiStore';
import { FaArrowLeft, FaSpinner, FaUpload, FaLink } from 'react-icons/fa';

const ProjectCreate = () => {
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);
  const createProjectMutation = useCreateProject();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'url', // Default to URL type
    account_type: 'individual', // Default to individual
    openapi_url: '',
    openapi_file: null,
  });

  // UI state
  const [filePreview, setFilePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      // Create a preview for JSON files
      if (file.type === 'application/json' || file.type === 'application/yaml' || file.type === 'application/x-yaml') {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target.result;
            const previewContent = file.type === 'application/json'
              ? JSON.stringify(JSON.parse(content), null, 2)
              : content.substring(0, 500) + '...';
            setFilePreview(previewContent);
          } catch (e) {
            setFilePreview('Invalid file format');
          }
        };
        reader.readAsText(file);
      } else {
        setFilePreview(`File selected: ${file.name}`);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear file preview if type changes
      if (name === 'type') {
        setFilePreview('');
        setFormData((prev) => ({ ...prev, openapi_file: null, openapi_url: '' }));
      }
    }
  }, []);

  // Validate form data
  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required.';
    if (formData.type === 'url' && !formData.openapi_url.trim()) {
      newErrors.openapi_url = 'OpenAPI URL is required.';
    }
    if (formData.type === 'file' && !formData.openapi_file) {
      newErrors.openapi_file = 'OpenAPI file is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);
      setErrors({});

      try {
        let payload;

        // Prepare payload based on import type
        if (formData.type === 'url') {
          payload = {
            name: formData.name,
            description: formData.description,
            type: formData.type,
            account_type: formData.account_type,
            openapi_url: formData.openapi_url,
            project_admin: 'SF8YttgCucgi8r0jzx1fVIBC5tt2', // Replace with actual admin ID if dynamic
            access_users: ['SF8YttgCucgi8r0jzx1fVIBC5tt2'], // Replace with actual user IDs if dynamic
          };
        } else {
          payload = new FormData();
          payload.append('name', formData.name);
          payload.append('description', formData.description);
          payload.append('type', formData.type);
          payload.append('account_type', formData.account_type);
          payload.append('openapi_file', formData.openapi_file);
          payload.append('project_admin', 'SF8YttgCucgi8r0jzx1fVIBC5tt2'); // Replace with actual admin ID if dynamic
          payload.append('access_users', JSON.stringify(['SF8YttgCucgi8r0jzx1fVIBC5tt2'])); // Replace with actual user IDs if dynamic
        }

        const result = await createProjectMutation.mutateAsync(payload);
        console.log('Created project:', result);
        showNotification('Project created successfully', 'success');
        navigate(`/projects/${result.project_uuid}`);
      } catch (error) {
        console.error(error);
        showNotification(error?.response?.data?.displayMessage || 'Failed to create project', 'error');
        setIsSubmitting(false);
      }
    },
    [formData, createProjectMutation, navigate, showNotification, validate]
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
          aria-label="Back to Projects"
        >
          <FaArrowLeft className="mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Create New Project</h1>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} noValidate>
          {/* Project Information */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Project Information</h2>

            {/* Project Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="My API Project"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600" id="name-error">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of what this project is about"
              ></textarea>
            </div>

            {/* Account Type */}
            <div className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">Account Type <span className="text-red-500">*</span></span>
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
          </section>

          {/* API Specification */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-4">API Specification</h2>

            {/* Import Method */}
            <div className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">Import Method <span className="text-red-500">*</span></span>
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
            </div>

            {/* OpenAPI URL */}
            {formData.type === 'url' && (
              <div className="mb-4">
                <label htmlFor="openapi_url" className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAPI URL <span className="text-red-500">*</span>
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
                    required={formData.type === 'url'}
                    className={`w-full pl-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.openapi_url ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/openapi.json"
                    aria-invalid={errors.openapi_url ? 'true' : 'false'}
                    aria-describedby={errors.openapi_url ? 'openapi_url-error' : undefined}
                  />
                </div>
                {errors.openapi_url && (
                  <p className="mt-1 text-sm text-red-600" id="openapi_url-error">
                    {errors.openapi_url}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Enter the URL of your OpenAPI/Swagger specification (JSON or YAML)
                </p>
              </div>
            )}

            {/* OpenAPI File Upload */}
            {formData.type === 'file' && (
              <div className="mb-4">
                <label htmlFor="openapi_file" className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAPI File <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="openapi_file"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="openapi_file"
                          name="openapi_file"
                          type="file"
                          className="sr-only"
                          onChange={handleChange}
                          required={formData.type === 'file'}
                          accept=".json,.yaml,.yml"
                          aria-invalid={errors.openapi_file ? 'true' : 'false'}
                          aria-describedby={errors.openapi_file ? 'openapi_file-error' : undefined}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">JSON or YAML files up to 10MB</p>
                  </div>
                </div>
                {errors.openapi_file && (
                  <p className="mt-1 text-sm text-red-600" id="openapi_file-error">
                    {errors.openapi_file}
                  </p>
                )}
                {filePreview && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">File Preview:</p>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">{filePreview}</pre>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/projects')}
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
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Informational Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-md font-medium text-blue-800 mb-2">What happens next?</h3>
        <p className="text-sm text-blue-700">
          After creating your project, we'll parse your OpenAPI specification and extract all endpoints.
          You'll be able to explore your API, customize testing parameters, and generate AI-powered test cases.
        </p>
      </div>
    </div>
  );
};

export default ProjectCreate;
