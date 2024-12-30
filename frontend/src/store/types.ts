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
    reference: string; // Agregado para resolver error de tipo
  }
  
  export interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    transaction: Transaction | null;
    loading: boolean;
    error: string | null;
  }
  
  // Tipo para la respuesta de Wompi para evitar any
  export interface WompiPaymentRequest {
    amount: number;
    currency: string;
    payment_method: {
      type: string;
      token: string;
    };
    reference: string;
  }