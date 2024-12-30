// src/pages/SuccessPage/index.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { CheckCircle2 } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const transaction = useAppSelector(state => state.transaction.currentTransaction);

  // Redirigir si no hay transacción
  useEffect(() => {
    if (!transaction) {
      navigate('/');
    }
  }, [transaction, navigate]);

  if (!transaction) {
    return null; // Si no hay transacción, no renderiza nada (protección adicional)
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ¡Pago Exitoso!
        </h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Tu transacción se ha completado correctamente
          </p>
          
          {/* Detalles de la transacción */}
          <div className="bg-gray-50 p-4 rounded text-left">
            <p className="text-sm text-gray-500">Referencia de pago:</p>
            <p className="font-mono text-gray-800">{transaction.reference}</p>
            <p className="text-sm text-gray-500 mt-2">Monto:</p>
            <p className="font-bold text-gray-800">${transaction.amount.toFixed(2)}</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
