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

  // Función para crear una nueva transacción cuando alguien compra
  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.repository.create(transaction);
    return this.repository.save(newTransaction);
  }

  // Función para actualizar el estado de una transacción (cuando se completa o falla)
  async updateStatus(id: number, status: string): Promise<Transaction> {
    await this.repository.update(id, { status });
    return this.repository.findOne({ where: { id } });
  }

  // Función para buscar una transacción por su número
  async findByTransactionNumber(transactionNumber: string): Promise<Transaction> {
    return this.repository.findOne({ 
      where: { transactionNumber },
      relations: ['product'] // Esto nos trae también la info del producto
    });
  }

  // Función para obtener todas las transacciones
  async findAll(): Promise<Transaction[]> {
    return this.repository.find({
      relations: ['product'], // Incluimos los productos relacionados
    });
  }

  // Función para buscar una transacción por su ID
  async findById(id: number): Promise<Transaction | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['product'], // Incluimos los productos relacionados
    });
  }
}
