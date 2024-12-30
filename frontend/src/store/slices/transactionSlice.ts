import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from '../types';

interface TransactionState {
  current: Transaction | null;
  history: Transaction[];
}

const initialState: TransactionState = {
  current: null,
  history: []
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransaction: (state, action: PayloadAction<Transaction>) => {
      state.current = action.payload;
      state.history.push(action.payload);
    },
    updateTransactionStatus: (
      state, 
      action: PayloadAction<{ 
        id: string; 
        status: Transaction['status'] 
      }>
    ) => {
      if (state.current && state.current.id === action.payload.id) {
        state.current.status = action.payload.status;
      }
      const historyTransaction = state.history.find(t => t.id === action.payload.id);
      if (historyTransaction) {
        historyTransaction.status = action.payload.status;
      }
    },
    clearTransaction: (state) => {
      state.current = null;
    }
  }
});

export const { 
  setTransaction, 
  updateTransactionStatus, 
  clearTransaction 
} = transactionSlice.actions;

export default transactionSlice.reducer;