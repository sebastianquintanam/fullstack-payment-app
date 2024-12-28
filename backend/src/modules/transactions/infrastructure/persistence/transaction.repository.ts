import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transactions.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>
  ) {}

  // Obtener todas las transacciones con relaciones
  async findAll(options?: { relations: string[] }): Promise<Transaction[]> {
    return this.repository.find({ relations: options?.relations || [] });
  }

  // Buscar transacción por ID con relaciones
  async findById(id: number, options?: { relations: string[] }): Promise<Transaction | undefined> {
    return this.repository.findOne({ where: { id }, relations: options?.relations || [] });
  }

  // Buscar transacción por número de transacción
  async findByTransactionNumber(transactionNumber: string): Promise<Transaction | undefined> {
    return this.repository.findOne({ where: { transactionNumber } });
  }

  // Actualizar una transacción completa
  async update(transaction: Transaction): Promise<Transaction> {
    await this.repository.save(transaction); // TypeORM guarda la transacción con las actualizaciones
    return transaction; // Devuelve la transacción actualizada
  }

  // Crear una nueva transacción
  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.repository.create(transaction);
    return this.repository.save(newTransaction); // Guarda y retorna la transacción creada
  }
}
