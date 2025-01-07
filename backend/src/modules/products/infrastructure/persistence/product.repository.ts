// backend/src/modules/products/infrastructure/persistence/product.repository.ts

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/products.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>
  ) {}

  // Función para traer todos los productos
  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  // Función para buscar un producto por su ID
  async findById(id: number): Promise<Product> {
    return this.repository.findOne({ where: { id } });
  }

  // Método create para crear un nuevo producto
  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.repository.create(product);
    return this.repository.save(newProduct);
  }

  // Guardar un nuevo producto
  async save(product: Partial<Product>): Promise<Product> {
    const newProduct = this.repository.create(product);
    return this.repository.save(newProduct);
  }

  // Función para actualizar el stock cuando alguien compra
  async updateStock(id: number, newStock: number): Promise<Product> {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await this.repository.update(id, { stock: newStock });
    return this.findById(id);
  }
}