// src/pages/protected/Projects/components/DeleteProjectModal.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const DeleteProjectModal = ({ project, isDeleting, onDelete, onCancel }) => {
  const [confirmName, setConfirmName] = useState('');

  const handleInputChange = (e) => {
    setConfirmName(e.target.value);
  };

  const isConfirmNameValid = confirmName.trim() === project.name;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center mb-4 text-red-600">
          <FaExclamationTriangle className="text-2xl mr-3" />
          <h2 className="text-xl font-bold">Delete Project</h2>
        </div>
        
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete the project <strong>{project.name}</strong>? This action cannot be undone and will permanently delete all associated data, including endpoints, tests, and history.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-sm text-red-700">
            To confirm, please type <strong>{project.name}</strong> below:
          </p>
          <input
            type="text"
            id="confirmProjectName"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            placeholder={project.name}
            value={confirmName}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting || !isConfirmNameValid}
            className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center ${
              isDeleting || !isConfirmNameValid
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {isDeleting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              'Delete Project'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteProjectModal;
