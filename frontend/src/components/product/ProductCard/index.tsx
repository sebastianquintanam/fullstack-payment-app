// src/components/product/ProductCard/index.tsx

import React from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  onBuyClick: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  description,
  stock,
  onBuyClick,
  id
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">${price}</span>
        <span className="text-sm text-gray-500">Stock: {stock}</span>
      </div>
      <button
        onClick={() => onBuyClick(id)}
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        disabled={stock === 0}
      >
        {stock > 0 ? 'Comprar Ahora' : 'Sin Stock'}
      </button>
    </div>
  );
};

export default ProductCard;