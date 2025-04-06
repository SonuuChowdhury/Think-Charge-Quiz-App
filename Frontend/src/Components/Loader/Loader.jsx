import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div onClick={(e)=>e.stopPropagation()} className="loader-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;