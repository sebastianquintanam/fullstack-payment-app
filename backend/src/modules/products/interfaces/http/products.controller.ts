// src/modules/products/interfaces/http/products.controller.ts

import { Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from '../../application/services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('seed')
  async seedProducts() {
    return this.productsService.seedProducts();
  }

  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }
}