import React, { useState } from 'react';
import Display from './Display';
import Button from './Button';
import './Calculator.css';

const Calculator = ({ onCalculate, isLoading }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [error, setError] = useState('');

  const inputNumber = (num) => {
    if (error) setError('');
    
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (error) setError('');
    
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
    setError('');
  };

  const performOperation = async (nextOperation) => {
    const inputValue = parseFloat(display);

    if (error) setError('');

    try {
      if (nextOperation === 'sqrt') {
        const result = await onCalculate('sqrt', inputValue);
        setDisplay(String(result));
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(true);
        return;
      }

      if (previousValue === null) {
        setPreviousValue(inputValue);
      } else if (operation) {
        const currentValue = previousValue || 0;
        let apiOperation = operation;
        
        // Map display operations to API operations
        const operationMap = {
          '÷': 'divide',
          '×': 'multiply',
          '-': 'subtract',
          '+': 'add',
          '^': 'power',
          '%': 'percentage'
        };
        
        apiOperation = operationMap[operation] || operation;
        
        const result = await onCalculate(apiOperation, currentValue, inputValue);
        setDisplay(String(result));
        setPreviousValue(result);
      }

      setWaitingForNewValue(true);
      setOperation(nextOperation);
    } catch (err) {
      setError(err.response?.data?.error || 'Calculation error');
      setDisplay('Error');
      setPreviousValue(null);
      setOperation(null);
    }
  };

  const calculate = () => {
    performOperation(null);
  };

  return (
    <div className="calculator">
      <Display value={display} error={error} isLoading={isLoading} />
      
      <div className="button-grid">
        <Button onClick={clear} className="btn-clear" disabled={isLoading}>C</Button>
        <Button onClick={() => performOperation('sqrt')} className="btn-operation" disabled={isLoading}>√</Button>
        <Button onClick={() => performOperation('%')} className="btn-operation" disabled={isLoading}>%</Button>
        <Button onClick={() => performOperation('÷')} className="btn-operation" disabled={isLoading}>÷</Button>

        <Button onClick={() => inputNumber(7)} disabled={isLoading}>7</Button>
        <Button onClick={() => inputNumber(8)} disabled={isLoading}>8</Button>
        <Button onClick={() => inputNumber(9)} disabled={isLoading}>9</Button>
        <Button onClick={() => performOperation('×')} className="btn-operation" disabled={isLoading}>×</Button>

        <Button onClick={() => inputNumber(4)} disabled={isLoading}>4</Button>
        <Button onClick={() => inputNumber(5)} disabled={isLoading}>5</Button>
        <Button onClick={() => inputNumber(6)} disabled={isLoading}>6</Button>
        <Button onClick={() => performOperation('-')} className="btn-operation" disabled={isLoading}>-</Button>

        <Button onClick={() => inputNumber(1)} disabled={isLoading}>1</Button>
        <Button onClick={() => inputNumber(2)} disabled={isLoading}>2</Button>
        <Button onClick={() => inputNumber(3)} disabled={isLoading}>3</Button>
        <Button onClick={() => performOperation('+')} className="btn-operation" disabled={isLoading}>+</Button>

        <Button onClick={() => inputNumber(0)} className="btn-zero" disabled={isLoading}>0</Button>
        <Button onClick={inputDecimal} disabled={isLoading}>.</Button>
        <Button onClick={calculate} className="btn-equals" disabled={isLoading}>=</Button>
      </div>
    </div>
  );
};

export default Calculator;