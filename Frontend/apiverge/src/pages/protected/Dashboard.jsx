// src/pages/protected/Dashboard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/apiConfig';
import { useProjects } from '../../hooks/useProjects';
import { 
  FaProjectDiagram, 
  FaCheckCircle, 
  FaTimes, 
  FaClock, 
  FaChartLine,
  FaServer,
  FaBug,
  FaSpinner
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Fetch projects data
  const { data: projects, isLoading: projectsLoading } = useProjects();
  
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/api/dashboard/stats');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch recent activity
  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const response = await apiClient.get('/api/dashboard/activity');
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
  
  // Loading state
  const isLoading = projectsLoading || statsLoading || activityLoading;
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your API testing platform overview</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        </div>
      ) : (
        <>
          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FaProjectDiagram className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Projects</p>
                  <p className="text-2xl font-bold">{stats?.total_projects || 0}</p>
                </div>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => navigate('/projects')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View All Projects
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FaCheckCircle className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Passing Tests</p>
                  <p className="text-2xl font-bold">{stats?.passing_tests || 0}</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats?.test_pass_rate || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stats?.test_pass_rate || 0}% success rate</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                  <FaBug className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Current Issues</p>
                  <p className="text-2xl font-bold">{stats?.error_count || 0}</p>
                </div>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => navigate('/projects/issues')}
                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                >
                  View All Issues
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FaServer className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">API Endpoints</p>
                  <p className="text-2xl font-bold">{stats?.total_endpoints || 0}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Across {stats?.total_projects || 0} projects
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Recent Projects Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Projects</h2>
                <button 
                  onClick={() => navigate('/projects')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              
              {projects && projects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.slice(0, 5).map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                              project.status === 'active' ? 'bg-green-100 text-green-800' :
                              project.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status || 'active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.test_count || 0} tests
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.last_run_at ? new Date(project.last_run_at).toLocaleString() : 'Never'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-3">You haven't created any projects yet.</p>
                  <button
                    onClick={() => navigate('/projects')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Project
                  </button>
                </div>
              )}
            </motion.div>
            
            {/* Activity Feed */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
              
              {activity && activity.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {activity.map((item, index) => (
                      <li key={item.id}>
                        <div className="relative pb-8">
                          {index !== activity.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                item.type === 'test_run' ? 'bg-blue-100 text-blue-600' :
                                item.type === 'error' ? 'bg-red-100 text-red-600' :
                                item.type === 'create' ? 'bg-green-100 text-green-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {item.type === 'test_run' && <FaClock />}
                                {item.type === 'error' && <FaTimes />}
                                {item.type === 'create' && <FaCheckCircle />}
                                {item.type === 'update' && <FaChartLine />}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {item.message}
                                  <span className="whitespace-nowrap text-xs ml-1">
                                    ({new Date(item.timestamp).toLocaleString()})
                                  </span>
                                </p>
                              </div>
                              <div className="mt-1">
                                <button 
                                  onClick={() => navigate(item.link)}
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                  View details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No recent activity to show.</p>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Performance Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">API Performance Overview</h2>
              <button 
                onClick={() => navigate('/analytics/performance')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Full Analytics
              </button>
            </div>
            
            {stats?.performance_data ? (
              <div className="h-64">
                {/* This would be replaced with an actual chart component like recharts */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    [Performance chart would be displayed here using data from stats.performance_data]
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-3">No performance data available yet.</p>
                <p className="text-sm text-gray-400">Run tests on your APIs to collect performance metrics.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Dashboard;