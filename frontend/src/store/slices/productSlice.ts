import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductState } from '../types';

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    // Implementar llamada API
    return [];
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    updateStock: (state, action: PayloadAction<{ productId: number; newStock: number }>) => {
      const product = state.products.find(p => p.id === action.payload.productId.toString());
      if (product) {
        product.stock = action.payload.newStock;
      }
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

export const { setSelectedProduct, updateStock } = productSlice.actions;
export default productSlice.reducer;