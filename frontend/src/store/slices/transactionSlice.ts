import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Transaction, TransactionState } from '../types';

// Estado inicial
const initialState: TransactionState = {
  currentTransaction: null, // Transacción activa actual
  history: [], // Historial de transacciones
  error: null, // Mensaje de error relacionado con las transacciones
};

// Función auxiliar para actualizar el historial
const updateTransactionInHistory = (
  history: Transaction[],
  id: string,
  updates: Partial<Transaction>
) => {
  const transaction = history.find((transaction) => transaction.id === id);
  if (transaction) {
    Object.assign(transaction, updates);
  }
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    /**
     * Establece una nueva transacción como pendiente y la agrega al historial.
     */
    setTransactionPending: (state, action: PayloadAction<Transaction>) => {
      state.currentTransaction = action.payload;
      state.history.push(action.payload);
    },

    /**
     * Marca la transacción actual como completada.
     */
    setTransactionComplete: (
      state,
      action: PayloadAction<{ id: string; status: 'COMPLETED'; reference: string; amount: number; productId: number }>
    ) => {
      const { id, status, reference, amount, productId } = action.payload;

      if (state.currentTransaction && state.currentTransaction.id === id) {
        state.currentTransaction.status = status;
        state.currentTransaction.reference = reference;
        state.currentTransaction.amount = amount;
        state.currentTransaction.productId = productId;
        updateTransactionInHistory(state.history, id, { status, reference, amount, productId });
      }
    },

    /**
     * Marca la transacción actual como fallida y registra el error.
     */
    setTransactionFailed: (
      state,
      action: PayloadAction<{ id: string; status: 'FAILED'; error: string }>
    ) => {
      const { id, status, error } = action.payload;

      if (state.currentTransaction && state.currentTransaction.id === id) {
        state.currentTransaction.status = status;
        state.error = error;
        updateTransactionInHistory(state.history, id, { status });
      }
    },

    /**
     * Limpia la transacción actual.
     */
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
      state.error = null;
    },
  },
});

export const {
  setTransactionPending,
  setTransactionComplete,
  setTransactionFailed,
  clearCurrentTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;