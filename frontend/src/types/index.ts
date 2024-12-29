export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
  }
  
  export interface PaymentFormData {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  }
  
  export interface Transaction {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    amount: number;
    productId: number;
    reference: string;
  }