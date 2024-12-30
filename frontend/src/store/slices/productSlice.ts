import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ProductState } from '../types';

const initialState: ProductState = {
  products: [],
  transaction: null,
  loading: false,
  error: null
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch('/api/products');
    return response.json();
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setTransaction: (state, action) => {
      state.transaction = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  }
});

export const { setProducts, setTransaction } = productSlice.actions;
export default productSlice.reducer;
