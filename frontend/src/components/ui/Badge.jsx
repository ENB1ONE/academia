import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    success: 'bg-[#D4EDDA] text-[#155724] border-[#C3E6CB]',
    warning: 'bg-[#FFF3CD] text-[#856404] border-[#FFEEBA]',
    danger: 'bg-[#F8D7DA] text-[#721C24] border-[#F5C6CB]',
    info: 'bg-[#D1ECF1] text-[#0C5460] border-[#BEE5EB]',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
