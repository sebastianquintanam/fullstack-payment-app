// backend/src/modules/transactions/interfaces/http/transactions.controller.ts

import { 
    Controller, 
    Post, 
    Body, 
    Param, 
    Put, 
    BadRequestException, 
    InternalServerErrorException 
  } from '@nestjs/common';
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
        console.error('Error while creating the transaction:', error.message);
  
        // Lanzar excepción más clara y específica
        throw new InternalServerErrorException('Failed to create the transaction.');
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
      if (!transactionNumber) {
        throw new BadRequestException('Transaction number is required.');
      }
  
      try {
        // Incluimos el número de transacción en el DTO
        updateTransactionDto.transactionNumber = transactionNumber;
        return await this.transactionsService.updateTransactionStatus(updateTransactionDto);
      } catch (error) {
        console.error('Error while updating the transaction status:', error.message);
  
        // Lanzar excepción más clara y específica
        throw new InternalServerErrorException('Failed to update the transaction status.');
      }
    }
  }
  