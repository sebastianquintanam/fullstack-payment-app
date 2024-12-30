// src/pages/ProductPage/index.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../../components/product/ProductCard';
import { fetchProducts, setSelectedProduct } from '../../store/slices/productSlice';
import type { AppDispatch, RootState } from '../../store/store'; 
import type { Product } from '../../store/types';

export const ProductPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductClick = (productId: number) => {
    const selectedProduct = products.find((product) => product.id === productId);
    if (selectedProduct) {
      dispatch(setSelectedProduct(selectedProduct));
      navigate(`/checkout/${productId}`);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Productos Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={Number(product.id)} // Ensure id is a number
            name={product.name}
            price={product.price}
            stock={product.stock}
            description={product.description}
            onClick={() => handleProductClick(Number(product.id))} // Explicitly handle number conversion
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
