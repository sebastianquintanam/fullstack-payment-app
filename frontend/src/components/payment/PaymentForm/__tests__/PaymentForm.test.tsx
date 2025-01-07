// src/components/payment/PaymentForm/__tests__/PaymentForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { PaymentForm } from '../../PaymentForm';
import productSlice from '../../../../store/slices/productSlice';
import transactionSlice from '../../../../store/slices/transactionSlice';

const renderWithProviders = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      products: productSlice,
      transactions: transactionSlice
    }
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('PaymentForm', () => {
  const mockProps = {
    onPaymentComplete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders payment form fields', () => {
    renderWithProviders(<PaymentForm {...mockProps} />);
    
    expect(screen.getByPlaceholderText(/número de tarjeta/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mm/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/yyyy/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/cvv/i)).toBeInTheDocument();
  });

  it('validates card number format', async () => {
    renderWithProviders(<PaymentForm {...mockProps} />);
    
    const cardInput = screen.getByPlaceholderText(/número de tarjeta/i);
    fireEvent.change(cardInput, { target: { value: '4111111111111111' } });
    
    await waitFor(() => {
      expect(screen.queryByText(/número de tarjeta inválido/i)).not.toBeInTheDocument();
    });
  });

  it('shows error for invalid card number', async () => {
    renderWithProviders(<PaymentForm {...mockProps} />);
    
    const cardInput = screen.getByPlaceholderText(/número de tarjeta/i);
    fireEvent.change(cardInput, { target: { value: '1234' } });
    
    await waitFor(() => {
      expect(screen.getByText(/número de tarjeta inválido/i)).toBeInTheDocument();
    });
  });
});