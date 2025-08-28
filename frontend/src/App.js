import React, { useState, useEffect } from 'react';
import './App.css';
import Calculator from './components/Calculator';
import History from './components/History';
import { calculateAPI } from './services/api';

function App() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  const handleCalculation = async (operation, operand1, operand2) => {
    setIsLoading(true);
    try {
      const response = await calculateAPI(operation, operand1, operand2);
      
      const historyItem = {
        id: Date.now(),
        operation,
        operand1,
        operand2: operation === 'sqrt' ? null : operand2,
        result: response.result,
        timestamp: new Date().toLocaleString()
      };
      
      setHistory(prev => [historyItem, ...prev].slice(0, 50)); // Keep only last 50 calculations
      setIsLoading(false);
      return response.result;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Calculator</h1>
      </header>
      <main className="App-main">
        <div className="calculator-container">
          <Calculator 
            onCalculate={handleCalculation} 
            isLoading={isLoading}
          />
          <History 
            history={history} 
            onClear={clearHistory}
          />
        </div>
      </main>
    </div>
  );
}

export default App;