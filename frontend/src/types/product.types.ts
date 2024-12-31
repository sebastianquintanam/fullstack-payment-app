export interface Product {
    id: number; // Asegúrate de usar el mismo tipo que se espera
    name: string;
    price: number;
    stock: number;
    description?: string;
  }
  
  export interface ProductState {
    items: Product[]; // Lista de productos
    selectedProduct: Product | null; // Producto seleccionado (puede ser null inicialmente)
    loading: boolean; // Indicador de estado de carga
    error: string | null; // Mensaje de error
  }
  