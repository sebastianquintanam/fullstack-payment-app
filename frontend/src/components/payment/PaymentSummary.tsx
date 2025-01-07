// /frontend/src/components/payment/PaymentSummary.tsx
import React from 'react';
import { Alert } from '../../components/ui/alert/alert';

interface PaymentSummaryProps {
  amount: number;
  baseFee: number;
  deliveryFee: number;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  amount,
  baseFee,
  deliveryFee,
  onConfirm,
  onCancel,
  isProcessing
}) => {
  const total = amount + baseFee + deliveryFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Resumen del Pago</h2>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tarifa base:</span>
              <span>${baseFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Envío:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total a pagar:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Alert className="mb-4">
            Al confirmar, se procesará el pago por ${total.toFixed(2)}
          </Alert>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};