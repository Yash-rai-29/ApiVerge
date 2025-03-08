// src/pages/protected/Projects/components/EndpointTester.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaPlay, FaSave, FaTimes, FaPlus, FaTrash, FaCode } from 'react-icons/fa';
import apiClient from '../../../api/apiConfig';

const EndpointTester = ({ endpoint, projectId, onClose }) => {
  // State for request
  const [requestParams, setRequestParams] = useState({});
  const [requestHeaders, setRequestHeaders] = useState({});
  const [requestBody, setRequestBody] = useState('');
  
  // State for response
  const [response, setResponse] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('params'); // 'params', 'headers', 'body'
  
  // Initialize params and headers from endpoint definition
  useEffect(() => {
    if (endpoint.parameters) {
      const params = {};
      const headers = {};
      
      endpoint.parameters.forEach(param => {
        if (param.in === 'query') {
          params[param.name] = '';
        } else if (param.in === 'header') {
          headers[param.name] = '';
        }
      });
      
      setRequestParams(params);
      setRequestHeaders(headers);
    }
    
    // Set default Content-Type header based on endpoint consumes
    if (endpoint.consumes && endpoint.consumes.includes('application/json')) {
      setRequestHeaders(prev => ({
        ...prev,
        'Content-Type': 'application/json'
      }));
    }
    
    // Set empty request body if endpoint accepts it
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      if (endpoint.requestBody && endpoint.requestBody.example) {
        setRequestBody(JSON.stringify(endpoint.requestBody.example, null, 2));
      } else {
        setRequestBody('{\n  \n}');
      }
    }
  }, [endpoint]);
  
  // Handle parameter change
  const handleParamChange = (name, value) => {
    setRequestParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle header change
  const handleHeaderChange = (name, value) => {
    setRequestHeaders(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add new header
  const handleAddHeader = () => {
    setRequestHeaders(prev => ({
      ...prev,
      '': ''
    }));
  };
  
  // Remove header
  const handleRemoveHeader = (name) => {
    setRequestHeaders(prev => {
      const newHeaders = { ...prev };
      delete newHeaders[name];
      return newHeaders;
    });
  };
  
  // Handle request body change
  const handleBodyChange = (e) => {
    setRequestBody(e.target.value);
  };
  
  // Execute the request
  const handleSendRequest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setResponseStatus(null);
    setResponseTime(null);
    setResponseHeaders(null);
    
    try {
      // Build URL with path parameters replaced
      let url = endpoint.path;
      if (endpoint.parameters) {
        endpoint.parameters.forEach(param => {
          if (param.in === 'path') {
            const paramValue = requestParams[param.name] || '';
            url = url.replace(`{${param.name}}`, encodeURIComponent(paramValue));
          }
        });
      }
      
      // Build query parameters
      const queryParams = {};
      Object.entries(requestParams).forEach(([key, value]) => {
        if (value) {
          queryParams[key] = value;
        }
      });
      
      // Build headers
      const headers = {};
      Object.entries(requestHeaders).forEach(([key, value]) => {
        if (key && value) {
          headers[key] = value;
        }
      });
      
      // Parse request body if needed
      let data = null;
      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBody) {
        try {
          data = JSON.parse(requestBody);
        } catch (e) {
          setError('Invalid JSON in request body');
          setIsLoading(false);
          return;
        }
      }
      
      // Track start time for performance
      const startTime = new Date().getTime();
      
      // Make the request
      const response = await apiClient.request({
        method: endpoint.method,
        url,
        params: queryParams,
        headers,
        data,
      });
      
      // Calculate response time
      const endTime = new Date().getTime();
      const duration = endTime - startTime;
      
      // Set response data
      setResponse(response.data);
      setResponseStatus(response.status);
      setResponseTime(duration);
      setResponseHeaders(response.headers);
      
    } catch (error) {
      setError(error.displayMessage || 'Request failed');
      if (error.response) {
        setResponseStatus(error.response.status);
        setResponseHeaders(error.response.headers);
        setResponse(error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mr-2 ${
                endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {endpoint.method}
              </span>
              <span className="font-mono">{endpoint.path}</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">{endpoint.description || 'No description'}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Request Section */}
          <div className="md:w-1/2 border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="font-medium">Request</h3>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('params')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'params' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Params
              </button>
              <button
                onClick={() => setActiveTab('headers')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'headers' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Headers
              </button>
              {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
                <button
                  onClick={() => setActiveTab('body')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'body' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Body
                </button>
              )}
            </div>
            
            {/* Tab Content */}
            <div className="flex-grow overflow-y-auto p-4">
              {activeTab === 'params' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Query Parameters</h4>
                  {Object.keys(requestParams).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(requestParams).map(([name, value]) => (
                        <div key={name} className="flex items-center">
                          <span className="w-1/3 text-sm font-medium text-gray-700">{name}</span>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleParamChange(name, e.target.value)}
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No query parameters for this endpoint</p>
                  )}
                </div>
              )}
              
              {activeTab === 'headers' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Request Headers</h4>
                    <button
                      onClick={handleAddHeader}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <FaPlus className="mr-1" /> Add Header
                    </button>
                  </div>
                  
                  {Object.keys(requestHeaders).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(requestHeaders).map(([name, value], index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            placeholder="Header name"
                            value={name}
                            onChange={(e) => {
                              const oldName = name;
                              const newName = e.target.value;
                              const newHeaders = { ...requestHeaders };
                              delete newHeaders[oldName];
                              newHeaders[newName] = value;
                              setRequestHeaders(newHeaders);
                            }}
                            className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Value"
                            value={value}
                            onChange={(e) => handleHeaderChange(name, e.target.value)}
                            className="flex-grow px-3 py-2 border-t border-b border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={() => handleRemoveHeader(name)}
                            className="px-3 py-2 border border-gray-300 rounded-r-md text-gray-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No headers defined</p>
                  )}
                </div>
              )}
              
              {activeTab === 'body' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Request Body</h4>
                  <div className="relative">
                    <textarea
                      value={requestBody}
                      onChange={handleBodyChange}
                      rows="15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                    <div className="absolute bottom-2 right-2">
                      <button 
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs flex items-center"
                        onClick={() => {
                          try {
                            const formatted = JSON.stringify(JSON.parse(requestBody), null, 2);
                            setRequestBody(formatted);
                          } catch (e) {
                            // Ignore formatting if JSON is invalid
                          }
                        }}
                      >
                        <FaCode className="mr-1" /> Format JSON
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Send Button */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleSendRequest}
                disabled={isLoading}
                className={`flex items-center justify-center w-full py-2 px-4 rounded-md text-white font-medium ${
                  isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <FaPlay className="mr-2" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Response Section */}
          <div className="md:w-1/2 flex flex-col overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Response</h3>
              {responseStatus && (
                <div className="flex items-center">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                    responseStatus >= 200 && responseStatus < 300 ? 'bg-green-100 text-green-800' :
                    responseStatus >= 400 && responseStatus < 500 ? 'bg-yellow-100 text-yellow-800' :
                    responseStatus >= 500 ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Status: {responseStatus}
                  </span>
                  {responseTime !== null && (
                    <span className="ml-2 text-xs text-gray-500">
                      Time: {responseTime}ms
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-grow overflow-y-auto p-4">
              {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                  <p className="font-medium">Error</p>
                  <p className="mt-1">{error}</p>
                </div>
              ) : response ? (
                <div>
                  {responseHeaders && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Response Headers</h4>
                      <div className="bg-gray-50 p-3 rounded-md text-sm font-mono overflow-x-auto">
                        {Object.entries(responseHeaders).map(([name, value]) => (
                          <div key={name} className="mb-1">
                            <span className="text-gray-600">{name}:</span> {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Response Body</h4>
                  <pre className="bg-gray-50 p-3 rounded-md text-sm font-mono overflow-x-auto">
                    {typeof response === 'object' 
                      ? JSON.stringify(response, null, 2) 
                      : response
                    }
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Send a request to see the response</p>
                </div>
              )}
            </div>
            
            {/* Save as Test Button (if response exists) */}
            {response && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Navigate to create test page with this request data
                    // Implementation depends on your routing structure
                    console.log('Save as test clicked');
                  }}
                  className="flex items-center justify-center w-full py-2 px-4 rounded-md text-white font-medium bg-green-600 hover:bg-green-700"
                >
                  <FaSave className="mr-2" />
                  Save as Test
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EndpointTester;