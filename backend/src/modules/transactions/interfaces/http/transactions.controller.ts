// src/modules/transactions/interfaces/http/transactions.controller.ts

import { 
    Controller, 
    Get,     // Añadido
    Post, 
    Put,
    Body, 
    Param, 
    BadRequestException, 
    InternalServerErrorException,
    NotFoundException    // Añadido
} from '@nestjs/common';
import { TransactionsService } from '../../application/services/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum.ts';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    // GET /transactions - Obtener todas las transacciones
    @Get()
    async getAllTransactions() {
        try {
            return await this.transactionsService.getAllTransactions();
        } catch (error) {
            console.error('Error getting transactions:', error);
            throw new InternalServerErrorException('Failed to get transactions');
        }
    }

    // GET /transactions/:id - Obtener una transacción por ID
    @Get(':id')
    async getTransactionById(@Param('id') id: string) {
        try {
            const transaction = await this.transactionsService.getTransactionById(Number(id));
            if (!transaction) {
                throw new NotFoundException(`Transaction #${id} not found`);
            }
            return transaction;
        } catch (error) {
            console.error('Error getting transaction:', error);
            throw new InternalServerErrorException('Failed to get transaction');
        }
    }

    // POST /transactions - Crear nueva transacción
    @Post()
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
        try {
            return await this.transactionsService.createTransaction(createTransactionDto);
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw new InternalServerErrorException('Failed to create transaction');
        }
    }

    // PUT /transactions/:transactionNumber/status - Actualizar estado
    @Put(':transactionNumber/status')
    async updateTransactionStatus(
        @Param('transactionNumber') transactionNumber: string,
        @Body() body: { status: TransactionStatus }
    ) {
        console.log('Controller received:', { transactionNumber, body });
        
        if (!transactionNumber) {
            throw new BadRequestException('Transaction number is required');
        }

        try {
            const updateDto = {
                transactionNumber,
                status: body.status as TransactionStatus
            };
            
            return await this.transactionsService.updateTransactionStatus(updateDto);
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw new InternalServerErrorException('Failed to update transaction status');
        }
    }
}