import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionRepository } from '../../infrastructure/persistence/transaction.repository';
import { Transaction } from '../../domain/entities/transactions.entity';
import { ProductsService } from '../../../products/application/services/products.service';
import { CreateTransactionDto } from '../../interfaces/dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../../interfaces/dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository, // Repositorio de transacciones
    private readonly productsService: ProductsService // Servicio de productos
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { productId, quantity } = createTransactionDto;

    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (quantity > product.stock) {
      throw new HttpException('Insufficient stock for the requested quantity', HttpStatus.BAD_REQUEST);
    }

    await this.productsService.updateProductStock(productId, quantity);

    const transaction = {
      product,
      amount: product.price * quantity,
      status: 'PENDING',
      transactionNumber: this.generateTransactionNumber(),
      paymentMethod: 'CREDIT_CARD',
    };

    return this.transactionRepository.create(transaction);
  }

  async updateTransactionStatus(updateTransactionDto: UpdateTransactionStatusDto): Promise<Transaction> {
    const { transactionNumber, status } = updateTransactionDto;

    const validStatuses = ['PENDING', 'COMPLETED', 'FAILED'];
    if (!validStatuses.includes(status)) {
      throw new HttpException('Invalid transaction status', HttpStatus.BAD_REQUEST);
    }

    const transaction = await this.transactionRepository.findByTransactionNumber(transactionNumber);
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    if (status === 'COMPLETED') {
      await this.productsService.updateProductStock(transaction.product.id, 1);
    }

    return this.transactionRepository.updateStatus(transaction.id, status);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.findAll({ relations: ['product'] });
  }

  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id, { relations: ['product'] });
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
    return transaction;
  }

  private generateTransactionNumber(): string {
    return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
