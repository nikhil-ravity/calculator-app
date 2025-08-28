import React from 'react';
import './Display.css';

const Display = ({ value, error, isLoading }) => {
  return (
    <div className="display">
      {isLoading && <div className="loading-indicator">Calculating...</div>}
      <div className={`display-value ${error ? 'error' : ''}`}>
        {error || value}
      </div>
    </div>
  );
};

export default Display;