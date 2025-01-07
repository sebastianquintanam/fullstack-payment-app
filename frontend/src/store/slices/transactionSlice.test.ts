import transactionReducer, {
import type { TransactionState, Transaction } from '../types';

setTransactionPending,
setTransactionComplete,
setTransactionFailed,
clearCurrentTransaction,
clearTransactionError,
} from './transactionSlice';

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
    const newTransaction: Transaction = {
        id: '1',
        status: 'PENDING',
        reference: 'ref1',
        amount: 100,
        productId: 1,
    };

    const actual = transactionReducer(initialState, setTransactionPending(newTransaction));
    expect(actual.currentTransaction).toEqual(newTransaction);
    expect(actual.history).toContainEqual(newTransaction);
});

it('should handle setTransactionComplete', () => {
    const initialStateWithPending: TransactionState = {
        currentTransaction: {
            id: '1',
            status: 'PENDING',
            reference: 'ref1',
            amount: 100,
            productId: 1,
        },
        history: [
            {
                id: '1',
                status: 'PENDING',
                reference: 'ref1',
                amount: 100,
                productId: 1,
            },
        ],
        error: null,
    };

    const completedTransaction = {
        id: '1',
        status: 'COMPLETED',
        reference: 'ref1',
        amount: 100,
        productId: 1,
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
            status: 'PENDING',
            reference: 'ref1',
            amount: 100,
            productId: 1,
        },
        history: [
            {
                id: '1',
                status: 'PENDING',
                reference: 'ref1',
                amount: 100,
                productId: 1,
            },
        ],
        error: null,
    };

    const failedTransaction = {
        id: '1',
        status: 'FAILED',
        error: 'Transaction failed',
    };

    const actual = transactionReducer(
        initialStateWithPending,
        setTransactionFailed(failedTransaction)
    );
    expect(actual.currentTransaction).toEqual({
        ...initialStateWithPending.currentTransaction,
        status: 'FAILED',
    });
    expect(actual.error).toEqual('Transaction failed');
    expect(actual.history).toContainEqual({
        ...initialStateWithPending.currentTransaction,
        status: 'FAILED',
    });
});

it('should handle clearCurrentTransaction', () => {
    const initialStateWithTransaction: TransactionState = {
        currentTransaction: {
            id: '1',
            status: 'PENDING',
            reference: 'ref1',
            amount: 100,
            productId: 1,
        },
        history: [],
        error: null,
    };

    const actual = transactionReducer(initialStateWithTransaction, clearCurrentTransaction());
    expect(actual.currentTransaction).toBeNull();
    expect(actual.error).toBeNull();
});

it('should handle clearTransactionError', () => {
    const initialStateWithError: TransactionState = {
        currentTransaction: null,
        history: [],
        error: 'Some error',
    };

    const actual = transactionReducer(initialStateWithError, clearTransactionError());
    expect(actual.error).toBeNull();
});
});