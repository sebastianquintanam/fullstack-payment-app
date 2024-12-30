import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from '../types';

interface TransactionState {
  currentTransaction: {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    amount: number;
    reference: string;
  } | null;
  loading: boolean;
  error: string | null;
  history: Transaction[];
}

const initialState: TransactionState = {
  currentTransaction: null,
  loading: false,
  error: null,
  history: []
};

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionPending: (state, action: PayloadAction<any>) => {
      state.currentTransaction = {
        ...action.payload,
        status: 'PENDING'
      };
      state.loading = true;
    },
    setTransactionComplete: (state, action) => {
      if (state.currentTransaction) {
        state.currentTransaction.status = 'COMPLETED';
        state.history.push({ ...state.currentTransaction });
      }
      state.loading = false;
    },
    setTransactionFailed: (state, action) => {
      if (state.currentTransaction) {
        state.currentTransaction.status = 'FAILED';
      }
      state.loading = false;
      state.error = action.payload;
    },
    setTransaction: (state, action: PayloadAction<Transaction>) => {
      state.currentTransaction = action.payload;
      state.history.push(action.payload);
    },
    clearTransaction: (state) => {
      state.currentTransaction = null;
    }
  }
});

export const {
  setTransactionPending,
  setTransactionComplete,
  setTransactionFailed,
  setTransaction,
  clearTransaction
} = transactionSlice.actions;

export default transactionSlice.reducer;
