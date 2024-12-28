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

  // Crear productos iniciales
  async seedProducts() {
    try {
      console.log('Iniciando seed de productos...');
      const existingProducts = await this.getAllProducts();

      if (existingProducts.length === 0) {
        console.log('No hay productos, creando iniciales...');
        for (const product of initialProducts) {
          await this.productRepository.save(product);
          console.log(`Producto creado: ${product.name}`);
        }
        return 'Productos iniciales creados exitosamente';
      }
      return 'Ya existen productos en la base de datos';
    } catch (error) {
      console.error('Error al crear productos:', error);
      throw new Error('Error al crear productos iniciales');
    }
  }
}