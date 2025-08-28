const request = require('supertest');
const app = require('../server');

describe('Calculator API', () => {
  describe('POST /api/calculator/calculate', () => {
    test('should perform addition correctly', async () => {
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send({
          operation: 'add',
          operand1: 5,
          operand2: 3
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe(8);
    });

    test('should perform subtraction correctly', async () => {
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send({
          operation: 'subtract',
          operand1: 10,
          operand2: 4
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(6);
    });

    test('should perform multiplication correctly', async () => {
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send({
          operation: 'multiply',
          operand1: 6,
          operand2: 7
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(42);
    });

    test('should perform division correctly', async () => {
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send({
          operation: 'divide',
          operand1: 15,
          operand2: 3
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(5);
    });

    test('should handle division by zero', async () => {
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send({
          operation: 'divide',
          operand1: 10,
          operand2: 0
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Division by zero');
    });

    test('should perform square root correctly', async () => {
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send({
          operation: 'sqrt',
          operand1: 16
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(4);
    });

    test('should handle invalid operation', async () => {
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send({
          operation: 'invalid',
          operand1: 5,
          operand2: 3
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid operation');
    });

    test('should validate required operands', async () => {
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send({
          operation: 'add'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('must be a valid number');
    });
  });

  describe('GET /api/calculator/operations', () => {
    test('should return available operations', async () => {
      const response = await request(app)
        .get('/api/calculator/operations');

      expect(response.status).toBe(200);
      expect(response.body.operations).toContain('add');
      expect(response.body.operations).toContain('subtract');
      expect(response.body.operations).toContain('multiply');
      expect(response.body.operations).toContain('divide');
    });
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });
});