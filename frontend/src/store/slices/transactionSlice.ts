import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransactionState {
  currentTransaction: {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    amount: number;
    reference: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  currentTransaction: null,
  loading: false,
  error: null
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
      }
      state.loading = false;
    },
    setTransactionFailed: (state, action) => {
      if (state.currentTransaction) {
        state.currentTransaction.status = 'FAILED';
      }
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  setTransactionPending,
  setTransactionComplete,
  setTransactionFailed
} = transactionSlice.actions;

export default transactionSlice.reducer;