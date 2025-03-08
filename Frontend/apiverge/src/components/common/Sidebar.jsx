/**
 * src/components/common/Sidebar.jsx
 * Modern sidebar for authenticated (protected) pages with icons and grouping
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaProjectDiagram, 
  FaChartBar,
  FaHistory,
  FaBug,
  FaBook,
  FaClipboardList,
  FaServer,
  FaChevronDown,
  FaChevronRight,
  FaPlus
} from 'react-icons/fa';

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState({
    projects: true,
    analytics: false,
    account: false
  });

  // Toggle a group's expanded state
  const toggleGroup = (group) => {
    setExpandedGroups({
      ...expandedGroups,
      [group]: !expandedGroups[group]
    });
  };

  // Check if a path is active (either exact match or starts with path for nested routes)
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Recent Projects Section */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Create New Project Button */}
        <div className="mb-6">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center font-medium transition-colors"
            onClick={() => {
              console.log('Create new project');
              closeSidebar && closeSidebar();
            }}
          >
            <FaPlus className="mr-2" /> New Project
          </motion.button>
        </div>
        
        <nav className="space-y-6">
          {/* Main Navigation Section */}
          <div>
            <NavItem 
              to="/dashboard" 
              icon={<FaHome />} 
              label="Dashboard" 
              isActive={isActive('/dashboard')}
              onClick={closeSidebar}
            />
            
            {/* Projects Group */}
            <SidebarGroup 
              title="Projects"
              icon={<FaProjectDiagram />}
              isExpanded={expandedGroups.projects}
              toggleExpanded={() => toggleGroup('projects')}
            >
              <NavItem 
                to="/projects" 
                icon={<FaClipboardList />} 
                label="All Projects" 
                isActive={isActive('/projects')}
                isChild
                onClick={closeSidebar}
              />
              <NavItem 
                to="/projects/recent" 
                icon={<FaHistory />} 
                label="Recent" 
                isActive={isActive('/projects/recent')}
                isChild
                onClick={closeSidebar}
              />
              <NavItem 
                to="/projects/templates" 
                icon={<FaBook />} 
                label="Templates" 
                isActive={isActive('/projects/templates')}
                isChild
                onClick={closeSidebar}
              />
              <NavItem 
                to="/projects/issues" 
                icon={<FaBug />} 
                label="Issues" 
                isActive={isActive('/projects/issues')}
                isChild
                onClick={closeSidebar}
              />
            </SidebarGroup>
            
            {/* Analytics Group */}
            <SidebarGroup 
              title="Analytics" 
              icon={<FaChartBar />}
              isExpanded={expandedGroups.analytics}
              toggleExpanded={() => toggleGroup('analytics')}
            >
              <NavItem 
                to="/analytics/overview" 
                icon={<FaChartBar />} 
                label="Overview" 
                isActive={isActive('/analytics/overview')}
                isChild
                onClick={closeSidebar}
              />
              <NavItem 
                to="/analytics/performance" 
                icon={<FaServer />} 
                label="API Performance" 
                isActive={isActive('/analytics/performance')}
                isChild
                onClick={closeSidebar}
              />
              <NavItem 
                to="/analytics/reports" 
                icon={<FaClipboardList />} 
                label="Reports" 
                isActive={isActive('/analytics/reports')}
                isChild
                onClick={closeSidebar}
              />
            </SidebarGroup>
                        
          </div>
          
          {/* Favorites (Pinned Projects) */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Favorites
            </h3>
            <div className="space-y-1">
              <PinnedProjectItem 
                name="OpenAPI Parser" 
                status="active" 
                path="/projects/openapi-parser"
                onClick={closeSidebar}
              />
              <PinnedProjectItem 
                name="E-commerce API Tests" 
                status="warning" 
                path="/projects/ecommerce-api"
                onClick={closeSidebar}
              />
              <PinnedProjectItem 
                name="Payment Gateway" 
                status="error" 
                path="/projects/payment-gateway"
                onClick={closeSidebar}
              />
            </div>
          </div>
        </nav>
      </div>
      
      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              U
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Current Workspace</p>
            <div className="flex items-center">
              <p className="text-xs text-gray-500">Personal</p>
              <svg className="ml-1 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Navigation Item Component
const NavItem = ({ to, icon, label, isActive, isChild = false, onClick }) => {
  return (
    <Link
      to={to}
      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
      } ${isChild ? 'pl-10' : ''}`}
      onClick={onClick}
    >
      <span className={`mr-3 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
};

// Collapsible Sidebar Group Component
const SidebarGroup = ({ title, icon, children, isExpanded, toggleExpanded }) => {
  return (
    <div className="space-y-1">
      <button
        onClick={toggleExpanded}
        className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      >
        <span className="mr-3 text-gray-500 group-hover:text-gray-600">
          {icon}
        </span>
        <span className="flex-1 text-left">{title}</span>
        <span className="text-gray-500">
          {isExpanded ? <FaChevronDown className="h-3 w-3" /> : <FaChevronRight className="h-3 w-3" />}
        </span>
      </button>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-1"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

// Pinned Project Item Component
const PinnedProjectItem = ({ name, status, path, onClick }) => {
  const statusColors = {
    active: "bg-green-400",
    warning: "bg-yellow-400",
    error: "bg-red-400"
  };
  
  return (
    <Link 
      to={path} 
      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      onClick={onClick}
    >
      <span className={`h-2 w-2 rounded-full ${statusColors[status]} mr-3`}></span>
      <span className="truncate">{name}</span>
    </Link>
  );
};

export default Sidebar;