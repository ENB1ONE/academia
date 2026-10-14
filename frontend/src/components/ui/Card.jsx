import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-gray-200 ${padding} ${className} ${onClick ? 'cursor-pointer hover:border-primary/50 transition-colors' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
