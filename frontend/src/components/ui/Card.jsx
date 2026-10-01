import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', onClick }) => {
  return (
    <div 
      className={`bg-surface rounded-xl shadow-lg border border-gray-800 ${padding} ${className} ${onClick ? 'cursor-pointer hover:border-gray-700 transition-colors' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
