import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const calculateAPI = async (operation, operand1, operand2) => {
  try {
    const response = await api.post('/calculator/calculate', {
      operation,
      operand1,
      operand2
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOperations = async () => {
  try {
    const response = await api.get('/calculator/operations');
    return response.data;
  } catch (error) {
    throw error;
  }
};