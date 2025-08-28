# Calculator Application

A modern calculator application built with React frontend and Node.js backend.

## Features

- Basic arithmetic operations (addition, subtraction, multiplication, division)
- Advanced operations (power, square root, percentage)
- Calculation history
- Responsive design
- Error handling
- API-based calculations

## Project Structure

calculator-app/
├── backend/          # Node.js Express API
├── frontend/         # React application
└── README.md

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

cd backend
npm install
npm run dev

### Frontend Setup

cd frontend
npm install
npm start

The backend will run on http://localhost:5000 and the frontend on http://localhost:3000.
API Endpoints

POST /api/calculator/calculate - Perform calculations
GET /api/calculator/operations - Get available operations
GET /api/health - Health check

Technologies Used
Backend

Node.js
Express.js
CORS
Helmet (security)
dotenv

Frontend

React 18
Axios (HTTP client)
CSS3 with modern features

Development
Running Tests
bash# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
Building for Production
bash# Frontend
cd frontend
npm run build
Contributing

Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request

License
MIT License

### package.json (Root)
{
  "name": "calculator-app",
  "version": "1.0.0",
  "description": "A modern calculator application with React frontend and Node