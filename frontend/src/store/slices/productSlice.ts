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
    // Implementar llamada a API
    return [];
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    updateStock: (state, action: PayloadAction<{ productId: string; newStock: number }>) => {
      const { productId, newStock } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.stock = newStock;
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

export const { setProducts, setSelectedProduct, updateStock } = productSlice.actions;
export default productSlice.reducer;