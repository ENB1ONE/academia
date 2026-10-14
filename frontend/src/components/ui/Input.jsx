import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`block w-full rounded-xl bg-[#121216] border border-white/10 text-white placeholder-gray-500
            focus:ring-2 focus:ring-[#E5A910] focus:border-[#E5A910] text-sm py-2.5 transition-all
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${error ? 'border-danger focus:ring-danger focus:border-danger' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
