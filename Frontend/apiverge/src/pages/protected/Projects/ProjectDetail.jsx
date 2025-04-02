// src/pages/protected/Projects/ProjectDetail.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useProject,
  useDeleteProject,
  useProjectEndpoints,
  useProjectTestHistory
} from '../../../hooks/useProjects';
import { useUiStore } from '../../../stores/uiStore';
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaPlay,
  FaPlus,
  FaSpinner,
  FaExternalLinkAlt,
  FaClipboardList,
  FaTable,
  FaColumns,
  FaTerminal,
  FaCode,
  FaExclamationTriangle,
  FaSyncAlt,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
  FaBookOpen,
  FaMagic,
  FaCopy,
  FaDownload,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import EndpointTester from '../components/EndpointTester';
import DeleteProjectModal from '../components/DeleteProjectModal';
import axios from 'axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);
  
  // Split view refs and state
  const contentRef = useRef(null);
  const [splitViewRatio, setSplitViewRatio] = useState(50); // percentage for left panel
  const [isDragging, setIsDragging] = useState(false);
  const [splitView, setSplitView] = useState(false);
  
  // OpenAPI spec state
  const [openApiSpec, setOpenApiSpec] = useState(null);
  const [openApiLoading, setOpenApiLoading] = useState(false);
  const [openApiError, setOpenApiError] = useState(null);
  
  // Endpoint explorer states
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [showEndpointTester, setShowEndpointTester] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'docs', or 'explorer'
  const [endpointFilter, setEndpointFilter] = useState('');
  const [expandedTags, setExpandedTags] = useState({});
  
  // AI test generation states
  const [aiModelForTests, setAiModelForTests] = useState('gpt-4');
  const [generatingTests, setGeneratingTests] = useState(false);
  
  // Fetch project data
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError
  } = useProject(projectId);
  
  // Fetch project endpoints
  const {
    data: endpoints,
    isLoading: endpointsLoading,
    error: endpointsError,
    refetch: refetchEndpoints
  } = useProjectEndpoints(projectId);
  
  // Fetch test history
  const {
    data: testHistory,
    isLoading: testHistoryLoading,
    error: testHistoryError
  } = useProjectTestHistory(projectId);
  
  // Delete project mutation
  const deleteProjectMutation = useDeleteProject();
  
  // Effect to fetch and process OpenAPI schema when project loads
  useEffect(() => {
    if (project?.openapi_url) {
      fetchOpenApiSpec(project.openapi_url);
    }
  }, [project]);
  
  // Handle resizing of split panels
  useEffect(() => {
    if (!splitView) return;
    
    const handleMouseMove = (e) => {
      if (!isDragging || !contentRef.current) return;
      
      const containerRect = contentRef.current.getBoundingClientRect();
      const newRatio = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Limit the ratio to a reasonable range (20% - 80%)
      if (newRatio >= 20 && newRatio <= 80) {
        setSplitViewRatio(newRatio);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, splitView]);
  
  // Reset view when navigating away from component
  useEffect(() => {
    return () => {
      // Clean up any resources, event listeners etc.
      setOpenApiSpec(null);
      setSplitView(false);
    };
  }, []);

  // Fetch OpenAPI specification from URL
  const fetchOpenApiSpec = async (url) => {
    if (!url) return;
    
    try {
      setOpenApiLoading(true);
      setOpenApiError(null);
      
      // First check localStorage to avoid redundant fetches
      const cachedSpec = localStorage.getItem(`openapi_spec_${url}`);
      if (cachedSpec) {
        try {
          const parsed = JSON.parse(cachedSpec);
          const timestamp = parsed._timestamp || 0;
          const now = Date.now();
          
          // If cached version is less than 1 hour old, use it
          if (now - timestamp < 3600000) {
            setOpenApiSpec(parsed);
            setOpenApiLoading(false);
            return;
          }
        } catch (e) {
          console.error("Error parsing cached OpenAPI spec:", e);
          localStorage.removeItem(`openapi_spec_${url}`);
        }
      }
      
      // Fetch fresh data
      const response = await axios.get(url);
      const specData = response.data;
      
      // Add timestamp for cache invalidation
      specData._timestamp = Date.now();
      
      // Store in localStorage for future use
      localStorage.setItem(`openapi_spec_${url}`, JSON.stringify(specData));
      
      // Process and organize the OpenAPI spec
      setOpenApiSpec(specData);
      
      // Optionally sync endpoints if they don't exist yet
      if (!endpoints || endpoints.length === 0) {
        syncEndpointsFromOpenApi(specData);
      }
    } catch (error) {
      console.error("Error fetching OpenAPI spec:", error);
      setOpenApiError(error.message || "Failed to fetch OpenAPI specification");
      showNotification("Error loading OpenAPI specification", "error");
    } finally {
      setOpenApiLoading(false);
    }
  };
  
  // Sync endpoints from OpenAPI spec to backend
  const syncEndpointsFromOpenApi = async (specData) => {
    if (!specData || !specData.paths) return;
    
    try {
      showNotification("Syncing endpoints from OpenAPI specification...", "info");
      
      // This would typically call an API endpoint to import the OpenAPI spec
      // For now, we'll just simulate the behavior and refetch endpoints
      setTimeout(() => {
        refetchEndpoints();
        showNotification("Endpoints synced successfully", "success");
      }, 1500);
    } catch (error) {
      console.error("Error syncing endpoints:", error);
      showNotification("Failed to sync endpoints from OpenAPI specification", "error");
    }
  };
  
  // Handle project deletion
  const handleDeleteProject = async () => {
    try {
      await deleteProjectMutation.mutateAsync(projectId);
      showNotification('Project deleted successfully', 'success');
      navigate('/projects');
    } catch (error) {
      showNotification(error.displayMessage || 'Failed to delete project', 'error');
    }
  };
  
  // Handle endpoint selection for testing
  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
    
    if (splitView) {
      // In split view, don't show the modal, just update the right panel
    } else {
      setShowEndpointTester(true);
    }
  };
  
  // Toggle tag expansion in the explorer view
  const toggleTagExpansion = (tag) => {
    setExpandedTags(prev => ({
      ...prev,
      [tag]: !prev[tag]
    }));
  };
  
  // Filter endpoints based on search term
  const getFilteredEndpoints = () => {
    if (!endpoints) return [];
    
    if (!endpointFilter) return endpoints;
    
    const searchTerm = endpointFilter.toLowerCase();
    return endpoints.filter(endpoint => 
      endpoint.path.toLowerCase().includes(searchTerm) ||
      endpoint.method.toLowerCase().includes(searchTerm) ||
      endpoint.description?.toLowerCase().includes(searchTerm) ||
      endpoint.tag?.toLowerCase().includes(searchTerm)
    );
  };
  
  // Generate test cases using AI
  const generateTestCases = async (endpoint) => {
    if (!endpoint) return;
    
    try {
      setGeneratingTests(true);
      showNotification(`Generating test cases for ${endpoint.method} ${endpoint.path}...`, "info");
      
      // This would typically call your AI-powered test generation API
      // For now, we'll just simulate the behavior
      setTimeout(() => {
        setGeneratingTests(false);
        showNotification("Test cases generated successfully", "success");
      }, 3000);
    } catch (error) {
      setGeneratingTests(false);
      showNotification("Failed to generate test cases", "error");
    }
  };
  
  // Download OpenAPI spec
  const downloadOpenApiSpec = () => {
    if (!openApiSpec) return;
    
    const dataStr = JSON.stringify(openApiSpec, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `openapi-spec-${projectId}.json`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    
    showNotification("OpenAPI specification downloaded", "success");
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
        <div className="flex items-center mb-3">
          <FaExclamationTriangle className="text-red-500 mr-2" />
          <h2 className="text-lg font-semibold">Error Loading Project</h2>
        </div>
        <p className="mb-4">{projectError.displayMessage || 'Failed to load project details'}</p>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-white border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
          >
            Back to Projects
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Not found state
  if (!project) {
    return (
      <div className="text-center my-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h2>
        <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View All Projects
        </button>
      </div>
    );
  }
  
  // Get filtered endpoints
  const filteredEndpoints = getFilteredEndpoints();
  
  // Group endpoints by tag
  const endpointsByTag = endpoints ? groupEndpointsByTag(filteredEndpoints) : {};
  
  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <button
            onClick={() => navigate('/projects')}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
          >
            <FaArrowLeft className="mr-1" />
            Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSplitView(!splitView)}
            className={`flex items-center px-4 py-2 ${
              splitView ? 'bg-indigo-600' : 'border border-gray-300'
            } rounded-lg ${
              splitView ? 'text-white hover:bg-indigo-700' : 'text-gray-700 hover:bg-gray-50'
            } transition-colors`}
          >
            <FaColumns className="mr-2" /> {splitView ? 'Exit Explorer' : 'API Explorer'}
          </button>
          <button
            onClick={() => navigate(`/projects/${projectId}/run-tests`)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaPlay className="mr-2" /> Run Tests
          </button>
          <button
            onClick={() => navigate(`/projects/${projectId}/edit`)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
      
      {splitView ? (
        // Split View Mode (ReDoc/Postman-like)
        // Split View Mode (ReDoc/Postman-like)
        <div 
          ref={contentRef}
          className="flex flex-grow border border-gray-200 rounded-lg bg-white shadow-md h-[calc(100vh-180px)] overflow-hidden"
        >
          {/* Left Panel - API Documentation */}
          <div 
            className="overflow-auto"
            style={{ width: `${splitViewRatio}%` }}
          >
            <div className="flex flex-col h-full">
              {/* Documentation Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <FaBookOpen className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold">API Documentation</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => project?.openapi_url && fetchOpenApiSpec(project.openapi_url)}
                    className="p-2 rounded-md hover:bg-gray-200 text-gray-600"
                    title="Refresh OpenAPI Spec"
                  >
                    <FaSyncAlt />
                  </button>
                  <button 
                    onClick={downloadOpenApiSpec}
                    className="p-2 rounded-md hover:bg-gray-200 text-gray-600"
                    title="Download OpenAPI Spec"
                    disabled={!openApiSpec}
                  >
                    <FaDownload />
                  </button>
                </div>
              </div>
              
              {/* Documentation Content */}
              <div className="flex-grow overflow-auto p-4">
                {openApiLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <FaSpinner className="animate-spin text-blue-600 text-3xl" />
                  </div>
                ) : openApiError ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaExclamationTriangle className="mr-2" />
                      <h3 className="font-medium">Error Loading OpenAPI Specification</h3>
                    </div>
                    <p>{openApiError}</p>
                    <button
                      onClick={() => project?.openapi_url && fetchOpenApiSpec(project.openapi_url)}
                      className="mt-3 px-3 py-1 bg-red-700 text-white rounded-md text-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : openApiSpec ? (
                  <div className="space-y-6">
                    {/* API Info */}
                    <div>
                      <h3 className="text-xl font-bold mb-2">{openApiSpec.info?.title || 'API Documentation'}</h3>
                      <p className="text-gray-600 mb-4">{openApiSpec.info?.description || 'No description available'}</p>
                      
                      {openApiSpec.info?.version && (
                        <div className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Version:</span> {openApiSpec.info.version}
                        </div>
                      )}
                      
                      {openApiSpec.servers && openApiSpec.servers.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Servers:</h4>
                          <ul className="space-y-1">
                            {openApiSpec.servers.map((server, index) => (
                              <li key={index} className="text-sm">
                                <span className="font-mono text-blue-600">{server.url}</span>
                                {server.description && (
                                  <span className="text-gray-500 ml-2">({server.description})</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {/* API Endpoints */}
                    <div>
                      <h3 className="text-lg font-bold mb-3 pb-2 border-b border-gray-200">Endpoints</h3>
                      <div className="space-y-1">
                        <div className="relative mb-3">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Filter endpoints..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                            value={endpointFilter}
                            onChange={(e) => setEndpointFilter(e.target.value)}
                          />
                        </div>
                        
                        {Object.entries(endpointsByTag).map(([tag, tagEndpoints]) => (
                          <div key={tag} className="mb-4">
                            <div 
                              className="flex items-center justify-between bg-gray-50 p-2 rounded-lg cursor-pointer"
                              onClick={() => toggleTagExpansion(tag)}
                            >
                              <h4 className="font-medium text-gray-800">{tag}</h4>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-500 mr-2">{tagEndpoints.length} endpoints</span>
                                {expandedTags[tag] ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
                              </div>
                            </div>
                            
                            {expandedTags[tag] && (
                              <div className="ml-2 mt-2 space-y-2">
                                {tagEndpoints.map((endpoint) => (
                                  <div 
                                    key={endpoint.id} 
                                    className={`p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                                      selectedEndpoint?.id === endpoint.id ? 'bg-blue-50 border border-blue-200' : ''
                                    }`}
                                    onClick={() => handleEndpointSelect(endpoint)}
                                  >
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
                                      <span className="font-mono text-sm">{endpoint.path}</span>
                                    </div>
                                    {endpoint.description && (
                                      <p className="text-xs text-gray-500 mt-1 ml-1">{endpoint.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {Object.keys(endpointsByTag).length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No endpoints found matching your filter.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
                      <FaBookOpen className="text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No OpenAPI Specification</h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                      {project.openapi_url ? 
                        'Click the refresh button to load the OpenAPI specification.' : 
                        'This project does not have an associated OpenAPI specification.'}
                    </p>
                    {project.openapi_url && (
                      <button
                        onClick={() => fetchOpenApiSpec(project.openapi_url)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <FaSyncAlt className="mr-2 inline" /> Load Specification
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Resizer */}
          <div 
            className="cursor-col-resize bg-gray-200 hover:bg-blue-500 w-1 flex-shrink-0"
            onMouseDown={() => setIsDragging(true)}
          ></div>
          
          {/* Right Panel - API Tester */}
          <div 
            className="overflow-auto"
            style={{ width: `${100 - splitViewRatio}%` }}
          >
            <div className="flex flex-col h-full">
              {/* Tester Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <FaTerminal className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold">API Tester</h2>
                </div>
                {selectedEndpoint && (
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mr-2 ${
                      selectedEndpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      selectedEndpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      selectedEndpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      selectedEndpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedEndpoint.method}
                    </span>
                    <span className="font-mono text-sm">{selectedEndpoint.path}</span>
                  </div>
                )}
              </div>
              
              {/* Tester Content */}
              <div className="flex-grow p-4">
                {selectedEndpoint ? (
                  <div className="space-y-6">
                    {/* Endpoint Info */}
                    <div>
                      <h3 className="text-lg font-bold mb-2">{selectedEndpoint.description || `${selectedEndpoint.method} ${selectedEndpoint.path}`}</h3>
                      
                      {/* Test Generation Button */}
                      <div className="flex mt-4 space-x-3">
                        <button
                          onClick={() => generateTestCases(selectedEndpoint)}
                          disabled={generatingTests}
                          className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
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
                              Generate Tests with AI
                            </>
                          )}
                        </button>
                        
                        <select 
                          value={aiModelForTests}
                          onChange={(e) => setAiModelForTests(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          <option value="gemini-pro">Gemini Pro</option>
                          <option value="claude">Claude</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Request Tester */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Tabs Navigation */}
                      <div className="bg-gray-50 border-b border-gray-200 px-4">
                        <div className="flex -mb-px">
                          <button className="py-3 px-4 border-b-2 border-blue-500 text-blue-600 font-medium">
                            Request
                          </button>
                          <button className="py-3 px-4 text-gray-500 hover:text-gray-700 font-medium">
                            Tests
                          </button>
                          <button className="py-3 px-4 text-gray-500 hover:text-gray-700 font-medium">
                            Results
                          </button>
                        </div>
                      </div>
                      
                      {/* Request Form */}
                      <div className="p-4">
                        {/* URL and Method */}
                        <div className="flex mb-4">
                          <select
                            className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2 rounded-l-lg font-medium"
                            defaultValue={selectedEndpoint.method}
                            disabled
                          >
                            <option>{selectedEndpoint.method}</option>
                          </select>
                          <input
                            type="text"
                            className="flex-grow border border-l-0 border-gray-300 px-3 py-2 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            value={selectedEndpoint.path}
                            readOnly
                          />
                          <button 
                            className="ml-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center"
                            title="Copy URL"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedEndpoint.path);
                              showNotification("URL copied to clipboard", "success");
                            }}
                          >
                            <FaCopy />
                          </button>
                        </div>
                        
                        {/* Tabs for Request Content */}
                        <div className="mb-4">
                          <div className="flex border-b border-gray-200">
                          <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                              Params
                            </button>
                            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium text-sm">
                              Headers
                            </button>
                            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium text-sm">
                              Body
                            </button>
                            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium text-sm">
                              Auth
                            </button>
                          </div>
                        </div>
                        
                        {/* Parameters Section */}
                        <div className="mb-6">
                          {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 ? (
                            <div className="space-y-3">
                              {selectedEndpoint.parameters.filter(p => p.in === 'query' || p.in === 'path').map((param, index) => (
                                <div key={index} className="flex items-center">
                                  <div className="w-1/4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium text-gray-700 mr-1">{param.name}</span>
                                      {param.required && <span className="text-red-500">*</span>}
                                    </div>
                                    <div className="text-xs text-gray-500">{param.in}</div>
                                  </div>
                                  <input
                                    type="text"
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={param.description || param.name}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 bg-gray-50 rounded-lg">
                              <p className="text-gray-500 text-sm">No parameters defined for this endpoint.</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Request Body (if applicable) */}
                        {(selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT' || selectedEndpoint.method === 'PATCH') && selectedEndpoint.requestBody && (
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Request Body</h4>
                            <div className="relative">
                              <div className="absolute top-2 right-2 z-10 flex space-x-2">
                                <button 
                                  className="bg-gray-200 hover:bg-gray-300 rounded p-1 text-xs"
                                  title="Format JSON"
                                >
                                  Format
                                </button>
                                <button 
                                  className="bg-gray-200 hover:bg-gray-300 rounded p-1 text-xs"
                                  title="Copy JSON"
                                >
                                  Copy
                                </button>
                              </div>
                              <SyntaxHighlighter 
                                language="json" 
                                style={docco}
                                className="rounded-lg border border-gray-300 p-4 font-mono text-sm"
                                wrapLongLines={true}
                              >
                                {JSON.stringify(selectedEndpoint.requestBody, null, 2) || '{\n  \n}'}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        )}
                        
                        {/* Action Button */}
                        <div className="flex justify-end border-t border-gray-200 pt-4">
                          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                            <FaPlay className="mr-2" /> Send Request
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Response Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                        <h3 className="font-medium">Response</h3>
                        <div className="flex items-center">
                          <span className="px-2 py-1 bg-gray-200 rounded text-xs font-medium mr-2">Status: -</span>
                          <span className="text-xs text-gray-500">Time: -</span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">Send a request to see the response</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                    <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
                      <FaTerminal className="text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Select an Endpoint</h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                      Choose an endpoint from the documentation panel to start testing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Regular View Mode
        <>
          {/* Project Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Project Details</h2>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-800">
                {project.description || 'No description provided'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                <p className="text-gray-800">
                  {new Date(project.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                <p className="text-gray-800">
                  {new Date(project.updated_at || project.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    project.status === 'active' ? 'bg-green-500' :
                    project.status === 'archived' ? 'bg-gray-500' : 'bg-yellow-500'
                  }`}></span>
                  <span className="capitalize">{project.status || 'active'}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
                <p className="text-gray-800 capitalize">{project.type || 'Unknown'}</p>
              </div>
            </div>
            
            {project.openapi_url && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">OpenAPI URL</h3>
                  <div className="flex space-x-2">
                    <a
                      href={project.openapi_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      View Specification <FaExternalLinkAlt className="ml-1 text-xs" />
                    </a>
                    <button
                      onClick={() => {
                        fetchOpenApiSpec(project.openapi_url);
                        setSplitView(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                    >
                      Explore API <FaBookOpen className="ml-1 text-xs" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 break-all">{project.openapi_url}</p>
              </div>
            )}
          </div>
          
          {/* API Endpoints Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h2 className="text-xl font-bold">API Endpoints</h2>
              <div className="flex gap-2">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 rounded-md flex items-center ${
                      viewMode === 'table'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaTable className="mr-1" /> Table
                  </button>
                  <button
                    onClick={() => setViewMode('docs')}
                    className={`px-3 py-1 rounded-md flex items-center ${
                      viewMode === 'docs'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaBookOpen className="mr-1" /> Docs
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/projects/${projectId}/import`)}
                    className="flex items-center px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Import OpenAPI
                  </button>
                  <button
                    onClick={() => navigate(`/projects/${projectId}/add-endpoint`)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <FaPlus className="mr-1" /> Add Endpoint
                  </button>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Filter endpoints..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                  value={endpointFilter}
                  onChange={(e) => setEndpointFilter(e.target.value)}
                />
              </div>
            </div>
            
            {endpointsLoading ? (
              <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-blue-600 text-2xl" />
              </div>
            ) : endpointsError ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                <p>{endpointsError.displayMessage || 'Failed to load API endpoints'}</p>
              </div>
            ) : viewMode === 'table' ? (
              // Table View Mode
              filteredEndpoints && filteredEndpoints.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEndpoints.map((endpoint) => (
                        <tr key={endpoint.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                              endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                              endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                              endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {endpoint.method}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {endpoint.path}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {endpoint.description || 'No description'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              onClick={() => handleEndpointSelect(endpoint)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Test
                            </button>
                            <button
                              onClick={() => navigate(`/projects/${projectId}/endpoints/${endpoint.id}`)}
                              className="text-indigo-600 hover:text-indigo-900"
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
                  <p className="text-gray-500 mb-3">
                    {endpointFilter ? 'No endpoints match your search filter.' : 'No API endpoints have been added to this project yet.'}
                  </p>
                  {!endpointFilter && (
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => navigate(`/projects/${projectId}/import`)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Import OpenAPI Schema
                      </button>
                      <button
                        onClick={() => navigate(`/projects/${projectId}/add-endpoint`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Endpoint Manually
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              // Documentation View Mode
              filteredEndpoints && filteredEndpoints.length > 0 ? (
                <div className="border border-gray-200 rounded-lg">
                  {Object.entries(endpointsByTag).map(([tag, tagEndpoints]) => (
                    <div key={tag} className="border-b border-gray-200 last:border-b-0">
                      <div 
                        className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleTagExpansion(tag)}
                      >
                        <h3 className="font-medium text-gray-700">{tag}</h3>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">{tagEndpoints.length} endpoints</span>
                          <span>
                            {expandedTags[tag] ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
                          </span>
                        </div>
                      </div>
                      
                      {expandedTags[tag] && (
                        <div className="divide-y divide-gray-100">
                          {tagEndpoints.map((endpoint) => (
                            <SwaggerEndpointCard
                              key={endpoint.id}
                              endpoint={endpoint}
                              onTest={() => handleEndpointSelect(endpoint)}
                              onViewDetails={() => navigate(`/projects/${projectId}/endpoints/${endpoint.id}`)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-3">
                    {endpointFilter ? 'No endpoints match your search filter.' : 'No API endpoints have been added to this project yet.'}
                  </p>
                  {!endpointFilter && (
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => navigate(`/projects/${projectId}/import`)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Import OpenAPI Schema
                      </button>
                      <button
                        onClick={() => navigate(`/projects/${projectId}/add-endpoint`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Endpoint Manually
                      </button>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
          
          {/* Test History Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Test History</h2>
              <button
                onClick={() => navigate(`/projects/${projectId}/run-tests`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlay className="mr-2" /> Run Tests
              </button>
            </div>
            
            {testHistoryLoading ? (
              <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-blue-600 text-2xl" />
              </div>
            ) : testHistoryError ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                <p>{testHistoryError.displayMessage || 'Failed to load test history'}</p>
              </div>
            ) : testHistory && testHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {testHistory.map((run) => (
                      <tr key={run.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(run.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {run.duration}s
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {run.total_tests} ({run.passed_tests} passed, {run.failed_tests} failed)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className={`h-2.5 rounded-full ${
                                run.pass_rate > 80 ? 'bg-green-600' :
                                run.pass_rate > 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} style={{ width: `${run.pass_rate}%` }}></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-700">{run.pass_rate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => navigate(`/projects/${projectId}/test-runs/${run.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Results
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-3">No tests have been run for this project yet.</p>
                <button
                  onClick={() => navigate(`/projects/${projectId}/run-tests`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Run Tests Now
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Endpoint Tester Modal */}
      {showEndpointTester && selectedEndpoint && (
        <EndpointTester
          endpoint={selectedEndpoint}
          projectId={projectId}
          onClose={() => setShowEndpointTester(false)}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteProjectModal
          project={project}
          isDeleting={deleteProjectMutation.isLoading}
          onDelete={handleDeleteProject}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

// Swagger-like Endpoint Card Component
const SwaggerEndpointCard = ({ endpoint, onTest, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border-t border-gray-100 first:border-t-0">
      <div
        className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mr-3 ${
            endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
            endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {endpoint.method}
          </span>
          <span className="font-mono text-sm">{endpoint.path}</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTest();
            }}
            className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 mr-2"
          >
            Try it
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100 mr-2"
          >
            Details
          </button>
          <FaChevronDown className={`text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700">Description</h4>
            <p className="text-sm text-gray-600 mt-1">{endpoint.description || 'No description available'}</p>
          </div>
          
          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700">Parameters</h4>
              <div className="mt-1 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-1 text-left text-xs font-medium text-gray-500">Name</th>
                      <th className="px-3 py-1 text-left text-xs font-medium text-gray-500">In</th>
                      <th className="px-3 py-1 text-left text-xs font-medium text-gray-500">Type</th>
                      <th className="px-3 py-1 text-left text-xs font-medium text-gray-500">Required</th>
                      <th className="px-3 py-1 text-left text-xs font-medium text-gray-500">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {endpoint.parameters.map((param, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-1 whitespace-nowrap font-mono text-xs">{param.name}</td>
                        <td className="px-3 py-1 whitespace-nowrap text-xs">{param.in}</td>
                        <td className="px-3 py-1 whitespace-nowrap text-xs">{param.type}</td>
                        <td className="px-3 py-1 whitespace-nowrap text-xs">
                          {param.required ? (
                            <span className="text-red-600">Yes</span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </td>
                        <td className="px-3 py-1 text-xs">{param.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {endpoint.requestBody && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700">Request Body</h4>
              <div className="mt-1 bg-gray-100 p-3 rounded-md">
                <pre className="text-xs overflow-x-auto font-mono">
                  {JSON.stringify(endpoint.requestBody, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          {endpoint.responses && Object.keys(endpoint.responses).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700">Responses</h4>
              <div className="mt-1">
                {Object.entries(endpoint.responses).map(([code, response]) => (
                  <div key={code} className="mb-2">
                    <div className="flex items-center mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        code.startsWith('2') ? 'bg-green-100 text-green-800' :
                        code.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
                        code.startsWith('5') ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {code}
                      </span>
                      <span className="ml-2 text-xs text-gray-600">{response.description}</span>
                    </div>
                    {response.content && (
                      <div className="bg-gray-100 p-2 rounded-md">
                        <pre className="text-xs overflow-x-auto font-mono">
                          {JSON.stringify(response.content, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-3 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTest();
              }}
              className="flex items-center text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              <FaTerminal className="mr-1" /> Test Endpoint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to group endpoints by tag
function groupEndpointsByTag(endpoints) {
  if (!endpoints || !Array.isArray(endpoints)) return {};
  
  const grouped = {};
  endpoints.forEach(endpoint => {
    const tag = endpoint.tag || 'Default';
    if (!grouped[tag]) {
      grouped[tag] = [];
    }
    grouped[tag].push(endpoint);
  });
  return grouped;
}

export default ProjectDetail;