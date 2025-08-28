const express = require('express');
const router = express.Router();
const { validateCalculation } = require('../middleware/validation');

// Basic arithmetic operations
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error('Division by zero is not allowed');
    return a / b;
  },
  power: (a, b) => Math.pow(a, b),
  sqrt: (a) => {
    if (a < 0) throw new Error('Square root of negative number is not allowed');
    return Math.sqrt(a);
  },
  percentage: (a, b) => (a * b) / 100
};

// POST /api/calculator/calculate
router.post('/calculate', validateCalculation, (req, res) => {
  try {
    const { operation, operand1, operand2 } = req.body;
    
    let result;
    if (operation === 'sqrt') {
      result = operations[operation](operand1);
    } else {
      result = operations[operation](operand1, operand2);
    }
    
    // Handle floating point precision
    if (typeof result === 'number' && !Number.isInteger(result)) {
      result = Math.round(result * 1000000000) / 1000000000;
    }
    
    res.json({
      success: true,
      result,
      operation,
      operands: operation === 'sqrt' ? [operand1] : [operand1, operand2]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/calculator/operations
router.get('/operations', (req, res) => {
  res.json({
    operations: Object.keys(operations),
    descriptions: {
      add: 'Addition',
      subtract: 'Subtraction',
      multiply: 'Multiplication',
      divide: 'Division',
      power: 'Power',
      sqrt: 'Square Root',
      percentage: 'Percentage'
    }
  });
});

module.exports = router;