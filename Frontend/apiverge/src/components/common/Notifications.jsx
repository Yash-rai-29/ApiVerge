// src/components/common/Notifications.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '../../stores/uiStore';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Notifications = () => {
  const { notification, dismissNotification } = useUiStore();
  
  if (!notification) return null;
  
  const { message, type } = notification;
  
  // Configure based on notification type
  const config = {
    success: {
      icon: <FaCheckCircle className="text-white" />,
      bgColor: 'bg-green-500',
    },
    error: {
      icon: <FaExclamationCircle className="text-white" />,
      bgColor: 'bg-red-500',
    },
    warning: {
      icon: <FaExclamationCircle className="text-white" />,
      bgColor: 'bg-yellow-500',
    },
    info: {
      icon: <FaInfoCircle className="text-white" />,
      bgColor: 'bg-blue-500',
    },
  };
  
  const { icon, bgColor } = config[type] || config.info;
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center max-w-md`}
        >
          <div className="mr-3">{icon}</div>
          <div className="flex-grow">{message}</div>
          <button 
            onClick={dismissNotification}
            className="ml-3 p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <FaTimes className="text-white" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Notifications;