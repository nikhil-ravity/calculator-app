import React from 'react';
import './History.css';

const History = ({ history, onClear }) => {
  const formatOperation = (item) => {
    const operationSymbols = {
      add: '+',
      subtract: '-',
      multiply: '×',
      divide: '÷',
      power: '^',
      sqrt: '√',
      percentage: '%'
    };

    if (item.operation === 'sqrt') {
      return `√${item.operand1} = ${item.result}`;
    }

    return `${item.operand1} ${operationSymbols[item.operation]} ${item.operand2} = ${item.result}`;
  };

  return (
    <div className="history">
      <div className="history-header">
        <h3>History</h3>
        {history.length > 0 && (
          <button onClick={onClear} className="clear-history-btn">
            Clear
          </button>
        )}
      </div>
      
      <div className="history-list">
        {history.length === 0 ? (
          <p className="no-history">No calculations yet</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="calculation">{formatOperation(item)}</div>
              <div className="timestamp">{item.timestamp}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;