import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import { fetchProducts, setSelectedProduct } from '../../store/slices/productSlice';
import type { RootState } from '../../store';
import type { Product } from '../../store/types';

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductSelect = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      dispatch(setSelectedProduct(product));
      navigate('/payment');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <ProductCard
            key={product.id}
            {...product}
            onClick={handleProductSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;