import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store/store';
import { XCircle } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';

export const ErrorPage: React.FC = () => {
  const error = useSelector((state: RootState) => state.transactions?.error || 'Error desconocido');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Error en el Pago</h1>
        </div>

        <Alert variant="destructive">
          <AlertTitle>Lo sentimos, ha ocurrido un error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Por favor, intenta nuevamente o contacta con soporte si el problema persiste.
          </p>

          <div className="flex gap-4">
            <Link
              to="/"
              className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Volver a la tienda
            </Link>
            <Link
              to="/payment"
              className="flex-1 text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Intentar nuevamente
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ErrorPage;
