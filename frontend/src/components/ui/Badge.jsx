import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-accent/20 text-accent border-accent/30',
    danger: 'bg-danger/20 text-danger border-danger/30',
    info: 'bg-primary/20 text-primary border-primary/30',
    neutral: 'bg-gray-800 text-gray-300 border-gray-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
