// backend/src/modules/transactions/application/services/transactions.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionRepository } from '../../infrastructure/persistence/transaction.repository';
import { Transaction } from '../../domain/entities/transactions.entity';
import { ProductsService } from '../../../products/application/services/products.service';
import { CreateTransactionDto } from '../../interfaces/dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../../interfaces/dto/update-transaction.dto';

// Enumeración de estados válidos para las transacciones
export enum TransactionStatus {
  PENDING = 'PENDING', // Transacción pendiente de procesamiento
  COMPLETED = 'COMPLETED', // Transacción completada exitosamente
  FAILED = 'FAILED', // Transacción fallida
}

@Injectable() // Marca esta clase como un servicio inyectable en el ecosistema de NestJS
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository, // Repositorio para interactuar con la base de datos de transacciones
    private readonly productsService: ProductsService // Servicio para manejar operaciones relacionadas con productos
  ) {}

  /**
   * Crea una nueva transacción
   * @param createTransactionDto Datos necesarios para crear la transacción
   * @returns La transacción creada
   * @throws HttpException Si el producto no existe o no hay stock suficiente
   */
  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { productId, quantity } = createTransactionDto;

    // Verificar si el producto existe
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND); // Lanza un error 404 si el producto no existe
    }

    // Verificar si hay stock suficiente
    if (quantity > product.stock) {
      throw new HttpException('Insufficient stock for the requested quantity', HttpStatus.BAD_REQUEST); // Error 400 si no hay suficiente stock
    }

    // Actualizar el stock del producto restando la cantidad comprada
    await this.productsService.updateProductStock(productId, -quantity);

    // Crear una nueva transacción
    const transaction = this.transactionRepository.create({
      product, // Producto asociado
      amount: product.price * quantity, // Calcular el monto total (precio * cantidad)
      status: TransactionStatus.PENDING, // Estado inicial: PENDING
      transactionNumber: this.generateTransactionNumber(), // Generar un número único de transacción
      paymentMethod: 'CREDIT_CARD', // Método de pago (por ahora fijo)
      paymentDetails: `Payment processed for ${quantity} units of ${product.name}`, // Detalles adicionales del pago
    });

    return transaction; // Retorna la transacción creada
  }

  /**
   * Actualiza el estado de una transacción existente
   * @param updateTransactionDto DTO con datos para actualizar el estado
   * @returns La transacción actualizada
   * @throws HttpException Si la transacción no existe o el estado es inválido
   */
  async updateTransactionStatus(updateTransactionDto: UpdateTransactionStatusDto): Promise<Transaction> {
    const { transactionNumber, status } = updateTransactionDto;

    // Validar que el estado proporcionado sea válido
    if (!Object.values(TransactionStatus).includes(status as TransactionStatus)) {
      throw new HttpException('Invalid transaction status', HttpStatus.BAD_REQUEST); // Error 400 si el estado no es válido
    }

    // Buscar la transacción por su número único
    const transaction = await this.transactionRepository.findByTransactionNumber(transactionNumber);
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND); // Error 404 si no existe
    }

    // Actualizar el estado de la transacción
    transaction.status = status;

    return this.transactionRepository.update(transaction); // Guardar los cambios en la base de datos
  }

  /**
   * Obtiene todas las transacciones con sus productos asociados
   * @returns Lista de transacciones
   */
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.findAll({ relations: ['product'] }); // Retorna todas las transacciones y sus productos asociados
  }

  /**
   * Obtiene una transacción por su ID
   * @param id ID de la transacción
   * @returns Transacción encontrada
   * @throws HttpException Si la transacción no existe
   */
  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id, { relations: ['product'] });
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND); // Error 404 si no existe
    }
    return transaction;
  }

  /**
   * Genera un número único para la transacción
   * @returns Un número único en formato TRX-{timestamp}-{random}
   */
  private generateTransactionNumber(): string {
    return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // Combina timestamp actual y número aleatorio
  }
}
