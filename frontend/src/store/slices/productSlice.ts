import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductState } from '../../types/product.types';

// Estado inicial
const initialState: ProductState = {
  items: [], 
  selectedProduct: null,
  loading: false,
  error: null,
};

// Acción asincrónica para obtener los productos
export const fetchProducts = createAsyncThunk<Product[], void>(
  'products/fetchProducts',
  async (): Promise<Product[]> => {
    const response = await fetch('/api/products'); 
    if (!response.ok) {
      throw new Error('Error al cargar los productos');
    }
    return response.json();
  }
);

// Slice para los productos
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
      // Busca el producto directamente, ambos deben ser tipo "number"
      const product = state.items.find((p) => p.id === action.payload.productId);
      if (product) {
        product.stock = action.payload.newStock;
      } else {
        console.warn(`Producto con ID ${action.payload.productId} no encontrado.`);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null; // Reinicia el error al empezar a cargar
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Asigna los productos devueltos
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar los productos'; // Muestra un error si la solicitud falla
        console.error(action.error.message); // Log para depuración
      });
  },
});

// Exporta las acciones y el reducer
export const { setSelectedProduct, updateStock } = productSlice.actions;

export default productSlice.reducer;
