// src/pages/protected/Projects/TestResults.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useUiStore } from '../../../stores/uiStore';
import apiClient from '../../../api/apiConfig';
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaCheck, 
  FaTimes, 
  FaSearch,
  FaExclamationTriangle,
  FaDownload,
  FaPlay
} from 'react-icons/fa';

const TestResults = () => {
  const { projectId, runId } = useParams();
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);
  
  // State for filtering
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'passed', 'failed'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch test run details
  const { 
    data: testRun, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['test-run', projectId, runId],
    queryFn: async () => {
      const response = await apiClient.get(`/b/projects/projects/${projectId}/test-runs/${runId}`);
      return response.data;
    }
  });
  
  // Filter and search test results
  const getFilteredResults = () => {
    if (!testRun || !testRun.results) return [];
    
    return testRun.results.filter(result => {
      // Filter by status
      if (filterStatus !== 'all' && result.status !== filterStatus) return false;
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return result.path.toLowerCase().includes(query) || 
               result.method.toLowerCase().includes(query) ||
               (result.error && result.error.toLowerCase().includes(query));
      }
      
      return true;
    });
  };
  
  // Download test results as JSON
  const downloadResults = () => {
    if (!testRun) return;
    
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(testRun, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    // Create a link element and trigger download
    const exportName = `test-run-${runId}-${new Date().toISOString().slice(0, 10)}`;
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', `${exportName}.json`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    showNotification('Test results downloaded successfully', 'success');
  };
  
  // Re-run these tests
  const handleReRunTests = () => {
    navigate(`/projects/${projectId}/run-tests`);
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
        <h2 className="text-lg font-semibold mb-2">Error Loading Test Results</h2>
        <p className="mb-4">{error.displayMessage || 'Failed to load test run details'}</p>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="px-4 py-2 bg-white border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
        >
          Back to Project
        </button>
      </div>
    );
  }
  
  if (!testRun) {
    return (
      <div className="text-center my-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Run Not Found</h2>
        <p className="text-gray-600 mb-6">The test run you're looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Project
        </button>
      </div>
    );
  }
  
  // Get filtered results
  const filteredResults = getFilteredResults();
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
        >
          <FaArrowLeft className="mr-1" />
          Back to Project
        </button>
        <h1 className="text-2xl font-bold">Test Run Results</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Test Run Summary</h2>
            <p className="text-gray-600 text-sm mt-1">
              Run on {new Date(testRun.created_at).toLocaleString()}
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex space-x-3">
            <button
              onClick={downloadResults}
              className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <FaDownload className="mr-1.5" /> Download Results
            </button>
            <button
              onClick={handleReRunTests}
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <FaPlay className="mr-1.5" /> Run Tests Again
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Total Tests</h3>
            <p className="text-3xl font-bold text-gray-900">{testRun.total_tests}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h3 className="text-sm uppercase font-semibold text-green-700 mb-2">Passed</h3>
            <p className="text-3xl font-bold text-green-700">{testRun.passed_tests}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <h3 className="text-sm uppercase font-semibold text-red-700 mb-2">Failed</h3>
            <p className="text-3xl font-bold text-red-700">{testRun.failed_tests}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Pass Rate</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${
                testRun.pass_rate > 80 ? 'bg-green-500' :
                testRun.pass_rate > 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${testRun.pass_rate}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-600">0%</span>
            <span className="font-medium">{testRun.pass_rate}%</span>
            <span className="text-gray-600">100%</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filterStatus === 'all' 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Tests
              </button>
              <button
                onClick={() => setFilterStatus('passed')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filterStatus === 'passed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Passed Only
              </button>
              <button
                onClick={() => setFilterStatus('failed')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filterStatus === 'failed' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Failed Only
              </button>
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search endpoints..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {testRun.results && testRun.results.length > 0 ? (
            <div className="space-y-4">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <div 
                    key={result.id} 
                    className={`border rounded-lg overflow-hidden ${
                      result.status === 'passed' ? 'border-green-200' : 'border-red-200'
                    }`}
                  >
                    <div className={`px-4 py-2 flex justify-between items-center ${
                      result.status === 'passed' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <div className="flex items-center">
                        {result.status === 'passed' ? (
                          <FaCheck className="text-green-500 mr-2" />
                        ) : (
                          <FaTimes className="text-red-500 mr-2" />
                        )}
                        <div>
                          <span className="font-medium">{result.method} {result.path}</span>
                          <span className="ml-2 text-xs text-gray-500">{result.response_time}ms</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        result.status_code >= 200 && result.status_code < 300 ? 'bg-green-100 text-green-800' :
                        result.status_code >= 400 && result.status_code < 500 ? 'bg-yellow-100 text-yellow-800' :
                        result.status_code >= 500 ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        Status: {result.status_code}
                      </span>
                    </div>
                    
                    <div className="p-4">
                      {result.assertions && result.assertions.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Assertions</h4>
                          <ul className="space-y-2">
                            {result.assertions.map((assertion, idx) => (
                              <li key={idx} className="flex items-start">
                                {assertion.passed ? (
                                  <FaCheck className="text-green-500 mt-0.5 mr-2" />
                                ) : (
                                  <FaTimes className="text-red-500 mt-0.5 mr-2" />
                                )}
                                <div>
                                  <span className="text-sm">{assertion.description}</span>
                                  {!assertion.passed && assertion.error && (
                                    <p className="text-xs text-red-600 mt-1">{assertion.error}</p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.error && (
                        <div className="bg-red-50 p-3 rounded-md">
                          <h4 className="text-sm font-medium text-red-700 mb-1">Error</h4>
                          <p className="text-sm text-red-600">{result.error}</p>
                        </div>
                      )}
                      
                      {/* Response Details (Optional - could be expandable) */}
                      {result.response && (
                        <div className="mt-3">
                          <button 
                            onClick={() => {/* Toggle response details */}}
                            className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                          >
                            View Response Details
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-500 mb-3">
                    <FaSearch className="text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No Matching Results</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="inline-block p-3 rounded-full bg-yellow-100 text-yellow-600 mb-3">
                <FaExclamationTriangle className="text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Test Results Available</h3>
              <p className="text-gray-500 mb-4">
                This test run doesn't have any detailed results to display.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestResults;