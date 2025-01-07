// src/store/slices/transactionSlice.test.ts

import transactionReducer, {
    setTransactionPending,
    setTransactionComplete,
    setTransactionFailed,
    clearCurrentTransaction,
    clearTransactionError,
} from './transactionSlice';
import { TransactionState, Transaction, TransactionStatus } from '../types';

describe('transactionSlice', () => {
    const initialState: TransactionState = {
        currentTransaction: null,
        history: [],
        error: null,
    };

    it('should handle initial state', () => {
        expect(transactionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setTransactionPending', () => {
        const pendingTransaction: Transaction = {
            id: '1',
            status: TransactionStatus.PENDING,
            reference: 'ref1',
            amount: 100,
            productId: 1,
            data: {
                cardHolder: 'Test User'
            }
        };

        const actual = transactionReducer(
            initialState, 
            setTransactionPending(pendingTransaction)
        );
        expect(actual.currentTransaction).toEqual(pendingTransaction);
        expect(actual.history).toContainEqual(pendingTransaction);
    });

    it('should handle setTransactionComplete', () => {
        const initialStateWithPending: TransactionState = {
            currentTransaction: {
                id: '1',
                status: TransactionStatus.PENDING,
                reference: 'ref1',
                amount: 100,
                productId: 1,
                data: {
                    cardHolder: 'Test User'
                }
            },
            history: [
                {
                    id: '1',
                    status: TransactionStatus.PENDING,
                    reference: 'ref1',
                    amount: 100,
                    productId: 1,
                    data: {
                        cardHolder: 'Test User'
                    }
                }
            ],
            error: null
        };

        const completedTransaction: Transaction = {
            id: '1',
            status: TransactionStatus.COMPLETED,
            reference: 'ref1',
            amount: 100,
            productId: 1,
            data: {
                cardHolder: 'Test User',
                transactionId: 'txn_123'
            }
        };

        const actual = transactionReducer(
            initialStateWithPending,
            setTransactionComplete(completedTransaction)
        );
        expect(actual.currentTransaction).toEqual(completedTransaction);
        expect(actual.history).toContainEqual(completedTransaction);
    });

    it('should handle setTransactionFailed', () => {
        const initialStateWithPending: TransactionState = {
            currentTransaction: {
                id: '1',
                status: TransactionStatus.PENDING,
                reference: 'ref1',
                amount: 100,
                productId: 1,
            },
            history: [
                {
                    id: '1',
                    status: TransactionStatus.PENDING,
                    reference: 'ref1',
                    amount: 100,
                    productId: 1,
                }
            ],
            error: null
        };

        const failedTransaction = {
            id: '1',
            status: TransactionStatus.FAILED,
            error: 'Payment processing failed'
        };

        const actual = transactionReducer(
            initialStateWithPending,
            setTransactionFailed(failedTransaction)
        );

        expect(actual.currentTransaction).toEqual({
            ...initialStateWithPending.currentTransaction,
            status: TransactionStatus.FAILED,
        });
        expect(actual.error).toBe('Payment processing failed');
        expect(actual.history).toContainEqual({
            ...initialStateWithPending.currentTransaction,
            status: TransactionStatus.FAILED,
        });
    });

    it('should handle clearCurrentTransaction', () => {
        const stateWithTransaction: TransactionState = {
            currentTransaction: {
                id: '1',
                status: TransactionStatus.PENDING,
                reference: 'ref1',
                amount: 100,
                productId: 1,
            },
            history: [],
            error: null
        };

        const actual = transactionReducer(stateWithTransaction, clearCurrentTransaction());
        expect(actual.currentTransaction).toBeNull();
        expect(actual.error).toBeNull();
    });

    it('should handle clearTransactionError', () => {
        const stateWithError: TransactionState = {
            currentTransaction: null,
            history: [],
            error: 'Test error'
        };

        const actual = transactionReducer(stateWithError, clearTransactionError());
        expect(actual.error).toBeNull();
    });
});