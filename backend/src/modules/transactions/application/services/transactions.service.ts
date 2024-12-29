// backend/src/modules/transactions/application/services/transactions.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionRepository } from '../../infrastructure/persistence/transaction.repository';
import { Transaction } from '../../domain/entities/transactions.entity';
import { ProductsService } from '../../../products/application/services/products.service';
import { CreateTransactionDto } from '../../interfaces/dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../../interfaces/dto/update-transaction.dto';

// Enumeración de estados válidos para las transacciones
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

  // Crear una nueva transacción
  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { productId, quantity } = createTransactionDto;

    // Verificar si el producto existe
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Verificar si hay stock suficiente
    if (quantity > product.stock) {
      throw new HttpException('Insufficient stock for the requested quantity', HttpStatus.BAD_REQUEST);
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

    await this.transactionRepository.save(transaction);
    return transaction;
  }

  // Actualizar el estado de una transacción existente
  async updateTransactionStatus(updateTransactionDto: UpdateTransactionStatusDto): Promise<Transaction> {
    const { transactionNumber, status } = updateTransactionDto;

    // Validar que el estado proporcionado sea válido
    if (!Object.values(TransactionStatus).includes(status as TransactionStatus)) {
      throw new HttpException('Invalid transaction status', HttpStatus.BAD_REQUEST);
    }

    // Buscar la transacción por su número único
    const transaction = await this.transactionRepository.findByTransactionNumber(transactionNumber);
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    // Actualizar el estado de la transacción
    transaction.status = status;
    await this.transactionRepository.save(transaction);
    return transaction;
  }

  // Obtener todas las transacciones con productos asociados
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.findAll({ relations: ['product'] });
  }

  // Obtener una transacción por su ID
  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id, { relations: ['product'] });
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
    return transaction;
  }

  // Generar un número único para la transacción
  private generateTransactionNumber(): string {
    return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
