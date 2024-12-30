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
    reference: string;
  }
  
  export interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface TransactionState {
    current: Transaction | null;
    history: Transaction[];
  }
  
  export interface WompiPaymentRequest {
    amount: number;
    currency: string;
    payment_method: {
      type: string;
      token: string;
    };
    reference: string;
  }

  // Añadir estas interfaces al archivo de tipos existente
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
  
  export interface WompiPaymentRequest {
    amount: number;
    currency: string;
    payment_method: PaymentMethodData;
    reference: string;
  }