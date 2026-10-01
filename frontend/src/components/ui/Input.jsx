import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`block w-full rounded-lg bg-background border border-gray-700 text-text 
            focus:ring-primary focus:border-primary sm:text-sm
            ${Icon ? 'pl-10' : 'pl-3'}
            ${error ? 'border-danger focus:ring-danger focus:border-danger' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
