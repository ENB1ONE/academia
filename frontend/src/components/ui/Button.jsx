import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';
  
  const variants = {
    primary: 'bg-[#E5A910] text-[#0A0A0C] hover:bg-[#C89008] focus:ring-[#E5A910] shadow-[0_4px_14px_rgba(229,169,16,0.25)]',
    secondary: 'bg-[#1F1F27] text-white hover:bg-[#2A2A35] border border-white/10 focus:ring-gray-500',
    danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger',
    outline: 'border border-white/15 hover:bg-white/5 text-white focus:ring-[#E5A910]',
    ghost: 'hover:bg-white/5 text-gray-300 hover:text-white',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

export default Button;
