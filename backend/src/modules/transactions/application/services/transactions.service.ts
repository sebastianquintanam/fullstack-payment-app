// backend/src/modules/transactions/application/services/transactions.service.ts

import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../infrastructure/persistence/transaction.repository';
import { Transaction } from '../../domain/entities/transactions.entity';
import { ProductsService } from '../../../products/application/services/products.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly productsService: ProductsService
  ) {}

  // Crear una nueva transacción cuando inicia una compra
  async createTransaction(productId: number, quantity: number): Promise<Transaction> {
    // Primero verificamos el producto y su precio
    const product = await this.productsService.getProductById(productId);
    
    // Creamos la transacción con estado PENDING
    const transaction = {
      product: product,
      amount: product.price * quantity,
      status: 'PENDING',
      transactionNumber: this.generateTransactionNumber(),
      paymentMethod: 'CREDIT_CARD'
    };

    return this.transactionRepository.create(transaction);
  }

  // Actualizar el estado de una transacción
  async updateTransactionStatus(transactionNumber: string, status: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findByTransactionNumber(transactionNumber);
    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    // Si la transacción se completa, actualizamos el stock
    if (status === 'COMPLETED') {
      await this.productsService.updateProductStock(transaction.product.id, 1);
    }

    return this.transactionRepository.updateStatus(transaction.id, status);
  }

  // Obtener todas las transacciones
  async getAllTransactions(): Promise<Transaction[]> {
    // Llama al repositorio para obtener todas las transacciones
    return this.transactionRepository.findAll();
  }

  // Obtener una transacción por ID
  async getTransactionById(id: number): Promise<Transaction> {
    // Busca una transacción por ID
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found'); // Lanza un error si no existe
    }
    return transaction;
  }

  // Generar un número único para la transacción
  private generateTransactionNumber(): string {
    return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
