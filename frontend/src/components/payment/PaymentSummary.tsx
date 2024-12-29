// src/components/payment/PaymentSummary.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PaymentSummaryProps {
  amount: number;
  baseFee: number;
  deliveryFee: number;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  amount,
  baseFee,
  deliveryFee,
  onConfirm,
  onCancel,
  isProcessing = false
}) => {
  // Calculamos el total sumando el monto, cargo base y envío
  const total = amount + baseFee + deliveryFee;

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resumen de Pago</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Detalles del producto */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Producto:</span>
            <span className="text-lg">${amount.toFixed(2)}</span>
          </div>

          {/* Cargos adicionales */}
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between items-center">
              <span>Cargo base:</span>
              <span>${baseFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Envío:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-lg font-bold">Total a pagar:</span>
            <span className="text-xl font-bold text-blue-600">
              ${total.toFixed(2)}
            </span>
          </div>
          
          {/* Botones de acción */}
          <div className="flex space-x-4 pt-6">
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                `Pagar $${total.toFixed(2)}`
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 
                       disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
          </div>

          {/* Nota informativa */}
          <p className="text-sm text-gray-500 text-center mt-4">
            Al confirmar el pago, aceptas procesar la transacción por el monto total 
            indicado incluyendo los cargos adicionales.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};