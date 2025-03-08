// src/pages/protected/Projects/ProjectDetail.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FaExclamationTriangle 
} from 'react-icons/fa';
import EndpointTester from '../components/EndpointTester';
import DeleteProjectModal from '../components/DeleteProjectModal';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);
  
  // States
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [showEndpointTester, setShowEndpointTester] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [endpointViewMode, setEndpointViewMode] = useState('table'); // 'table' or 'swagger'
  
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
    error: endpointsError
  } = useProjectEndpoints(projectId);
  
  // Fetch test history
  const {
    data: testHistory,
    isLoading: testHistoryLoading,
    error: testHistoryError
  } = useProjectTestHistory(projectId);
  
  // Delete project mutation
  const deleteProjectMutation = useDeleteProject();
  
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
    setShowEndpointTester(true);
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
  
  return (
    <div>
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
        <div className="flex space-x-3">
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
              <a 
                href={project.openapi_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                View Specification <FaExternalLinkAlt className="ml-1 text-xs" />
              </a>
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
                onClick={() => setEndpointViewMode('table')}
                className={`px-3 py-1 rounded-md flex items-center ${
                  endpointViewMode === 'table' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaTable className="mr-1" /> Table
              </button>
              <button
                onClick={() => setEndpointViewMode('swagger')}
                className={`px-3 py-1 rounded-md flex items-center ${
                  endpointViewMode === 'swagger' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaColumns className="mr-1" /> Swagger UI
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
        
        {endpointsLoading ? (
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-blue-600 text-2xl" />
          </div>
        ) : endpointsError ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            <p>{endpointsError.displayMessage || 'Failed to load API endpoints'}</p>
          </div>
        ) : endpointViewMode === 'table' ? (
          // Table View Mode
          endpoints && endpoints.length > 0 ? (
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
                  {endpoints.map((endpoint) => (
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
              <p className="text-gray-500 mb-3">No API endpoints have been added to this project yet.</p>
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
            </div>
          )
        ) : (
          // Swagger UI-like View Mode
          endpoints && endpoints.length > 0 ? (
            <div className="border border-gray-200 rounded-lg">
              {Object.entries(groupEndpointsByTag(endpoints)).map(([tag, tagEndpoints]) => (
                <div key={tag} className="border-b border-gray-200 last:border-b-0">
                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">{tag}</h3>
                    <span className="text-xs text-gray-500">{tagEndpoints.length} endpoints</span>
                  </div>
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-3">No API endpoints have been added to this project yet.</p>
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

// Function to group endpoints by tag
function groupEndpointsByTag(endpoints) {
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

export default ProjectDetail;