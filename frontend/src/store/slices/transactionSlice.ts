import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Transaction, TransactionState } from '../types';

const initialState: TransactionState = {
  current: null,
  history: []
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionPending: (state, action: PayloadAction<Transaction>) => {
      state.current = { ...action.payload, status: 'PENDING' };
    },
    setTransactionComplete: (state, action: PayloadAction<string>) => {
      if (state.current && state.current.id === action.payload) {
        state.current.status = 'COMPLETED';
      }
    },
    setTransactionFailed: (state, action: PayloadAction<string>) => {
      if (state.current && state.current.id === action.payload) {
        state.current.status = 'FAILED';
      }
    }
  }
});

export const {
  setTransactionPending,
  setTransactionComplete,
  setTransactionFailed
} = transactionSlice.actions;

export default transactionSlice.reducer;