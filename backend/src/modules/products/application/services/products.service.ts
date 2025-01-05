// backend/src/modules/products/application/services/products.service.ts

import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../infrastructure/persistence/product.repository';
import { Product } from '../../domain/entities/products.entity';
import { initialProducts } from '../../../../config/seeds/initial-products.seed';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  // Obtener todos los productos
  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  // Obtener producto por ID
  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  // Actualizar stock de un producto
  async updateProductStock(id: number, quantity: number): Promise<Product> {
    const product = await this.getProductById(id);
    if (product.stock < quantity) {
      throw new Error('No hay suficiente stock');
    }
    return this.productRepository.updateStock(id, product.stock - quantity);
  }

}