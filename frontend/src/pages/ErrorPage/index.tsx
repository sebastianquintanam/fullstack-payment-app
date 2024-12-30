import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { XCircle } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

    const error = useSelector((state: RootState) => state.transactions.error);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error en el Pago</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600 bg-red-50 p-4 rounded-lg">
            {error || 'Hubo un problema procesando tu pago. Por favor, inténtalo nuevamente.'}
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

            {/* Opción para contacto de soporte */}
            <p className="text-sm text-gray-500 mt-4">
              Si el problema persiste, contáctanos en{' '}
              <a href="mailto:soporte@miapp.com" className="text-blue-600 hover:underline">
                soporte@miapp.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
