export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    description: string;
  }

  export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}
  
  export interface Transaction {
    id: string;
    status: TransactionStatus;
    amount: number;
    productId: number;
    reference: string;
    data?: Record<string, unknown>;
  }
  
  export interface ProductState {
    items: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
}
  
  export interface TransactionState {
    error: string | null;
    currentTransaction: Transaction | null;
    history: Transaction[];
  }
  
  export interface WompiPaymentRequest {
    amount: number;
    currency: string;
    payment_method: PaymentMethodData;
    reference: string;
  }
  
  export interface CardTokenizationRequest {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }
  
  export interface PaymentMethodData {
    type: string;
    token: string;
  }