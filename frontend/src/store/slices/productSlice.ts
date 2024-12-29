// src/store/slices/productSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    updateStock: (state, action: PayloadAction<{productId: number, quantity: number}>) => {
      const product = state.items.find(p => p.id === action.payload.productId);
      if (product) {
        product.stock -= action.payload.quantity;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setProducts, updateStock, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;