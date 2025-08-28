import React from 'react';
import './Button.css';

const Button = ({ onClick, className = '', children, disabled = false }) => {
  return (
    <button
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;