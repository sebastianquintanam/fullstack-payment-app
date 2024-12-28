// backend/src/modules/transactions/interfaces/http/transactions.controller.ts

import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { TransactionsService } from '../../application/services/transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // POST /transactions - Crear una nueva transacción
  @Post()
  async createTransaction(
    @Body() body: { productId: number; quantity: number }
  ) {
    try {
      return await this.transactionsService.createTransaction(
        body.productId,
        body.quantity
      );
    } catch (error) {
      throw new Error('Error al crear la transacción');
    }
  }

  // PUT /transactions/:number/status - Actualizar estado de una transacción
  @Put(':number/status')
  async updateTransactionStatus(
    @Param('number') transactionNumber: string,
    @Body() body: { status: string }
  ) {
    try {
      return await this.transactionsService.updateTransactionStatus(
        transactionNumber,
        body.status
      );
    } catch (error) {
      throw new Error('Error al actualizar el estado de la transacción');
    }
  }
}