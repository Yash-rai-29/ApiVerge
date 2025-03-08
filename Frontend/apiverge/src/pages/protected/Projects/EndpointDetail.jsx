// src/pages/protected/Projects/EndpointDetail.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../../stores/uiStore';
import apiClient from '../../../api/apiConfig';
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaPlay, 
  FaCog, 
  FaCode, 
  FaTrash, 
  FaEdit,
  FaCopy,
  FaSave 
} from 'react-icons/fa';

// Endpoint Tester Component Import
import EndpointTester from '../components/EndpointTester';

const EndpointDetail = () => {
  const { projectId, endpointId } = useParams();
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);
  const queryClient = useQueryClient();
  
  // UI state
  const [showTester, setShowTester] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'tests', 'history'
  
  // Fetch endpoint data
  const { 
    data: endpoint,
    isLoading,
    error
  } = useQuery({
    queryKey: ['endpoint', projectId, endpointId],
    queryFn: async () => {
      const response = await apiClient.get(`/b/projects/projects/${projectId}/endpoints/${endpointId}`);
      return response.data;
    }
  });
  
  // Fetch endpoint test history
  const {
    data: testHistory,
    isLoading: historyLoading
  } = useQuery({
    queryKey: ['endpoint-tests', projectId, endpointId],
    queryFn: async () => {
      const response = await apiClient.get(`/b/projects/projects/${projectId}/endpoints/${endpointId}/tests`);
      return response.data;
    },
    enabled: activeTab === 'history'
  });
  
  // Delete endpoint mutation
  const deleteEndpointMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/b/projects/projects/${projectId}/endpoints/${endpointId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['endpoints', projectId]);
      showNotification('Endpoint deleted successfully', 'success');
      navigate(`/projects/${projectId}`);
    },
    onError: (error) => {
      showNotification(error.displayMessage || 'Failed to delete endpoint', 'error');
    }
  });
  
  // Handle endpoint deletion
  const handleDeleteEndpoint = () => {
    if (window.confirm('Are you sure you want to delete this endpoint? This action cannot be undone.')) {
      deleteEndpointMutation.mutate();
    }
  };
  
  // Copy URL to clipboard
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(endpoint.path);
    showNotification('Endpoint URL copied to clipboard', 'success');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Error Loading Endpoint</h2>
        <p className="mb-4">{error.displayMessage || 'Failed to load endpoint details'}</p>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="px-4 py-2 bg-white border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
        >
          Back to Project
        </button>
      </div>
    );
  }
  
  if (!endpoint) {
    return (
      <div className="text-center my-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Endpoint Not Found</h2>
        <p className="text-gray-600 mb-6">The endpoint you're looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Project
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
        >
          <FaArrowLeft className="mr-1" />
          Back to Project
        </button>
        <h1 className="text-2xl font-bold">Endpoint Details</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {/* Endpoint Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-3 md:mb-0">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mr-3 ${
                endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {endpoint.method}
              </span>
              <h2 className="text-lg font-mono text-gray-800">{endpoint.path}</h2>
              <button 
                onClick={copyUrlToClipboard}
                className="ml-2 text-gray-400 hover:text-gray-600"
                title="Copy URL"
              >
                <FaCopy />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowTester(true)}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FaPlay className="mr-1.5" /> Test Endpoint
              </button>
              <button
                onClick={() => navigate(`/projects/${projectId}/endpoints/${endpointId}/edit`)}
                className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <FaEdit className="mr-1.5" /> Edit
              </button>
              <button
                onClick={handleDeleteEndpoint}
                className="flex items-center px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                <FaTrash className="mr-1.5" /> Delete
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === 'tests'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tests
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Test History
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Endpoint Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Method</p>
                      <p className="text-gray-800">{endpoint.method}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Path</p>
                      <p className="text-gray-800 font-mono">{endpoint.path}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tag</p>
                      <p className="text-gray-800">{endpoint.tag || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="text-gray-800 capitalize">{endpoint.status || 'Active'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-gray-800">{endpoint.description || 'No description provided'}</p>
                  </div>
                </div>
              </div>
              
              {/* Parameters Section */}
              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Parameters</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {endpoint.parameters.map((param, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{param.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{param.in}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{param.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {param.required ? (
                                <span className="text-red-600">Yes</span>
                              ) : (
                                <span>No</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{param.description || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Request Body Section */}
              {endpoint.requestBody && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Request Body</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(endpoint.requestBody, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Responses Section */}
              {endpoint.responses && Object.keys(endpoint.responses).length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Responses</h3>
                  <div className="space-y-4">
                    {Object.entries(endpoint.responses).map(([statusCode, response]) => (
                      <div key={statusCode} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className={`px-4 py-2 ${
                          statusCode.startsWith('2') ? 'bg-green-50 border-b border-green-100' :
                          statusCode.startsWith('4') ? 'bg-yellow-50 border-b border-yellow-100' :
                          statusCode.startsWith('5') ? 'bg-red-50 border-b border-red-100' :
                          'bg-gray-50 border-b border-gray-100'
                        }`}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mr-2 ${
                            statusCode.startsWith('2') ? 'bg-green-100 text-green-800' :
                            statusCode.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
                            statusCode.startsWith('5') ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {statusCode}
                          </span>
                          <span className="text-sm font-medium">{response.description}</span>
                        </div>
                        {response.content && (
                          <div className="p-4 bg-gray-50">
                            <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(response.content, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Tests Tab */}
          {activeTab === 'tests' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Test Cases</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/projects/${projectId}/endpoints/${endpointId}/generate-tests`)}
                    className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    <FaCode className="mr-1.5" /> Generate with AI
                  </button>
                  <button
                    onClick={() => navigate(`/projects/${projectId}/endpoints/${endpointId}/add-test`)}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FaPlus className="mr-1.5" /> Add Test Case
                  </button>
                </div>
              </div>
              
              {endpoint.tests && endpoint.tests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assertions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Result</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {endpoint.tests.map((test) => (
                        <tr key={test.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{test.description || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.assertions?.length || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {test.last_result ? (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                test.last_result === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {test.last_result === 'passed' ? 'Passed' : 'Failed'}
                              </span>
                            ) : (
                              <span className="text-gray-500 text-sm">Never run</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => navigate(`/projects/${projectId}/endpoints/${endpointId}/tests/${test.id}`)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => navigate(`/projects/${projectId}/endpoints/${endpointId}/tests/${test.id}/edit`)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                // Delete test case
                                if (window.confirm('Are you sure you want to delete this test case?')) {
                                  // Implement delete logic
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <FaCode className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Test Cases Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Create test cases to validate your endpoint behavior. You can manually create tests or use our AI to generate them automatically.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => navigate(`/projects/${projectId}/endpoints/${endpointId}/generate-tests`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                      <FaCode className="mr-2" /> Generate with AI
                    </button>
                    <button
                      onClick={() => navigate(`/projects/${projectId}/endpoints/${endpointId}/add-test`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <FaPlus className="mr-2" /> Add Test Case
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Test Run History</h3>
              
              {historyLoading ? (
                <div className="flex justify-center items-center h-40">
                  <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                </div>
              ) : testHistory && testHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Code</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testHistory.map((run) => (
                        <tr key={run.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(run.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                              run.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {run.status === 'passed' ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {run.response_time}ms
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                              run.status_code >= 200 && run.status_code < 300 ? 'bg-green-100 text-green-800' :
                              run.status_code >= 400 && run.status_code < 500 ? 'bg-yellow-100 text-yellow-800' :
                              run.status_code >= 500 ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {run.status_code}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => navigate(`/projects/${projectId}/endpoints/${endpointId}/runs/${run.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-3">No test runs recorded for this endpoint.</p>
                  <button
                    onClick={() => setShowTester(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                  >
                    <FaPlay className="mr-2" /> Test Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Endpoint Tester Modal */}
      {showTester && (
        <EndpointTester
          endpoint={endpoint}
          projectId={projectId}
          onClose={() => setShowTester(false)}
        />
      )}
    </div>
  );
};

export default EndpointDetail;