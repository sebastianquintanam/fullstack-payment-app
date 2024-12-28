import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionRepository } from '../../infrastructure/persistence/transaction.repository';
import { Transaction } from '../../domain/entities/transactions.entity';
import { ProductsService } from '../../../products/application/services/products.service';
import { CreateTransactionDto } from '../../interfaces/dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../../interfaces/dto/update-transaction.dto';

// Enumeración para los estados válidos de una transacción
export enum TransactionStatus {
  PENDING = 'PENDING', // Transacción pendiente de ser completada
  COMPLETED = 'COMPLETED', // Transacción completada exitosamente
  FAILED = 'FAILED', // Transacción fallida
}

@Injectable()
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
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND); // Lanza error 404 si no existe
    }

    // Verificar si hay suficiente stock del producto
    if (quantity > product.stock) {
      throw new HttpException('Insufficient stock for the requested quantity', HttpStatus.BAD_REQUEST); // Error 400 si no hay stock suficiente
    }

    // Actualizar el stock del producto restando la cantidad comprada
    await this.productsService.updateProductStock(productId, -quantity);

    // Crear los datos de la nueva transacción
    const transaction = this.transactionRepository.create({
      product, // Producto asociado a la transacción
      amount: product.price * quantity, // Total calculado como precio * cantidad
      status: TransactionStatus.PENDING, // Estado inicial de la transacción
      transactionNumber: this.generateTransactionNumber(), // Número único de la transacción
      paymentMethod: 'CREDIT_CARD', // Método de pago (fijo por ahora)
    });

    return transaction; // Devuelve la transacción creada
  }

  /**
   * Actualiza el estado de una transacción
   * @param updateTransactionDto Datos necesarios para actualizar el estado de la transacción
   * @returns La transacción con el estado actualizado
   * @throws HttpException Si el estado no es válido o la transacción no existe
   */
  async updateTransactionStatus(updateTransactionDto: UpdateTransactionStatusDto): Promise<Transaction> {
    const { transactionNumber, status } = updateTransactionDto;

    // Validar si el estado proporcionado es válido
    if (!Object.values(TransactionStatus).includes(status as TransactionStatus)) {
      throw new HttpException('Invalid transaction status', HttpStatus.BAD_REQUEST); // Error 400 si el estado no es válido
    }

    // Buscar la transacción por su número único
    const transaction = await this.transactionRepository.findByTransactionNumber(transactionNumber);
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND); // Error 404 si la transacción no existe
    }

    // Actualizar el estado de la transacción
    transaction.status = status;

    return this.transactionRepository.update(transaction); // Devuelve la transacción actualizada
  }

  /**
   * Obtiene todas las transacciones con sus productos asociados
   * @returns Una lista de transacciones
   */
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.findAll({ relations: ['product'] }); // Incluye la relación con el producto
  }

  /**
   * Obtiene una transacción por su ID
   * @param id ID de la transacción
   * @returns La transacción encontrada
   * @throws HttpException Si la transacción no existe
   */
  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id, { relations: ['product'] });
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND); // Error 404 si la transacción no existe
    }
    return transaction; // Devuelve la transacción encontrada
  }

  /**
   * Genera un número único para la transacción
   * @returns Un número único en formato TRX-{timestamp}-{random}
   */
  private generateTransactionNumber(): string {
    return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // Combina el timestamp actual y un número aleatorio
  }
}
