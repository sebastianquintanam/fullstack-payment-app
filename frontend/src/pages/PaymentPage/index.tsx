// src/pages/PaymentPage/index.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PaymentForm } from '../../components/payment/PaymentForm';
import type { RootState } from '../../store';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedProduct = useSelector((state: RootState) => state.products.selectedProduct);

  if (!selectedProduct) {
    navigate('/products');
    return null;
  }

  const handlePaymentComplete = () => {
    navigate('/success');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        <p>Product: {selectedProduct.name}</p>
        <p>Price: ${selectedProduct.price}</p>
      </div>

      <PaymentForm onPaymentComplete={handlePaymentComplete} />
    </div>
  );
};

export default PaymentPage;