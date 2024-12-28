// backend/src/modules/transactions/infrastructure/persistence/transaction.repository.ts

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transactions.entity';

@Injectable() // Marca esta clase como un proveedor inyectable
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction> // Repositorio TypeORM para manejar transacciones
  ) {}

  async findAll(options?: { relations: string[] }): Promise<Transaction[]> {
    return this.repository.find({ relations: options?.relations || [] });
  }

  async findById(id: number, options?: { relations: string[] }): Promise<Transaction | undefined> {
    return this.repository.findOne({ where: { id }, relations: options?.relations || [] });
  }

  async findByTransactionNumber(transactionNumber: string, options?: { relations: string[] }): Promise<Transaction | undefined> {
    return this.repository.findOne({ where: { transactionNumber }, relations: options?.relations || [] });
  }

  async update(transaction: Transaction): Promise<Transaction> {
    await this.repository.save(transaction); // Actualiza el registro
    return transaction;
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.repository.create(transaction);
    return this.repository.save(newTransaction);
  }
}
