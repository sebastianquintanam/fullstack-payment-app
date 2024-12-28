// backend/src/modules/products/interfaces/http/products.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from '../../application/services/products.service';
import { ProductRepository } from '../../infrastructure/persistence/product.repository';
import { Product } from '../../domain/entities/products.entity';

@Module({
  // Importamos TypeOrmModule para la entidad Product
  imports: [TypeOrmModule.forFeature([Product])],
  // Declaramos nuestro controller
  controllers: [ProductsController],
  // Declaramos nuestros servicios
  providers: [ProductsService, ProductRepository],
  // Exportamos el servicio para que otros módulos puedan usarlo
  exports: [ProductsService]
})
export class ProductsModule {}