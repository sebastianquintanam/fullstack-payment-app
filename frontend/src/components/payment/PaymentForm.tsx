// src/components/payment/PaymentForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { cardValidations } from '../../utils/cardValidations';
import { PaymentSummary } from './PaymentSummary';
import { Alert } from '@/components/ui/alert';
import { wompiService } from '../../services/wompiService';

interface PaymentFormProps {
  productId: string;
  amount: number;
  onPaymentComplete: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  productId, 
  amount, 
  onPaymentComplete 
}) => {
  const dispatch = useDispatch();
  const [showSummary, setShowSummary] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Maneja los cambios en el número de tarjeta, aplicando formato
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));

    // Validación en tiempo real del tipo de tarjeta
    const cardType = cardValidations.getCardType(value);
    // TODO: Mostrar logo según el tipo de tarjeta
  };

  // Valida todos los campos del formulario
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Procesa el pago completo
  const handlePaymentProcess = async () => {
    try {
      setIsProcessing(true);

      // 1. Tokenizar la tarjeta
      const cardToken = await wompiService.getTokenizedCard({
        number: formData.cardNumber.replace(/\s/g, ''),
        exp_month: formData.expiryMonth,
        exp_year: formData.expiryYear,
        cvc: formData.cvv
      });

      // 2. Crear la transacción con la tarjeta tokenizada
      const transaction = await wompiService.createTransaction({
        amount,
        cardToken,
        reference: `payment-${Date.now()}-${productId}`
      });

      // 3. Verificar resultado y notificar
      if (transaction.status === 'APPROVED') {
        onPaymentComplete();
      } else {
        throw new Error('Pago rechazado');
      }

    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Error procesando el pago'
      });
    } finally {
      setIsProcessing(false);
      setShowSummary(false);
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowSummary(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de Número de Tarjeta */}
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

        {/* Campo de Titular */}
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
        </div>

        {/* Campos de Fecha y CVV */}
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
                  expiryMonth: e.target.value
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
                  expiryYear: e.target.value
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
                cvv: e.target.value
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

        {errors.submit && (
          <Alert variant="destructive">{errors.submit}</Alert>
        )}

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={isProcessing}
        >
          {isProcessing ? 'Procesando...' : 'Continuar al pago'}
        </button>
      </form>

      {showSummary && (
        <PaymentSummary
          amount={amount}
          baseFee={5.00}
          deliveryFee={10.00}
          onConfirm={handlePaymentProcess}
          onCancel={() => setShowSummary(false)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};