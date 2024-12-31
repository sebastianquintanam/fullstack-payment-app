// /frontend/src/pages/SuccessPage/index.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store/store';
import { CheckCircle } from 'lucide-react';
import { Card } from "../../components/ui/card";

export const SuccessPage: React.FC = () => {
  const transaction = useSelector((state: RootState) => state.transactions.currentTransaction);
  const product = useSelector((state: RootState) => state.products.selectedProduct);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">¡Pago Exitoso!</h1>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Detalles de la transacción:</h2>
            <div className="space-y-2 text-sm">
              <p>Referencia: {transaction?.reference}</p>
              <p>Monto: ${transaction?.amount.toFixed(2)}</p>
              <p>Producto: {product?.name}</p>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Hemos enviado un correo con los detalles de tu compra.
            </p>
            <Link
              to="/"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};