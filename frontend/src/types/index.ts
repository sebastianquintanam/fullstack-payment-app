export interface Transaction {
  id: string; // Identificador único de la transacción
  reference: string; // Referencia asociada a la transacción
  amount: number; // Monto de la transacción en centavos
  productId: number; // ID del producto relacionado con la transacción
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'APPROVED'; // Estado obligatorio para manejo en tiempo real
}

export interface Product {
  id: number; // Identificador único del producto
  name: string; // Nombre del producto
  price: number; // Precio del producto
  stock: number; // Stock disponible
  description: string; // Descripción del producto
}

export interface ProductState {
  items: Product[]; // Lista de productos disponibles
  selectedProduct: Product | null; // Producto seleccionado por el usuario
  loading: boolean; // Estado de carga de productos
  error: string | null; // Mensaje de error si ocurre un problema
}

export interface TransactionState {
  currentTransaction: Transaction | null; // Transacción activa
  history: Transaction[]; // Historial de transacciones completadas
  error: string | null; // Mensaje de error relacionado con transacciones
}

export interface WompiPaymentRequest {
  amount: number; // Monto de la transacción en la moneda especificada
  currency: string; // Moneda de la transacción (e.g., "COP")
  payment_method: {
    type: string; // Tipo de método de pago (e.g., "CARD")
    token: string; // Token generado para el método de pago
  };
  reference: string; // Referencia única para la transacción
}

export interface CardTokenizationRequest {
  number: string; // Número de la tarjeta de crédito/débito
  cvc: string; // Código de seguridad de la tarjeta
  exp_month: string; // Mes de vencimiento (formato MM)
  exp_year: string; // Año de vencimiento (formato YY)
  card_holder: string; // Nombre del titular de la tarjeta
}
