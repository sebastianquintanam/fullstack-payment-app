// src/pages/PaymentPage/index.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { wompiService } from '../../services/wompiService';
import type { Product, PaymentFormData } from '../../types';
import { PaymentSummary } from '../../components/payment/PaymentSummary';
import { 
  setTransactionPending,
  setTransactionComplete,
  setTransactionFailed 
} from '../../store/slices/transactionSlice';

const PaymentPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Obtener el producto del estado global
  const product = useAppSelector(state => 
    state.products.items.find(p => p.id === Number(productId))
  );

  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Si no hay producto, redirigir a la página principal
  useEffect(() => {
    if (!productId || !product) {
      navigate('/');
    }
  }, [productId, product, navigate]);

  const handlePayment = async () => {
    if (!product) return;

    try {
      const response = await wompiService.createTransaction({
        amount: product.price,
        cardToken: formData.cardNumber,
        reference: `payment-${Date.now()}`
      });

      dispatch(setTransactionPending({
        id: response.id,
        amount: product.price,
        productId: product.id,
        reference: response.reference
      }));

      if (response.status === 'APPROVED') {
        dispatch(setTransactionComplete());
        navigate('/success');
      } else {
        throw new Error('Payment declined');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en el pago';
      dispatch(setTransactionFailed(errorMessage));
      setError(errorMessage);
    }
  };

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="text-center p-8">Producto no encontrado</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      {/* ... resto del JSX ... */}
    </div>
  );
};

export default PaymentPage;