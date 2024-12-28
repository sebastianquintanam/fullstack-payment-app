// backend/src/modules/products/infrastructure/persistence/product.repository.ts

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/products.entity';

// Aquí usamos @Injectable() para que NestJS pueda usar este repositorio
@Injectable()
export class ProductRepository {
  constructor(
    // Esto es como conectar nuestro repositorio con la base de datos
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

   // Guardar un nuevo producto
   async save(product: Partial<Product>): Promise<Product> {
    const newProduct = this.repository.create(product);
    return this.repository.save(newProduct);
  }

  // Función para actualizar el stock cuando alguien compra
  async updateStock(id: number, newStock: number): Promise<Product> {
    await this.repository.update(id, { stock: newStock });
    return this.findById(id);
  }
}