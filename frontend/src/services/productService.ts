// src/services/productService.ts

interface UpdateStockParams {
    productId: number;
    quantity: number;
  }
  
  export const productService = {
    async updateStock({ productId, quantity }: UpdateStockParams): Promise<void> {
      const response = await fetch(`/api/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
  
      if (!response.ok) {
        throw new Error('Error actualizando el stock');
      }
    }
  };