import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', onClick }) => {
  return (
    <div 
      className={`bg-[#141418] rounded-2xl shadow-xl border border-white/[0.08] text-white ${padding} ${className} ${onClick ? 'cursor-pointer hover:border-primary/50 transition-colors' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
