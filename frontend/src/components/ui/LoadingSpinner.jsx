import React from 'react';

const LoadingSpinner = ({ className = "h-6 w-6" }) => {
  return (
    <div className={`animate-spin rounded-full border-2 border-surface border-t-primary ${className}`} />
  );
};

export default LoadingSpinner;
