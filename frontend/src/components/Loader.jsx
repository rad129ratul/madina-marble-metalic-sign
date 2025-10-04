import React from 'react';
import logo from '../assets/logo.png';
import '../assets/styles/Loader.css';

const Loader = ({ size = 'medium' }) => {
  return (
    <div className="digami-spinner-container">
      <div className="digami-spinner">
        <img 
          src={logo} 
          alt="Loading..." 
          className="digami-spinner-logo"
        />
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
    </div>
  );
};

export default Loader;