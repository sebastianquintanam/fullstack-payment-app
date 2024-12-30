import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import transactionReducer from './slices/transactionSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    transactions: transactionReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;