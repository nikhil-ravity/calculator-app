const validateCalculation = (req, res, next) => {
  const { operation, operand1, operand2 } = req.body;
  
  // Check if operation is provided
  if (!operation) {
    return res.status(400).json({
      success: false,
      error: 'Operation is required'
    });
  }
  
  // Check if operation is valid
  const validOperations = ['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt', 'percentage'];
  if (!validOperations.includes(operation)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid operation'
    });
  }
  
  // Check operand1
  if (typeof operand1 !== 'number' || isNaN(operand1)) {
    return res.status(400).json({
      success: false,
      error: 'First operand must be a valid number'
    });
  }
  
  // Check operand2 for operations that require it
  if (operation !== 'sqrt' && (typeof operand2 !== 'number' || isNaN(operand2))) {
    return res.status(400).json({
      success: false,
      error: 'Second operand must be a valid number'
    });
  }
  
  next();
};

module.exports = { validateCalculation };