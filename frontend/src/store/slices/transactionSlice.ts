import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Transaction, TransactionState, TransactionStatus } from '../types';

// Estado inicial
const initialState: TransactionState = {
  currentTransaction: null, // Transacción activa actual
  history: [], // Historial de transacciones
  error: null, // Mensaje de error relacionado con las transacciones
};

// Función auxiliar para actualizar el historial de manera pura
const updateTransactionInHistory = (
  history: Transaction[],
  id: string,
  updates: Partial<Transaction>
): Transaction[] => {
  return history.map((transaction) =>
    transaction.id === id ? { ...transaction, ...updates } : transaction
  );
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

      // Evita duplicados en el historial
      const existingTransaction = state.history.find(
        (transaction) => transaction.id === action.payload.id
      );
      if (!existingTransaction) {
        state.history.push(action.payload);
      }
    },

    /**
     * Marca la transacción actual como completada.
     */
    setTransactionComplete: (
      state,
      action: PayloadAction<{
        id: string;
        status: TransactionStatus; 
        reference: string;
        amount: number;
        productId: number;
      }>
    ) => {
      const { id, status, reference, amount, productId } = action.payload;

      if (state.currentTransaction && state.currentTransaction.id === id) {
        state.currentTransaction = {
          ...state.currentTransaction,
          status,
          reference,
          amount,
          productId,
        };
        state.history = updateTransactionInHistory(state.history, id, {
          status,
          reference,
          amount,
          productId,
        });
      }
    },

    /**
     * Marca la transacción actual como fallida y registra el error.
     */
    setTransactionFailed: (
      state,
      action: PayloadAction<{ id: string; status: TransactionStatus; error: string }>
    ) => {
      const { id, status, error } = action.payload;
    
      if (state.currentTransaction && state.currentTransaction.id === id) {
        state.currentTransaction = {
          ...state.currentTransaction,
          status,
        };
        state.error = error;
        state.history = updateTransactionInHistory(state.history, id, {
          status,
        });
      }
    },

    /**
     * Limpia la transacción actual.
     */
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
      state.error = null;
    },

    /**
     * Limpia todos los errores relacionados con transacciones.
     */
    clearTransactionError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setTransactionPending,
  setTransactionComplete,
  setTransactionFailed,
  clearCurrentTransaction,
  clearTransactionError,
} = transactionSlice.actions;

export default transactionSlice.reducer;
