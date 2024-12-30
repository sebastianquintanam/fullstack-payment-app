import React from 'react';
import type { Product } from '../../../store/types';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  onClick: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  description,
  stock,
  onClick,
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