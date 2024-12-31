import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductState } from '../../types/product.types';

const initialState: ProductState = {
  products: [], // Cambiado de items a products
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[], void>(
  'products/fetchProducts',
  async (): Promise<Product[]> => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      const data = await response.json();
      
      // Asegurarnos de que los datos tengan el formato correcto
      return data.map((item: { id: number; name: string; description: string; price: number; stock: number }): Product => ({
        id: Number(item.id),
        name: String(item.name),
        description: String(item.description),
        price: Number(item.price),
        stock: Number(item.stock)
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    updateStock: (
      state,
      action: PayloadAction<{ productId: number; newStock: number }>
    ) => {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (product) {
        product.stock = action.payload.newStock;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error al cargar los productos';
        state.products = [];
      });
  },
});

export const { setSelectedProduct, updateStock } = productSlice.actions;
export default productSlice.reducer;