// src/components/payment/PaymentForm.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import wompiService from '../../services/wompiService';
import { PaymentSummary } from './PaymentSummary';
import { Alert } from '../../components/ui/alert';
import { cardValidations } from '../../utils/cardValidations';
import { updateStock } from '../../store/slices/productSlice';
import { setTransactionComplete, setTransactionFailed } from '../../store/slices/transactionSlice';
import type { AppDispatch } from '../../store/store';
import type { RootState } from '../../store';
import type { WompiPaymentRequest } from '../../store/types';

interface PaymentFormProps {
  onPaymentComplete: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentComplete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedProduct = useSelector((state: RootState) => state.products.selectedProduct);

  // Estado del formulario y tipo de tarjeta
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [cardType, setCardType] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;

    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));

    const detectedType = cardValidations.getCardType(value);
    setCardType(detectedType); // Actualiza el tipo de tarjeta detectado
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');

    if (!cardValidations.validateCardNumber(cleanCardNumber)) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    if (!cardValidations.validateExpiry(formData.expiryMonth, formData.expiryYear)) {
      newErrors.expiry = 'Fecha de expiración inválida';
    }

    if (!cardValidations.validateCVV(formData.cvv)) {
      newErrors.cvv = 'CVV inválido';
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'El nombre del titular es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!selectedProduct) return;

    setIsProcessing(true);
    setError(null);

    try {
      const paymentData: WompiPaymentRequest = {
        amount: selectedProduct.price * 100,
        currency: 'COP',
        payment_method: {
          type: 'CARD',
          token: 'token_test' // Esto debería venir del formulario de tarjeta
        },
        reference: `order_${Date.now()}`
      };

      const response = await wompiService.createPayment(paymentData);

      if (response.status === 'APPROVED') {
        dispatch(updateStock({
          productId: selectedProduct.id,
          quantity: 1
        }));

        dispatch(setTransactionComplete({
          id: response.id,
          reference: response.reference,
          amount: selectedProduct.price,
          productId: selectedProduct.id
        }));

        onPaymentComplete();
        navigate('/success');
      } else {
        throw new Error('Pago rechazado por la pasarela de pagos');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error procesando el pago';
      dispatch(setTransactionFailed(errorMessage));
      setError(errorMessage);
      navigate('/error');
    } finally {
      setIsProcessing(false);
      setShowSummary(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSummary(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {cardType && <div className="card-type-indicator">Tipo de tarjeta: {cardType}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Número de Tarjeta
          </label>
          <input
            type="text"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="xxxx xxxx xxxx xxxx"
            disabled={isProcessing}
          />
          {errors.cardNumber && (
            <Alert variant="destructive">{errors.cardNumber}</Alert>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Titular de la Tarjeta
          </label>
          <input
            type="text"
            value={formData.cardHolder}
            onChange={e => setFormData(prev => ({
              ...prev,
              cardHolder: e.target.value
            }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Como aparece en la tarjeta"
            disabled={isProcessing}
          />
          {errors.cardHolder && (
            <Alert variant="destructive">{errors.cardHolder}</Alert>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Fecha de Vencimiento
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={formData.expiryMonth}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  expiryMonth: e.target.value.replace(/\D/g, '')
                }))}
                maxLength={2}
                className="w-full p-2 border rounded"
                placeholder="MM"
                disabled={isProcessing}
              />
              <input
                type="text"
                value={formData.expiryYear}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  expiryYear: e.target.value.replace(/\D/g, '')
                }))}
                maxLength={2}
                className="w-full p-2 border rounded"
                placeholder="YY"
                disabled={isProcessing}
              />
            </div>
            {errors.expiry && (
              <Alert variant="destructive">{errors.expiry}</Alert>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">CVV</label>
            <input
              type="password"
              value={formData.cvv}
              onChange={e => setFormData(prev => ({
                ...prev,
                cvv: e.target.value.replace(/\D/g, '')
              }))}
              maxLength={4}
              className="w-full p-2 border rounded"
              placeholder="***"
              disabled={isProcessing}
            />
            {errors.cvv && (
              <Alert variant="destructive">{errors.cvv}</Alert>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">{error}</Alert>
        )}

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isProcessing}
        >
          {isProcessing ? 'Procesando...' : 'Continuar al pago'}
        </button>
      </form>

      {showSummary && (
        <PaymentSummary
          amount={selectedProduct?.price || 0}
          baseFee={5.00}
          deliveryFee={10.00}
          onConfirm={handlePayment}
          onCancel={() => setShowSummary(false)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default PaymentForm;
