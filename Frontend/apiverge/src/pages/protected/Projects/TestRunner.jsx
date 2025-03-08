// src/pages/protected/Projects/TestRunner.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProject, useRunTests } from '../../../hooks/useProjects';
import { useUiStore } from '../../../stores/uiStore';
import apiClient from '../../../api/apiConfig';
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaPlay, 
  FaCheck, 
  FaTimes, 
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaRobot
} from 'react-icons/fa';

const TestRunner = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);
  const queryClient = useQueryClient();
  
  // Get project data
  const { 
    data: project, 
    isLoading: projectLoading, 
    error: projectError 
  } = useProject(projectId);
  
  // Get available tests
  const {
    data: availableTests,
    isLoading: testsLoading,
    error: testsError
  } = useQuery({
    queryKey: ['project-tests', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/b/projects/projects/${projectId}/tests`);
      return response.data;
    }
  });
  
  // AI Models for test generation
  const aiModels = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5', name: 'GPT-3.5 Turbo' },
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'claude', name: 'Claude' }
  ];
  
  // State for test config
  const [testConfig, setTestConfig] = useState({
    selectedTests: [],
    selectAll: false,
    environment: 'development',
    aiModel: 'gpt-4',
    generateMissingTests: false,
    includePerformanceTests: true,
    retryCount: 1,
    timeout: 30000 // 30 seconds
  });
  
  // State for test run
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [runComplete, setRunComplete] = useState(false);
  
  // Run tests mutation
  const runTestsMutation = useRunTests();
  
  // Handle checkbox change for test selection
  const handleTestSelectionChange = (testId) => {
    setTestConfig(prev => {
      const isSelected = prev.selectedTests.includes(testId);
      let newSelectedTests;
      
      if (isSelected) {
        newSelectedTests = prev.selectedTests.filter(id => id !== testId);
      } else {
        newSelectedTests = [...prev.selectedTests, testId];
      }
      
      // Update selectAll state based on whether all tests are now selected
      const allSelected = availableTests && newSelectedTests.length === availableTests.length;
      
      return {
        ...prev,
        selectedTests: newSelectedTests,
        selectAll: allSelected
      };
    });
  };
  
  // Handle select all change
  const handleSelectAllChange = () => {
    setTestConfig(prev => {
      const newSelectAll = !prev.selectAll;
      
      return {
        ...prev,
        selectAll: newSelectAll,
        selectedTests: newSelectAll && availableTests ? availableTests.map(test => test.id) : []
      };
    });
  };
  
  // Handle other config changes
  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTestConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission to run tests
  const handleRunTests = async () => {
    setIsRunning(true);
    setRunComplete(false);
    setTestResults(null);
    
    try {
      // Prepare test configuration
      const configToSubmit = {
        test_ids: testConfig.selectAll ? 'all' : testConfig.selectedTests,
        environment: testConfig.environment,
        ai_model: testConfig.aiModel,
        generate_missing: testConfig.generateMissingTests,
        include_performance: testConfig.includePerformanceTests,
        retry_count: Number(testConfig.retryCount),
        timeout: Number(testConfig.timeout)
      };
      
      const result = await runTestsMutation.mutateAsync({
        projectId,
        testConfig: configToSubmit
      });
      
      setTestResults(result);
      setRunComplete(true);
      showNotification('Tests completed successfully', 'success');
      
      // Invalidate related queries
      queryClient.invalidateQueries(['test-history', projectId]);
    } catch (error) {
      showNotification(error.displayMessage || 'Failed to run tests', 'error');
    } finally {
      setIsRunning(false);
    }
  };
  
  // Loading state
  if (projectLoading || testsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
      </div>
    );
  }
  
  // Error state
  if (projectError || testsError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p className="mb-4">{projectError?.displayMessage || testsError?.displayMessage || 'Failed to load data'}</p>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="px-4 py-2 bg-white border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
        >
          Back to Project
        </button>
      </div>
    );
  }
  
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
        <h1 className="text-2xl font-bold">Run Tests for {project?.name}</h1>
      </div>
      
      {runComplete && testResults ? (
        // Test Results View
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center rounded-full w-20 h-20 bg-green-100 text-green-600 mb-4">
              <FaCheckCircle className="text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Test Run Complete</h2>
            <p className="text-gray-600">Tests completed in {testResults.duration}s</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Total Tests</h3>
              <p className="text-3xl font-bold text-gray-900">{testResults.total_tests}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <h3 className="text-sm uppercase font-semibold text-green-700 mb-2">Passed</h3>
              <p className="text-3xl font-bold text-green-700">{testResults.passed_tests}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <h3 className="text-sm uppercase font-semibold text-red-700 mb-2">Failed</h3>
              <p className="text-3xl font-bold text-red-700">{testResults.failed_tests}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Pass Rate</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${
                  testResults.pass_rate > 80 ? 'bg-green-500' :
                  testResults.pass_rate > 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${testResults.pass_rate}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-600">0%</span>
              <span className="font-medium">{testResults.pass_rate}%</span>
              <span className="text-gray-600">100%</span>
            </div>
          </div>
          
          {testResults.results && testResults.results.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Test Details</h3>
              <div className="space-y-4">
                {testResults.results.map((result) => (
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
                    
                     {/* Show assertions and errors if any */}
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between border-t border-gray-200 pt-6">
            <button
              onClick={() => {
                setRunComplete(false);
                setTestResults(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Configure New Test Run
            </button>
            <div className="space-x-3">
              <button
                onClick={() => navigate(`/projects/${projectId}/test-runs/${testResults.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Full Results
              </button>
              <button
                onClick={handleRunTests}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FaPlay className="mr-2" /> Run Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Test Configuration View
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Test Configuration</h2>
            
            {/* Test Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-medium">Select Tests to Run</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={testConfig.selectAll}
                    onChange={handleSelectAllChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="selectAll" className="ml-2 text-sm text-gray-700">
                    Select All
                  </label>
                </div>
              </div>
              
              {availableTests && availableTests.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                  <div className="space-y-3">
                    {availableTests.map((test) => (
                      <div key={test.id} className="flex items-start p-2 hover:bg-gray-100 rounded-md">
                        <input
                          type="checkbox"
                          id={`test-${test.id}`}
                          checked={testConfig.selectedTests.includes(test.id)}
                          onChange={() => handleTestSelectionChange(test.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        />
                        <label htmlFor={`test-${test.id}`} className="ml-2 cursor-pointer flex-grow">
                          <div className="font-medium text-gray-800">{test.name}</div>
                          <div className="text-sm text-gray-500">{test.description || 'No description'}</div>
                          <div className="mt-1 flex items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              test.method === 'GET' ? 'bg-green-100 text-green-800' :
                              test.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                              test.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                              test.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {test.method}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">{test.endpoint_path}</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-3">
                    <FaExclamationTriangle className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Tests Available</h3>
                  <p className="text-gray-500 mb-4">
                    There are no tests configured for this project yet.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() => navigate(`/projects/${projectId}/generate-tests`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                      <FaRobot className="mr-2" /> Generate with AI
                    </button>
                    <button
                      onClick={() => navigate(`/projects/${projectId}/add-test`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <FaPlus className="mr-2" /> Add Test Case
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Environment & Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-3">Environment</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-3">
                    <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Environment
                    </label>
                    <select
                      id="environment"
                      name="environment"
                      value={testConfig.environment}
                      onChange={handleConfigChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 mb-1">
                      Request Timeout (ms)
                    </label>
                    <input
                      type="number"
                      id="timeout"
                      name="timeout"
                      min="1000"
                      max="60000"
                      step="1000"
                      value={testConfig.timeout}
                      onChange={handleConfigChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="retryCount" className="block text-sm font-medium text-gray-700 mb-1">
                      Retry Count
                    </label>
                    <input
                      type="number"
                      id="retryCount"
                      name="retryCount"
                      min="0"
                      max="5"
                      value={testConfig.retryCount}
                      onChange={handleConfigChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-3">AI Settings</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-3">
                    <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700 mb-1">
                      AI Model for Test Generation
                    </label>
                    <select
                      id="aiModel"
                      name="aiModel"
                      value={testConfig.aiModel}
                      onChange={handleConfigChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {aiModels.map(model => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3 flex items-start">
                    <input
                      type="checkbox"
                      id="generateMissingTests"
                      name="generateMissingTests"
                      checked={testConfig.generateMissingTests}
                      onChange={handleConfigChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="generateMissingTests" className="ml-2 block text-sm text-gray-700">
                      Generate tests for endpoints without tests
                    </label>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="includePerformanceTests"
                      name="includePerformanceTests"
                      checked={testConfig.includePerformanceTests}
                      onChange={handleConfigChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="includePerformanceTests" className="ml-2 block text-sm text-gray-700">
                      Include performance testing
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <FaLightbulb className="text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Pro Tips</h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>Running tests with AI can help identify edge cases and improve test coverage. The system will automatically generate assertions based on expected responses.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
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
              type="button"
              onClick={handleRunTests}
              disabled={isRunning || (availableTests && availableTests.length > 0 && testConfig.selectedTests.length === 0)}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                isRunning || (availableTests && availableTests.length > 0 && testConfig.selectedTests.length === 0)
                  ? 'opacity-70 cursor-not-allowed' 
                  : ''
              }`}
            >
              {isRunning ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Running Tests...
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" />
                  Run Tests
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestRunner;