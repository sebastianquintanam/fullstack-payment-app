// src/pages/ProductPage/index.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts } from '../../store/slices/productSlice';
import ProductCard from '../../components/product/ProductCard';
import type { Product } from '../../store/types';

const ProductPage: React.FC = () => {
  // Hooks para manejar el estado y la navegación
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Obtenemos el estado de los productos usando el selector tipado
  const { products, loading, error } = useAppSelector((state) => state.products);

  // Cargamos los productos cuando el componente se monta
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Función para manejar la selección de un producto
  const handleProduct = (product: Product) => {
    navigate(`/checkout/${product.id}`);
  };

  // Renderizado condicional según el estado
  if (loading) {
    return <div className="text-center p-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Productos Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="font-bold text-lg">Precio: ${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            <button
              onClick={() => handleProduct(product)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Comprar Ahora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;