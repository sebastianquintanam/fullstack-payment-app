// src/pages/PaymentPage/index.tsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import InputMask from 'react-input-mask';

// Interfaz para el formulario de pago
interface PaymentForm {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const PaymentPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Obtener el producto del store
  const product = useAppSelector(state =>
    state.products.products.find(p => p.id === Number(productId))
  );

  // Estado del formulario
  const [formData, setFormData] = useState<PaymentForm>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Validaciones del formulario
  const isCardValid = (cardNumber: string) => /^\d{16}$/.test(cardNumber);
  const isExpiryValid = (expiryDate: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate);
  const isCvvValid = (cvv: string) => /^\d{3,4}$/.test(cvv);

  // Manejador de cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones de los campos
    if (!isCardValid(formData.cardNumber)) {
      alert('Número de tarjeta inválido. Debe tener 16 dígitos.');
      return;
    }

    if (!isExpiryValid(formData.expiryDate)) {
      alert('Fecha de vencimiento inválida. Use el formato MM/YY.');
      return;
    }

    if (!isCvvValid(formData.cvv)) {
      alert('CVV inválido. Debe tener 3 o 4 dígitos.');
      return;
    }

    try {
      // Simulación de la lógica de pago
      const response = await fetch('http://localhost:3000/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error en el pago.');

      const result = await response.json();
      console.log('Pago exitoso:', result);
      navigate('/summary'); // Redirige al resumen
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Hubo un problema al procesar el pago.');
    }
  };

  if (!product) {
    return <div className="text-center p-8">Producto no encontrado</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Información de Pago</h1>

      {/* Resumen del producto */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-bold">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-xl font-bold mt-2">${product.price}</p>
      </div>

      {/* Formulario de pago */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Número de Tarjeta</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="4111 1111 1111 1111"
            maxLength={16}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Titular de la Tarjeta</label>
          <input
            type="text"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Juan Pérez"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Fecha de Vencimiento</label>
            <InputMask
              mask="99/99"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="MM/YY"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="123"
              maxLength={4}
              required
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Pagar ${product.price}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
