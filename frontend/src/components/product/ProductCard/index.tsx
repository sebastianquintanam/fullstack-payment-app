// ProductCard/index.tsx

import React from 'react';

interface ProductCardProps {
  id: number; // Asegúrate que sea number, no string
  name: string;
  price: number;
  stock: number;
  description: string;
  onClick: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  stock,
  description,
  onClick
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between text-center">
        <span className="text-2xl text-gray-500">${price}</span>
        <span>Stock: {stock}</span>
      </div>
      <button
        onClick={() => onClick(id)}
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Select
      </button>
    </div>
  );
};

export default ProductCard;