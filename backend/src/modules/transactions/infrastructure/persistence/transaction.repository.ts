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

  // Buscar transacción por número de transacción con relaciones
  async findByTransactionNumber(transactionNumber: string, options?: { relations: string[] }): Promise<Transaction | undefined> {
    return this.repository.findOne({ where: { transactionNumber }, relations: options?.relations || [] });
  }

  // Actualizar estado de la transacción
  async updateStatus(id: number, status: string): Promise<Transaction> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  // Crear una nueva transacción
  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.repository.create(transaction);
    return this.repository.save(newTransaction);
  }
}
