// backend/src/modules/transactions/interfaces/http/transactions.controller.ts

import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { TransactionsService } from '../../application/services/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * POST /transactions - Create a new transaction
   * @param createTransactionDto Data transfer object for creating a transaction
   */
  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      return await this.transactionsService.createTransaction(createTransactionDto);
    } catch (error) {
      throw new Error('Error while creating the transaction');
    }
  }

  /**
   * PUT /transactions/:number/status - Update the status of a transaction
   * @param transactionNumber Unique identifier of the transaction
   * @param updateTransactionDto Data transfer object for updating the transaction status
   */
  @Put(':number/status')
  async updateTransactionStatus(
    @Param('number') transactionNumber: string,
    @Body() updateTransactionDto: UpdateTransactionStatusDto
  ) {
    try {
      // Include transaction number in the DTO
      updateTransactionDto.transactionNumber = transactionNumber;
      return await this.transactionsService.updateTransactionStatus(updateTransactionDto);
    } catch (error) {
      throw new Error('Error while updating the transaction status');
    }
  }
}
