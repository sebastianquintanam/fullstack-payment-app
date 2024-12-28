// backend/src/modules/products/interfaces/http/products.controller.ts

import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../../application/services/products.service';

@Controller('products')
export class ProductsController {
  // Inyectamos el servicio que creamos antes
  constructor(private readonly productsService: ProductsService) {}

  // GET /products - Obtener todos los productos
  @Get()
  async getAllProducts() {
    try {
      return await this.productsService.getAllProducts();
    } catch (error) {
      throw new Error('Error al obtener los productos');
    }
  }

  // GET /products/:id - Obtener un producto por ID
  @Get(':id')
  async getProductById(@Param('id') id: number) {
    try {
      const product = await this.productsService.getProductById(id);
      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }
      return product;
    } catch (error) {
      throw new NotFoundException('Producto no encontrado');
    }
  }
}