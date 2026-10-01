import React from 'react';

const Logo = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Wrapper */}
      <div className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 bg-white rounded-md overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-10 h-10 text-black fill-current translate-x-1"
        >
          {/* Particles (Dispersion Effect) */}
          <g className="opacity-80">
            <circle cx="90" cy="220" r="3" />
            <circle cx="80" cy="240" r="2" />
            <circle cx="110" cy="260" r="4" />
            <circle cx="70" cy="270" r="2.5" />
            <circle cx="100" cy="290" r="3.5" />
            <circle cx="85" cy="310" r="2" />
            <circle cx="120" cy="330" r="3" />
            <circle cx="95" cy="350" r="4" />
            <circle cx="105" cy="380" r="2.5" />
            <circle cx="130" cy="400" r="3" />
            <circle cx="115" cy="420" r="2" />
            
            <circle cx="50" cy="260" r="1.5" />
            <circle cx="60" cy="300" r="2" />
            <circle cx="45" cy="340" r="1" />
            <circle cx="65" cy="390" r="2" />
          </g>
          {/* Runner Path */}
          <path d="M296 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM157.9 196.2l-36.2-18.1-14.6 29.2c-10.7 21.4-36.6 30-58 19.3S19 189.9 29.7 168.6l23.5-47c13.7-27.4 44.5-39.7 73-28.7l67 25.9 45.3-45.3c15-15 37.9-19.5 57.6-11.6l81.6 32.6c24.6 9.8 36.5 37.7 26.7 62.3s-37.7 36.5-62.3 26.7l-59.5-23.8-30.1 30.1 19.8 39.5 58.7 19.6c26 8.7 40.1 36.8 31.4 62.9s-36.8 40.1-62.9 31.4l-86.4-28.8c-15.6-5.2-27.1-17.7-31-33.8l-18.4-76.3-46.7-18.1-15.4 30.8zM245.9 344l-11.5 51.5c-5.8 26.2-31.6 42.8-57.8 36.9s-42.8-31.6-36.9-57.8l16.1-72.2 42.1-84.1 30.1 30.1-13 77.8 30.9 17.8z" />
        </svg>
      </div>

      {/* Text Wrapper */}
      <div className="flex flex-col justify-center">
        <span className="text-white text-3xl font-black tracking-tighter leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>
          FORMCLUB
        </span>
        <span className="text-[#c1a075] text-[0.65rem] font-medium italic tracking-wider leading-tight mt-0.5">
          Human Performance Center
        </span>
      </div>
    </div>
  );
};

export default Logo;
