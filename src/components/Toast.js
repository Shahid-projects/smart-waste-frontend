import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi'; // <-- Add FiInfo
import './Toast.css';

const Toast = ({ message, type }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  // Use an object to map types to icons
  const icons = {
    success: FiCheckCircle,
    error: FiXCircle,
    info: FiInfo // <-- Add info type
  };

  const Icon = icons[type] || FiInfo; // Default to info icon

  return (
    <div className={`toast ${type} ${visible ? 'visible' : 'hidden'}`}>
      <Icon className="toast-icon" />
      <span>{message}</span>
    </div>
  );
};

export default Toast;