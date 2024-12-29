import React from "react";
import { useNavigate } from "react-router-dom";

const SummaryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    // Redirigir a la página de estado (StatusPage)
    navigate("/status");
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Resumen de la Compra</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-bold">Nombre del Producto</h2>
        <p className="text-gray-600">Descripción breve del producto</p>
        <p className="text-xl font-bold mt-2">$Precio</p>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Confirmar Compra
      </button>
    </div>
  );
};

export default SummaryPage;
