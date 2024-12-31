// /frontend/src/types/index.ts

// Tipos de estado de transacción
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'APPROVED' | 'DECLINED' | 'ERROR';

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  productId: number;
  status: TransactionStatus;
  createdAt?: string; // Fecha de creación de la transacción
  error?: string; // Mensaje de error opcional
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl?: string; // URL opcional para la imagen del producto
}

export interface ProductState {
  products: Product[]; // Cambiado de 'items' a 'products' para consistencia
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: string; // Timestamp de la última actualización
}

export interface TransactionState {
  currentTransaction: Transaction | null;
  history: Transaction[];
  error: string | null;
  isProcessing: boolean; // Estado para indicar si hay una transacción en proceso
}

// Tipos para las respuestas de la API de Wompi
export interface WompiPaymentResponse {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  created_at: string;
  payment_method: {
    type: string;
    extra: Record<string, string | number | boolean>;
  };
}

export interface WompiPaymentRequest {
  amount: number;
  currency: string;
  payment_method: {
    type: string;
    token: string;
  };
  reference: string;
  customer_data?: {
    email: string;
    full_name: string;
  };
  shipping_address?: {
    address_line_1: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
  };
}

export interface CardTokenizationRequest {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export interface CardTokenizationResponse {
  token: string;
  type: string;
  card_number: string; // Últimos 4 dígitos
  exp_month: string;
  exp_year: string;
  card_holder: string;
  created_at: string;
}

// Interfaces para el manejo de errores
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string | number | boolean>;
}

// Interfaces para el manejo del resumen de pago
export interface PaymentSummary {
  subtotal: number;
  baseFee: number;
  deliveryFee: number;
  total: number;
  currency: string;
}

// Interfaces para información de envío
export interface ShippingInfo {
  full_name: string;
  address_line_1: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  phone?: string;
}