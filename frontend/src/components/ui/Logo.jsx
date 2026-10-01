import React from 'react';
import logoImg from '../../assets/formclub-logo.png';

const Logo = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoImg} 
        alt="FORMCLUB" 
        className="h-full w-auto object-contain"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
};

export default Logo;
