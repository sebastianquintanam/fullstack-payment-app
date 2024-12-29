// src/pages/ProductPage/index.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts } from '../../store/slices/productSlice';
import ProductCard from '../../components/product/ProductCard';

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

  // Función para manejar la compra de un producto
  const handleBuyClick = (productId: number) => {
    navigate(`/checkout/${productId}`);
  };

  // Renderizado condicional según el estado
  if (loading) {
    return <div className="text-center p-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Productos Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onBuyClick={handleBuyClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;