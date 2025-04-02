// src/pages/protected/Projects/components/EndpointTester.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSpinner, 
  FaPlay, 
  FaTimes, 
  FaPlus, 
  FaTrash, 
  FaCode, 
  FaCheckCircle, 
  FaCopy, 
  FaMagic,
  FaSave
} from 'react-icons/fa';
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useUiStore } from '../../../stores/uiStore';
import axios from 'axios';

const EndpointTester = ({ endpoint, projectId, onClose }) => {
  const showNotification = useUiStore((state) => state.showNotification);
  
  // Request states
  const [requestParams, setRequestParams] = useState({});
  const [requestHeaders, setRequestHeaders] = useState({
    'Content-Type': 'application/json'
  });
  const [requestBody, setRequestBody] = useState('');
  const [activeTab, setActiveTab] = useState('params'); // 'params', 'headers', 'body', 'auth'
  
  // Response states
  const [response, setResponse] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [responseError, setResponseError] = useState(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [testForm, setTestForm] = useState({
    name: '',
    description: '',
    assertions: []
  });
  const [showSaveTestModal, setShowSaveTestModal] = useState(false);
  const [generatingTests, setGeneratingTests] = useState(false);
  
  // Initialize params and headers
  useEffect(() => {
    if (endpoint?.parameters) {
      const params = {};
      
      endpoint.parameters.forEach(param => {
        if (param.in === 'query' || param.in === 'path') {
          params[param.name] = '';
        }
      });
      
      setRequestParams(params);
    }
    
    // Set default body if endpoint method is POST, PUT, or PATCH and has requestBody example
    if (['POST', 'PUT', 'PATCH'].includes(endpoint?.method) && endpoint?.requestBody) {
      try {
        setRequestBody(JSON.stringify(endpoint.requestBody, null, 2));
      } catch (e) {
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
  const handleHeaderChange = (name, value, index) => {
    const newHeaders = { ...requestHeaders };
    
    // If this is an "empty" header being edited
    if (name === '' && value !== '') {
      delete newHeaders[''];
      newHeaders[value] = '';
    } else {
      newHeaders[name] = value;
    }
    
    setRequestHeaders(newHeaders);
  };
  
  // Add new header field
  const handleAddHeader = () => {
    setRequestHeaders(prev => ({
      ...prev,
      '': ''
    }));
  };
  
  // Remove header
  const handleRemoveHeader = (name) => {
    const newHeaders = { ...requestHeaders };
    delete newHeaders[name];
    setRequestHeaders(newHeaders);
  };
  
  // Format JSON
  const formatJson = () => {
    try {
      const parsed = JSON.parse(requestBody);
      setRequestBody(JSON.stringify(parsed, null, 2));
    } catch (e) {
      showNotification('Invalid JSON format', 'error');
    }
  };
  
  // Send request
  const handleSendRequest = async () => {
    // Reset states
    setIsLoading(true);
    setResponse(null);
    setResponseStatus(null);
    setResponseHeaders(null);
    setResponseTime(null);
    setResponseError(null);
    
    try {
      // Prepare URL with path parameters
      let url = endpoint.path;
      const pathParams = {};
      const queryParams = {};
      
      // Process parameters
      if (endpoint.parameters) {
        endpoint.parameters.forEach(param => {
          const value = requestParams[param.name] || '';
          
          if (param.in === 'path') {
            pathParams[param.name] = value;
            // Replace path parameters in URL
            url = url.replace(`{${param.name}}`, encodeURIComponent(value));
          } else if (param.in === 'query' && value) {
            queryParams[param.name] = value;
          }
        });
      }
      
      // Prepare request config
      const config = {
        method: endpoint.method,
        url,
        headers: requestHeaders,
        params: queryParams
      };
      
      // Add request body for methods that support it
      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBody) {
        try {
          config.data = JSON.parse(requestBody);
        } catch (e) {
          setIsLoading(false);
          setResponseError('Invalid JSON in request body');
          return;
        }
      }
      
      // Send the request and measure time
      const startTime = Date.now();
      const result = await axios(config);
      const endTime = Date.now();
      
      // Set response data
      setResponse(result.data);
      setResponseStatus(result.status);
      setResponseHeaders(result.headers);
      setResponseTime(endTime - startTime);
      
    } catch (error) {
      console.error('Request error:', error);
      
      setResponseError(error.message || 'An error occurred while making the request');
      
      // If there's a response in the error, extract that too
      if (error.response) {
        setResponseStatus(error.response.status);
        setResponseHeaders(error.response.headers);
        setResponse(error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate test assertions with AI
  const handleGenerateAssertions = () => {
    setGeneratingTests(true);
    
    // In a real implementation, this would call an AI service
    // For now, let's simulate generating some test assertions
    setTimeout(() => {
      const mockAssertions = [
        { property: "status", operator: "equals", value: "200", description: "Response status should be 200 OK" },
        { property: "$.data", operator: "exists", value: "", description: "Response should contain data property" },
        { property: "$.data.length", operator: "greaterThan", value: "0", description: "Data array should not be empty" }
      ];
      
      setTestForm(prev => ({
        ...prev,
        assertions: mockAssertions,
        name: `Test ${endpoint.method} ${endpoint.path}`,
        description: `Automated test for ${endpoint.method} ${endpoint.path}`
      }));
      
      setGeneratingTests(false);
      setShowSaveTestModal(true);
      showNotification('Test assertions generated successfully', 'success');
    }, 2000);
  };
  
  // Save test case
  const handleSaveTest = () => {
    // This would call your API to save the test case
    showNotification('Test case saved successfully', 'success');
    setShowSaveTestModal(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mr-2 ${
              endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
              endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
              endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {endpoint.method}
            </span>
            <h2 className="text-lg font-semibold font-mono">{endpoint.path}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-auto p-6">
          {/* Description */}
          {endpoint.description && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700">{endpoint.description}</p>
            </div>
          )}
          
          {/* Request Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Request</h3>
            
            {/* URL and Method Bar */}
            <div className="flex mb-4">
              <select
                className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2 rounded-l-lg font-medium"
                value={endpoint.method}
                disabled
              >
                <option>{endpoint.method}</option>
              </select>
              <input
                type="text"
                className="flex-grow border border-l-0 border-gray-300 px-3 py-2 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                value={endpoint.path}
                readOnly
              />
            </div>
            
            {/* Request Tabs */}
            <div className="mb-4 border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('params')}
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === 'params'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Parameters
                </button>
                <button
                  onClick={() => setActiveTab('headers')}
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === 'headers'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Headers
                </button>
                {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
                  <button
                    onClick={() => setActiveTab('body')}
                    className={`py-2 px-4 text-sm font-medium ${
                      activeTab === 'body'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Body
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('auth')}
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === 'auth'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Auth
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="bg-gray-50 p-4 rounded-lg">
              {activeTab === 'params' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Request Parameters</h4>
                  {Object.keys(requestParams).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(requestParams).map(([name, value]) => {
                        const param = endpoint.parameters.find(p => p.name === name);
                        return (
                          <div key={name} className="flex items-center">
                              <div className="w-1/3 text-sm font-medium text-gray-700">{name}</div>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleParamChange(name, e.target.value)}
                              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              placeholder={param?.description || param?.name}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-sm">No query parameters for this endpoint</p>
                    </div>
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
                            onChange={(e) => handleHeaderChange(name, e.target.value, index)}
                            className="flex-grow px-3 py-2 border-t border-b border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {index > 0 && (
                            <button
                              onClick={() => handleRemoveHeader(name)}
                              className="px-3 py-2 border border-gray-300 rounded-r-md text-gray-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <FaTrash />
                            </button>
                          )}
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
                      rows="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                    <div className="absolute bottom-2 right-2">
                      <button 
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs flex items-center"
                        onClick={formatJson}
                      >
                        <FaCode className="mr-1" /> Format JSON
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'auth' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Authentication</h4>
                  <p className="text-sm text-gray-500">Select an authentication method if required.</p>
                  {/* Add authentication options here */}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
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
              
              <div className="flex items-center">
                {/* Generate Test Button */}
                <button 
                  onClick={handleGenerateAssertions}
                  disabled={isLoading || generatingTests}
                  className={`px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center ${
                    generatingTests ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {generatingTests ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Generating Tests...
                    </>
                  ) : (
                    <>
                      <FaMagic className="mr-2" />
                      Generate Tests
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Response Section */}
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <div className="flex justify-between items-center mb-3">
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
            
            {responseError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                <p className="font-medium">Error</p>
                <p className="mt-1">{responseError}</p>
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
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Send a request to see the response</p>
              </div>
            )}
          </div>
          
          {/* Save Test Modal */}
          <AnimatePresence>
            {showSaveTestModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Save Test Case</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Test Name *
                    </label>
                    <input
                      type="text"
                      id="testName"
                      value={testForm.name}
                      onChange={(e) => setTestForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="My API Test"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="testDescription"
                      value={testForm.description}
                      onChange={(e) => setTestForm(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of this test case"
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Assertions</h3>
                    
                    {testForm.assertions.length > 0 ? (
                      <div className="space-y-3">
                        {testForm.assertions.map((assertion, index) => (
                          <div key={index} className="flex items-center">
                            <div className="flex-shrink-0 mr-3">
                              {assertion.passed ? (
                                <FaCheckCircle className="text-green-500" />
                              ) : (
                                <FaTimes className="text-red-500" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <span className="text-sm font-medium text-gray-700">{assertion.description}</span>
                              {!assertion.passed && assertion.error && (
                                <p className="text-xs text-red-600 mt-1">{assertion.error}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-gray-500 text-sm">No assertions generated.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Save Button */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowSaveTestModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveTest}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Test
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default EndpointTester;