// backend/src/modules/transactions/application/services/transactions.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionRepository } from '../../infrastructure/persistence/transaction.repository';
import { Transaction } from '../../domain/entities/transactions.entity';
import { ProductsService } from '../../../products/application/services/products.service';
import { CreateTransactionDto } from '../../interfaces/dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../../interfaces/dto/update-transaction.dto';

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly productsService: ProductsService
  ) {}

  // Obtener todas las transacciones con productos asociados
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.findAll({ relations: ['product'] });
  }

  // Obtener una transacción por ID
  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id, { 
      relations: ['product'] 
    });

    if (!transaction) {
      throw new HttpException(`Transaction #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return transaction;
  }

  // Obtener una transacción por número de transacción
  async getTransactionByNumber(transactionNumber: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findByTransactionNumber(
      transactionNumber,
      { relations: ['product'] }
    );

    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    return transaction;
  }

  // Crear una nueva transacción
  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { productId, quantity } = createTransactionDto;

    // Verificar si el producto existe
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Actualizar el stock del producto
    await this.productsService.updateProductStock(productId, -quantity);

    // Crear y guardar la transacción
    const transaction = await this.transactionRepository.create({
      product,
      amount: product.price * quantity,
      status: TransactionStatus.PENDING,
      transactionNumber: this.generateTransactionNumber(),
      paymentMethod: 'CREDIT_CARD',
      paymentDetails: `Payment processed for ${quantity} units of ${product.name}`,
    });

    return this.transactionRepository.save(transaction);
  }

  // Actualizar el estado de una transacción existente
  async updateTransactionStatus(updateTransactionDto: UpdateTransactionStatusDto): Promise<Transaction> {
    console.log('Service received DTO:', updateTransactionDto);
    
    const { transactionNumber, status } = updateTransactionDto;
    console.log('Parsed values:', { transactionNumber, status });

    // Buscar la transacción por su número único
    console.log('Searching for transaction:', transactionNumber);
    const transaction = await this.transactionRepository.findByTransactionNumber(
      transactionNumber,
      { relations: ['product'] }
    );

    if (!transaction) {
      console.log('Transaction not found for number:', transactionNumber);
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    console.log('Found transaction:', transaction);

    // Actualizar el estado de la transacción
    transaction.status = status;
    console.log('Updating transaction with new status:', status);

    const updatedTransaction = await this.transactionRepository.save(transaction);
    console.log('Transaction updated successfully:', updatedTransaction);

    return updatedTransaction;
  }

  // Generar un número único para la transacción
  private generateTransactionNumber(): string {
    return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}