import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Calculator from './Calculator';

// Mock the API service
jest.mock('../services/api', () => ({
  calculateAPI: jest.fn()
}));

import { calculateAPI } from '../services/api';

describe('Calculator Component', () => {
  const mockOnCalculate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnCalculate.mockResolvedValue(0);
  });

  test('renders calculator with all buttons', () => {
    render(<Calculator onCalculate={mockOnCalculate} isLoading={false} />);
    
    // Check if all number buttons are present
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
    
    // Check operation buttons
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByText('÷')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('√')).toBeInTheDocument();
  });

  test('displays numbers when clicked', () => {
    render(<Calculator onCalculate={mockOnCalculate} isLoading={false} />);
    
    fireEvent.click(screen.getByText('5'));
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('3'));
    expect(screen.getByDisplayValue('53')).toBeInTheDocument();
  });

  test('clears display when C button is clicked', () => {
    render(<Calculator onCalculate={mockOnCalculate} isLoading={false} />);
    
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('3'));
    expect(screen.getByDisplayValue('53')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('C'));
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });

  test('handles decimal input', () => {
    render(<Calculator onCalculate={mockOnCalculate} isLoading={false} />);
    
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('.'));
    fireEvent.click(screen.getByText('5'));
    
    expect(screen.getByDisplayValue('5.5')).toBeInTheDocument();
  });

  test('performs calculation when equals is clicked', async () => {
    mockOnCalculate.mockResolvedValue(8);
    
    render(<Calculator onCalculate={mockOnCalculate} isLoading={false} />);
    
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    
    await waitFor(() => {
      expect(mockOnCalculate).toHaveBeenCalledWith('add', 5, 3);
    });
  });

  test('handles loading state', () => {
    render(<Calculator onCalculate={mockOnCalculate} isLoading={true} />);
    
    // All buttons should be disabled during loading
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
    
    expect(screen.getByText('Calculating...')).toBeInTheDocument();
  });
});