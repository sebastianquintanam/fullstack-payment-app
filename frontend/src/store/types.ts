// src/store/types.ts

export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
  }
  
  export interface Transaction {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    amount: number;
    productId: string;
  }
  
  export interface ProductState {
    products: Product[];
    transaction: Transaction | null;
    loading: boolean;
    error: string | null;
  }