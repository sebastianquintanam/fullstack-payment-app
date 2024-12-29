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
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  amount,
  baseFee,
  deliveryFee,
  onConfirm,
  onCancel,
}) => {
  const total = amount + baseFee + deliveryFee;

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resumen de Pago</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Producto:</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Cargo base:</span>
            <span>${baseFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Envío:</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onConfirm}
              className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Pagar ${total.toFixed(2)}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};