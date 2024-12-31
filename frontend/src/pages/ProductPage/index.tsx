import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, setSelectedProduct } from '../../store/slices/productSlice';
import type { AppDispatch, RootState } from '../../store/store';
import type { Product } from '../../types/product.types';

export const ProductPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  
  useEffect(() => {
    // Solo cargar si no hay productos
    if (!products?.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products?.length]);

  const handleProductClick = (id: number) => {
    const selectedProduct = products?.find((product: Product) => product.id === id);
    if (selectedProduct) {
      dispatch(setSelectedProduct(selectedProduct));
      navigate(`/products/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products?.map((product: Product) => (
        <div 
          key={product.id}
          className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleProductClick(product.id)}
        >
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Stock: {product.stock}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductPage;