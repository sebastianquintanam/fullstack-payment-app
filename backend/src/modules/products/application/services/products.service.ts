// backend/src/modules/products/application/services/products.service.ts

import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../infrastructure/persistence/product.repository';
import { Product } from '../../domain/entities/products.entity';

@Injectable()
export class ProductsService {
  // Inyectamos el repositorio que creamos antes
  constructor(private readonly productRepository: ProductRepository) {}

  // Obtener todos los productos disponibles
  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  // Buscar un producto específico por ID
  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  // Actualizar el stock cuando se hace una compra
  async updateProductStock(id: number, quantity: number): Promise<Product> {
    // Primero verificamos que el producto existe
    const product = await this.getProductById(id);
    
    // Verificamos que hay suficiente stock
    if (product.stock < quantity) {
      throw new Error('No hay suficiente stock disponible');
    }

    // Actualizamos el stock
    const newStock = product.stock - quantity;
    return this.productRepository.updateStock(id, newStock);
  }
}