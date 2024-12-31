import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, setSelectedProduct } from '../../store/slices/productSlice';
import type { AppDispatch, RootState } from '../../store/store';
import type { Product } from '../../types/product.types';

export const ProductPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Obtenemos los datos del estado global
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);

  // Disparamos la acción para obtener los productos al cargar la página
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Maneja el clic en un producto
  const handleProductClick = (id: number) => {
    const selectedProduct = products?.find((product: Product) => product.id === id);
    if (selectedProduct) {
      dispatch(setSelectedProduct(selectedProduct));
      navigate(`/products/${id}`);
    }
  };

  // Muestra un mensaje mientras los productos se cargan
  if (loading) {
    return <div>Cargando productos...</div>;
  }

  // Muestra un mensaje de error si ocurre un problema al cargar los productos
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Renderiza la lista de productos
  return (
    <div>
      <h1>Productos</h1>
      {products && products.length > 0 ? (
        <ul>
          {products.map((product: Product) => (
            <li key={product.id}>
              {product.name} - ${product.price.toFixed(2)}
              <button onClick={() => handleProductClick(product.id)}>Ver detalles</button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No hay productos disponibles</div>
      )}
    </div>
  );
};

export default ProductPage;
