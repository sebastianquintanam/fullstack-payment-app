// /frontend/src/pages/StatusPage/index.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import wompiService from '../../services/wompiService';

export const StatusPage: React.FC = () => {
  const navigate = useNavigate();
  const transaction = useSelector((state: RootState) => state.transactions.currentTransaction);
  const [status, setStatus] = useState<string>('PENDING');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTransactionStatus = async () => {
      if (!transaction?.id) {
        navigate('/');
        return;
      }

      try {
        const response = await wompiService.getPaymentStatus(transaction.id, transaction.productId);
        setStatus(response.status);

        if (response.status === 'APPROVED') {
          navigate('/success');
        } else if (response.status === 'DECLINED' || response.status === 'ERROR') {
          navigate('/error');
        }
      } catch (error) {
        console.error('Error checking status:', error);
        navigate('/error');
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(checkTransactionStatus, 5000);
    return () => clearInterval(interval);
  }, [transaction, navigate]);

  const getStatusMessage = () => {
    switch (status) {
      case 'PENDING':
        return 'Procesando tu pago...';
      case 'APPROVED':
        return '¡Pago aprobado!';
      case 'DECLINED':
        return 'Pago rechazado';
      default:
        return 'Verificando estado del pago...';
    }
  };

  if (!transaction) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-4">
          {isLoading && <Loader2 className="w-16 h-16 text-blue-500 mx-auto animate-spin" />}
          <h1 className="text-2xl font-bold text-gray-900">{getStatusMessage()}</h1>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Información de la transacción:</h2>
            <div className="space-y-2 text-sm">
              <p>Referencia: {transaction.reference}</p>
              <p>Monto: ${transaction.amount.toFixed(2)}</p>
              <p>Estado: {status}</p>
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm">
            Por favor, no cierres esta ventana mientras verificamos tu pago.
          </p>
        </div>
      </Card>
    </div>
  );
};