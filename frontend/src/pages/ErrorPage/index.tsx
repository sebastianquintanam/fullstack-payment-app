// src/pages/ErrorPage/index.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { XCircle } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useAppSelector(state => state.transaction.error);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error en el Pago
        </h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            {error || 'Hubo un problema procesando tu pago'}
          </p>

          <div className="space-y-2">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Intentar nuevamente
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="block w-full text-gray-600 hover:text-gray-800"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;