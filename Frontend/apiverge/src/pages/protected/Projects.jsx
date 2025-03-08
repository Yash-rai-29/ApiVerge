// // src/pages/protected/Projects.jsx

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { useProjects, useProject, useCreateProject, useDeleteProject } from '../../hooks/useProjects';
// import { useUiStore } from '../../stores/uiStore';
// import { FaPlus, FaTrash, FaEdit, FaPlay, FaSpinner } from 'react-icons/fa';

// const Projects = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const showNotification = useUiStore((state) => state.showNotification);
  
//   // Get projects data
//   const { 
//     data: projects, 
//     isLoading: projectsLoading, 
//     error: projectsError,
//     refetch: refetchProjects
//   } = useProjects();
  
//   // Get single project data if ID is provided
//   const { 
//     data: project, 
//     isLoading: projectLoading, 
//     error: projectError 
//   } = useProject(id);
  
//   // Mutations
//   const createProjectMutation = useCreateProject();
//   const deleteProjectMutation = useDeleteProject();
  
//   // Local state
//   const [showNewProjectModal, setShowNewProjectModal] = useState(false);
//   const [newProjectName, setNewProjectName] = useState('');
//   const [newProjectDescription, setNewProjectDescription] = useState('');
  
//   // Handle new project creation
//   const handleCreateProject = async (e) => {
//     e.preventDefault();
    
//     if (!newProjectName) {
//       showNotification('Project name is required', 'error');
//       return;
//     }
    
//     try {
//       await createProjectMutation.mutateAsync({
//         name: newProjectName,
//         description: newProjectDescription
//       });
      
//       setShowNewProjectModal(false);
//       setNewProjectName('');
//       setNewProjectDescription('');
//       showNotification('Project created successfully', 'success');
      
//       // Refresh projects list
//       refetchProjects();
//     } catch (error) {
//       showNotification(error.displayMessage || 'Failed to create project', 'error');
//     }
//   };
  
//   // Handle project deletion
//   const handleDeleteProject = async (projectId) => {
//     if (!confirm('Are you sure you want to delete this project?')) {
//       return;
//     }
    
//     try {
//       await deleteProjectMutation.mutateAsync(projectId);
//       showNotification('Project deleted successfully', 'success');
      
//       if (id === projectId) {
//         navigate('/projects');
//       }
//     } catch (error) {
//       showNotification(error.displayMessage || 'Failed to delete project', 'error');
//     }
//   };
  
//   // If viewing a specific project
//   if (id) {
//     return (
//       <div>
//         {projectLoading ? (
//           <div className="flex justify-center my-12">
//             <FaSpinner className="animate-spin text-blue-600 text-3xl" />
//           </div>
//         ) : projectError ? (
//           <div className="bg-red-50 text-red-700 p-4 rounded-lg">
//             {projectError.displayMessage || 'Failed to load project'}
//           </div>
//         ) : project ? (
//           <ProjectDetail project={project} onDelete={handleDeleteProject} />
//         ) : (
//           <div className="text-center my-12">
//             <p className="text-lg text-gray-600">Project not found</p>
//             <button 
//               onClick={() => navigate('/projects')}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
//             >
//               View All Projects
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }
  
//   // Projects list view
//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
//         <button
//           onClick={() => setShowNewProjectModal(true)}
//           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <FaPlus className="mr-2" /> New Project
//         </button>
//       </div>
      
//       {projectsLoading ? (
//         <div className="flex justify-center my-12">
//           <FaSpinner className="animate-spin text-blue-600 text-3xl" />
//         </div>
//       ) : projectsError ? (
//         <div className="bg-red-50 text-red-700 p-4 rounded-lg">
//           {projectsError.displayMessage || 'Failed to load projects'}
//         </div>
//       ) : projects?.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map((project) => (
//             <ProjectCard 
//               key={project.id} 
//               project={project} 
//               onDelete={() => handleDeleteProject(project.id)} 
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <h3 className="text-lg font-medium text-gray-700 mb-2">No projects yet</h3>
//           <p className="text-gray-500 mb-4">Create your first project to get started</p>
//           <button
//             onClick={() => setShowNewProjectModal(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Create Project
//           </button>
//         </div>
//       )}
      
//       {/* New Project Modal */}
//       {showNewProjectModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
//           >
//             <h2 className="text-xl font-bold mb-4">Create New Project</h2>
//             <form onSubmit={handleCreateProject}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Project Name*
//                 </label>
//                 <input
//                   type="text"
//                   value={newProjectName}
//                   onChange={(e) => setNewProjectName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="My API Project"
//                   required
//                 />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   value={newProjectDescription}
//                   onChange={(e) => setNewProjectDescription(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   rows="3"
//                   placeholder="Brief description of your project"
//                 ></textarea>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowNewProjectModal(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={createProjectMutation.isLoading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
//                 >
//                   {createProjectMutation.isLoading ? (
//                     <>
//                       <FaSpinner className="animate-spin mr-2 inline" />
//                       Creating...
//                     </>
//                   ) : (
//                     'Create Project'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Project Card Component
// const ProjectCard = ({ project, onDelete }) => {
//   const navigate = useNavigate();
  
//   return (
//     <motion.div 
//       whileHover={{ y: -5 }}
//       className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
//     >
//       <div className="p-5">
//         <h3 className="font-bold text-lg mb-2 truncate">{project.name}</h3>
//         <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//           {project.description || 'No description provided'}
//         </p>
//         <div className="flex justify-between items-center">
//           <button
//             onClick={() => navigate(`/projects/${project.id}`)}
//             className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//           >
//             View Details
//           </button>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => navigate(`/projects/${project.id}/edit`)}
//               className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
//               title="Edit Project"
//             >
//               <FaEdit />
//             </button>
//             <button
//               onClick={() => onDelete(project.id)}
//               className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
//               title="Delete Project"
//             >
//               <FaTrash />
//             </button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Project Detail Component
// const ProjectDetail = ({ project, onDelete }) => {
//   const navigate = useNavigate();
  
//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <button
//             onClick={() => navigate('/projects')}
//             className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
//           >
//             <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Projects
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => navigate(`/projects/${project.id}/edit`)}
//             className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             <FaEdit className="mr-2" /> Edit
//           </button>
//           <button
//             onClick={() => onDelete(project.id)}
//             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             <FaTrash className="mr-2" /> Delete
//           </button>
//         </div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-xl font-bold mb-4">Project Details</h2>
        
//         <div className="mb-4">
//           <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
//           <p className="text-gray-800">
//             {project.description || 'No description provided'}
//           </p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
//             <p className="text-gray-800">
//               {new Date(project.created_at).toLocaleString()}
//             </p>
//           </div>
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
//             <p className="text-gray-800">
//               {new Date(project.updated_at).toLocaleString()}
//             </p>
//           </div>
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
//             <div className="flex items-center">
//               <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
//                 project.status === 'active' ? 'bg-green-500' : 
//                 project.status === 'archived' ? 'bg-gray-500' : 'bg-yellow-500'
//               }`}></span>
//               <span className="capitalize">{project.status || 'active'}</span>
//             </div>
//           </div>
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-1">API Count</h3>
//             <p className="text-gray-800">{project.api_count || 0} APIs</p>
//           </div>
//         </div>
//       </div>
      
//       {/* API Endpoints Section */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">API Endpoints</h2>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => navigate(`/projects/${project.id}/import`)}
//               className="flex items-center px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
//             >
//               Import OpenAPI
//             </button>
//             <button
//               onClick={() => navigate(`/projects/${project.id}/add-endpoint`)}
//               className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
//             >
//               <FaPlus className="mr-1" /> Add Endpoint
//             </button>
//           </div>
//         </div>
        
//         {project.endpoints && project.endpoints.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {project.endpoints.map((endpoint) => (
//                   <tr key={endpoint.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
//                         endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
//                         endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
//                         endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
//                         endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {endpoint.method}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {endpoint.path}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
//                       {endpoint.description || 'No description'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {endpoint.test_count || 0}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
//                         endpoint.status === 'active' ? 'bg-green-100 text-green-800' :
//                         endpoint.status === 'deprecated' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {endpoint.status || 'active'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
//                       <button
//                         onClick={() => navigate(`/projects/${project.id}/endpoints/${endpoint.id}`)}
//                         className="text-blue-600 hover:text-blue-900 mr-3"
//                       >
//                         View
//                       </button>
//                       <button
//                         onClick={() => navigate(`/projects/${project.id}/endpoints/${endpoint.id}/tests`)}
//                         className="text-green-600 hover:text-green-900"
//                       >
//                         Tests
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-8 bg-gray-50 rounded-lg">
//             <p className="text-gray-500 mb-3">No API endpoints have been added to this project yet.</p>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={() => navigate(`/projects/${project.id}/import`)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Import OpenAPI Schema
//               </button>
//               <button
//                 onClick={() => navigate(`/projects/${project.id}/add-endpoint`)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Add Endpoint Manually
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Test History Section */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Test History</h2>
//           <button
//             onClick={() => navigate(`/projects/${project.id}/run-tests`)}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <FaPlay className="mr-2" /> Run Tests
//           </button>
//         </div>
        
//         {project.test_runs && project.test_runs.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {project.test_runs.map((run) => (
//                   <tr key={run.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {new Date(run.created_at).toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {run.duration}s
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {run.total_tests} ({run.passed_tests} passed, {run.failed_tests} failed)
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                           <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${run.pass_rate}%` }}></div>
//                         </div>
//                         <span className="ml-2 text-sm text-gray-700">{run.pass_rate}%</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
//                       <button
//                         onClick={() => navigate(`/projects/${project.id}/test-runs/${run.id}`)}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         View Results
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-8 bg-gray-50 rounded-lg">
//             <p className="text-gray-500 mb-3">No tests have been run for this project yet.</p>
//             <button
//               onClick={() => navigate(`/projects/${project.id}/run-tests`)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Run Tests Now
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Projects;
// src/pages/protected/Projects.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import ProjectsRouter from './Projects/index';

// This file redirects to the Projects module - all actual routes are handled in Projects/index.jsx
const Projects = () => {
  // Directly render the ProjectsRouter instead of redirecting
  return <ProjectsRouter />;
};

export default Projects;