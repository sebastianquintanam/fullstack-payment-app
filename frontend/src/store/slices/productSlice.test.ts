import { configureStore } from '@reduxjs/toolkit';
import productReducer, { fetchProducts, setSelectedProduct, updateStock } from './productSlice';
import type { ProductState, Product } from '../../types/product.types';

describe('productSlice', () => {
    const initialState: ProductState = {
        products: [],
        selectedProduct: null,
        loading: false,
        error: null,
    };

    const store = configureStore({
        reducer: {
            products: productReducer,
        },
    });

    it('should handle initial state', () => {
        expect(store.getState().products).toEqual(initialState);
    });

    it('should handle setSelectedProduct', () => {
        const product: Product = { id: 1, name: 'Test Product', description: 'Test Description', price: 100, stock: 10 };
        store.dispatch(setSelectedProduct(product));
        expect(store.getState().products.selectedProduct).toEqual(product);
    });

    it('should handle updateStock', () => {
        const product: Product = { id: 1, name: 'Test Product', description: 'Test Description', price: 100, stock: 10 };
        store.dispatch(setSelectedProduct(product));
        store.dispatch(updateStock({ productId: 1, newStock: 5 }));
        expect(store.getState().products.selectedProduct?.stock).toEqual(5);
    });

    it('should handle fetchProducts.pending', () => {
        store.dispatch(fetchProducts.pending('fetchProducts', undefined, undefined));
        expect(store.getState().products.loading).toBe(true);
        expect(store.getState().products.error).toBe(null);
    });

    it('should handle fetchProducts.fulfilled', () => {
        const products: Product[] = [
            { id: 1, name: 'Product 1', description: 'Description 1', price: 100, stock: 10 },
            { id: 2, name: 'Product 2', description: 'Description 2', price: 200, stock: 20 },
        ];
        store.dispatch(fetchProducts.fulfilled(products, 'fetchProducts'));
        expect(store.getState().products.loading).toBe(false);
        expect(store.getState().products.products).toEqual(products);
        expect(store.getState().products.error).toBe(null);
    });

    it('should handle fetchProducts.rejected', () => {
        const error = new Error('Error al cargar los productos');
        store.dispatch(fetchProducts.rejected(error, 'fetchProducts'));
        expect(store.getState().products.loading).toBe(false);
        expect(store.getState().products.error).toBe('Error al cargar los productos');
        expect(store.getState().products.products).toEqual([]);
    });
});