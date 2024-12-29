// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';

// Configuración principal del store de Redux
export const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

// Exportamos los tipos para usar con TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;