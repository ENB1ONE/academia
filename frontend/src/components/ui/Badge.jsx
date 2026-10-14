import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-[#E5A910]/15 text-[#F5BE2C] border-[#E5A910]/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
    info: 'bg-primary/15 text-primary border-primary/30',
    neutral: 'bg-white/5 text-gray-300 border-white/10'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
