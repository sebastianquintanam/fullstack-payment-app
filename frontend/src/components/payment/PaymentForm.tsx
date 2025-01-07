import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import wompiService from '../../services/wompiService';
import { PaymentSummary } from './PaymentSummary';
import { Alert } from '../../components/ui/alert/alert';
import { cardValidations } from '../../utils/cardValidations';
import { updateStock } from '../../store/slices/productSlice';
import { setTransactionComplete, setTransactionFailed } from '../../store/slices/transactionSlice';
import type { AppDispatch, RootState } from '../../store/store';
import type { WompiPaymentRequest } from '../../store/types';

interface PaymentFormProps {
  onPaymentComplete: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentComplete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const selectedProduct = useSelector((state: RootState) => state.products.selectedProduct);

  // Estados del formulario
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'unknown'>('unknown');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');

  // Manejadores de cambios en el formulario
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = cardValidations.formatCardNumber(value);

    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));

    const detectedType = cardValidations.getCardType(value);
    setCardType(detectedType);

    // Limpiar error si existe
    if (errors.cardNumber) {
      setErrors(prev => {
        const { ...rest } = prev;
        return rest;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    switch (name) {
      case 'cardHolder':
        processedValue = value.toUpperCase();
        break;
      case 'expiryMonth':
        processedValue = value.replace(/\D/g, '').slice(0, 2);
        break;
      case 'expiryYear':
        processedValue = value.replace(/\D/g, '').slice(0, 2);
        break;
      case 'cvv':
        processedValue = value.replace(/\D/g, '').slice(0, 4);
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Limpiar error del campo específico
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const validation = cardValidations.validateCardData({
      number: formData.cardNumber.replace(/\s/g, ''),
      card_holder: formData.cardHolder,
      exp_month: formData.expiryMonth,
      exp_year: formData.expiryYear,
      cvc: formData.cvv
    });

    setErrors(validation.errors);
    return validation.isValid;
  };

  // Lógica de pago
  const tokenizeCardData = async () => {
    setProcessingStep('Procesando tarjeta...');
    return wompiService.tokenizeCard({
      number: formData.cardNumber.replace(/\s/g, ''),
      cvc: formData.cvv,
      exp_month: formData.expiryMonth,
      exp_year: formData.expiryYear,
      card_holder: formData.cardHolder,
    });
  };

  const handlePayment = async () => {
    if (!selectedProduct) {
      setError('No se ha seleccionado ningún producto');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cardToken = await tokenizeCardData();
      setProcessingStep('Procesando pago...');

      const paymentData: WompiPaymentRequest = {
        amount: selectedProduct.price * 100,
        currency: 'COP',
        payment_method: {
          type: 'CARD',
          token: cardToken,
        },
        reference: `order_${Date.now()}`,
      };

      const response = await wompiService.createPayment(paymentData);

      if (response.status === 'APPROVED') {
        dispatch(updateStock({
          productId: Number(selectedProduct.id),
          newStock: selectedProduct.stock - 1,
        }));
      
        dispatch(setTransactionComplete({
          id: response.id,
          reference: response.reference,
          amount: response.amount / 100,
          productId: Number(selectedProduct.id),
          status: 'COMPLETED',
        }));
      
        setProcessingStep('¡Pago completado!');
        onPaymentComplete();
        navigate('/success');
      } else {
        throw new Error(`Pago ${response.status.toLowerCase()}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error procesando el pago';
      dispatch(setTransactionFailed({ 
        id: Date.now().toString(), 
        status: 'FAILED', 
        error: errorMessage 
      }));
      setError(errorMessage);
      navigate('/error');
    } finally {
      setIsProcessing(false);
      setShowSummary(false);
      setProcessingStep('');
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
      {/* Logo del tipo de tarjeta */}
      <div className="flex justify-end h-8 mb-4">
        {cardType !== 'unknown' && (
          <img 
            src={`/images/${cardType}.svg`} 
            alt={`${cardType} logo`}
            className="h-full object-contain"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Número de tarjeta */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Número de Tarjeta</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0000 0000 0000 0000"
            disabled={isProcessing}
          />
          {errors.cardNumber && <Alert variant="destructive">{errors.cardNumber}</Alert>}
        </div>

        {/* Titular de la tarjeta */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Titular de la Tarjeta</label>
          <input
            type="text"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
              errors.cardHolder ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="NOMBRE COMO APARECE EN LA TARJETA"
            disabled={isProcessing}
          />
          {errors.cardHolder && <Alert variant="destructive">{errors.cardHolder}</Alert>}
        </div>

        {/* Fecha de vencimiento y CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Fecha de Vencimiento</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleInputChange}
                maxLength={2}
                className={`w-full p-2 border rounded ${
                  errors.expiry ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MM"
                disabled={isProcessing}
              />
              <input
                type="text"
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleInputChange}
                maxLength={2}
                className={`w-full p-2 border rounded ${
                  errors.expiry ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="AA"
                disabled={isProcessing}
              />
            </div>
            {errors.expiry && <Alert variant="destructive">{errors.expiry}</Alert>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">CVV</label>
            <input
              type="password"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              maxLength={4}
              className={`w-full p-2 border rounded ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="***"
              disabled={isProcessing}
            />
            {errors.cvv && <Alert variant="destructive">{errors.cvv}</Alert>}
          </div>
        </div>

        {error && <Alert variant="destructive">{error}</Alert>}

        {processingStep && (
          <div className="text-sm text-gray-600 text-center">{processingStep}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={isProcessing}
        >
          {isProcessing ? 'Procesando...' : 'Continuar al pago'}
        </button>
      </form>

      {showSummary && (
        <PaymentSummary
          amount={selectedProduct?.price || 0}
          baseFee={5.0}
          deliveryFee={10.0}
          onConfirm={handlePayment}
          onCancel={() => setShowSummary(false)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default PaymentForm;