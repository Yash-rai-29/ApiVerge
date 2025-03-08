// src/pages/protected/Projects/EndpointCreate.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../../stores/uiStore';
import apiClient from '../../../api/apiConfig';
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaPlus, 
  FaMinusCircle,
  FaCheck
} from 'react-icons/fa';

const EndpointCreate = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);
  const queryClient = useQueryClient();
  
  // Form state
  const [formData, setFormData] = useState({
    method: 'GET',
    path: '',
    description: '',
    tag: '',
    parameters: [],
    requestBody: '',
    responses: {
      '200': { description: 'Success response', content: '' }
    }
  });
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add parameter field
  const addParameter = () => {
    setFormData(prev => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        { name: '', in: 'query', description: '', required: false, type: 'string' }
      ]
    }));
  };
  
  // Remove parameter field
  const removeParameter = (index) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };
  
  // Update parameter field
  const updateParameter = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };
  
  // Add response
  const addResponse = () => {
    const statusCode = prompt('Enter HTTP status code:', '');
    if (statusCode && /^\d{3}$/.test(statusCode)) {
      setFormData(prev => ({
        ...prev,
        responses: {
          ...prev.responses,
          [statusCode]: { description: '', content: '' }
        }
      }));
    }
  };
  
  // Remove response
  const removeResponse = (statusCode) => {
    setFormData(prev => {
      const newResponses = { ...prev.responses };
      delete newResponses[statusCode];
      return { ...prev, responses: newResponses };
    });
  };
  
  // Update response field
  const updateResponse = (statusCode, field, value) => {
    setFormData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [statusCode]: {
          ...prev.responses[statusCode],
          [field]: value
        }
      }
    }));
  };
  
  // Handle basic form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Create endpoint mutation
  const createEndpointMutation = useMutation({
    mutationFn: async (data) => {
      // Prepare the data for API
      const apiData = {
        ...data,
        // Parse JSON strings to objects
        requestBody: data.requestBody ? JSON.parse(data.requestBody) : undefined,
        responses: Object.entries(data.responses).reduce((acc, [statusCode, response]) => {
          acc[statusCode] = {
            ...response,
            content: response.content ? JSON.parse(response.content) : undefined
          };
          return acc;
        }, {})
      };
      
      const response = await apiClient.post(`/b/projects/projects/${projectId}/endpoints`, apiData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['endpoints', projectId]);
      showNotification('Endpoint created successfully', 'success');
      navigate(`/projects/${projectId}/endpoints/${data.id}`);
    },
    onError: (error) => {
      showNotification(error.displayMessage || 'Failed to create endpoint', 'error');
      setIsSubmitting(false);
    }
  });
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate JSON in requestBody and responses
      if (formData.requestBody) {
        try {
          JSON.parse(formData.requestBody);
        } catch (e) {
          showNotification('Invalid JSON in request body', 'error');
          setIsSubmitting(false);
          return;
        }
      }
      
      for (const [statusCode, response] of Object.entries(formData.responses)) {
        if (response.content) {
          try {
            JSON.parse(response.content);
          } catch (e) {
            showNotification(`Invalid JSON in response for status code ${statusCode}`, 'error');
            setIsSubmitting(false);
            return;
          }
        }
      }
      
      // Submit the form
      createEndpointMutation.mutate(formData);
    } catch (error) {
      showNotification(error.message || 'An error occurred', 'error');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
        >
          <FaArrowLeft className="mr-1" />
          Back to Project
        </button>
        <h1 className="text-2xl font-bold">Add New Endpoint</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Endpoint Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                  HTTP Method *
                </label>
                <select
                  id="method"
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                  <option value="OPTIONS">OPTIONS</option>
                  <option value="HEAD">HEAD</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-1">
                  Path *
                </label>
                <input
                  type="text"
                  id="path"
                  name="path"
                  value={formData.path}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/api/resource/{id}"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
                  Tag
                </label>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Users, Products"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="deprecated">Deprecated</option>
                  <option value="under_development">Under Development</option>
                </select>
              </div>
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
                placeholder="Description of what this endpoint does"
              ></textarea>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Parameters</h2>
              <button
                type="button"
                onClick={addParameter}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
              >
                <FaPlus className="mr-1" /> Add Parameter
              </button>
            </div>
            
            {formData.parameters.length > 0 ? (
              <div className="space-y-4">
                {formData.parameters.map((param, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Parameter {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeParameter(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaMinusCircle />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={param.name}
                          onChange={(e) => updateParameter(index, 'name', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="parameter_name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Location *
                        </label>
                        <select
                          value={param.in}
                          onChange={(e) => updateParameter(index, 'in', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="query">Query</option>
                          <option value="path">Path</option>
                          <option value="header">Header</option>
                          <option value="cookie">Cookie</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Type *
                        </label>
                        <select
                          value={param.type}
                          onChange={(e) => updateParameter(index, 'type', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="integer">Integer</option>
                          <option value="boolean">Boolean</option>
                          <option value="array">Array</option>
                          <option value="object">Object</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${index}`}
                          checked={param.required}
                          onChange={(e) => updateParameter(index, 'required', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`required-${index}`} className="ml-2 block text-xs font-medium text-gray-700">
                          Required
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={param.description}
                        onChange={(e) => updateParameter(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Description of the parameter"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">No parameters defined. Click 'Add Parameter' to add one.</p>
              </div>
            )}
          </div>
          
          {formData.method !== 'GET' && formData.method !== 'DELETE' && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Request Body</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <textarea
                  id="requestBody"
                  name="requestBody"
                  value={formData.requestBody}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter request body schema in JSON format"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">Enter a JSON object describing the request body structure</p>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Responses</h2>
              <button
                type="button"
                onClick={addResponse}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
              >
                <FaPlus className="mr-1" /> Add Response
              </button>
            </div>
            
            {Object.keys(formData.responses).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(formData.responses).map(([statusCode, response]) => (
                  <div key={statusCode} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-700">
                      Status Code: <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                          statusCode.startsWith('2') ? 'bg-green-100 text-green-800' :
                          statusCode.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
                          statusCode.startsWith('5') ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {statusCode}
                        </span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeResponse(statusCode)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaMinusCircle />
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        value={response.description}
                        onChange={(e) => updateResponse(statusCode, 'description', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Description of the response"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Content (JSON Schema)
                      </label>
                      <textarea
                        value={response.content}
                        onChange={(e) => updateResponse(statusCode, 'content', e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter response schema in JSON format"
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">No responses defined. Click 'Add Response' to add one.</p>
              </div>
            )}
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
                <>
                  <FaCheck className="mr-2" />
                  Create Endpoint
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EndpointCreate;