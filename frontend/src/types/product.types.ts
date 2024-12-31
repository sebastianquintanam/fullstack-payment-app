export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
  }
  
  export interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
  }