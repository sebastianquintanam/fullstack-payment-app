import React from 'react';

interface PaymentSummaryProps {
  amount: number;
  baseFee: number;
  deliveryFee: number;
  onConfirm: () => Promise<void>;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Product Amount:</span>
            <span>${amount}</span>
          </div>
          <div className="flex justify-between">
            <span>Base Fee:</span>
            <span>${baseFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>${deliveryFee}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};