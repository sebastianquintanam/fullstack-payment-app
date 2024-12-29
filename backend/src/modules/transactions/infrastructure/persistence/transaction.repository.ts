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

  /**
   * Obtiene todas las transacciones con relaciones opcionales
   * @param options Opciones para incluir relaciones
   * @returns Lista de transacciones
   */
  async findAll(options?: { relations: string[] }): Promise<Transaction[]> {
    return this.repository.find({ relations: options?.relations || [] });
  }

  /**
   * Busca una transacción por ID con relaciones opcionales
   * @param id ID de la transacción
   * @param options Opciones para incluir relaciones
   * @returns Transacción encontrada o undefined
   */
  async findById(id: number, options?: { relations: string[] }): Promise<Transaction | undefined> {
    return this.repository.findOne({ where: { id }, relations: options?.relations || [] });
  }

  /**
   * Busca una transacción por su número único con relaciones opcionales
   * @param transactionNumber Número único de la transacción
   * @param options Opciones para incluir relaciones
   * @returns Transacción encontrada o undefined
   */
  async findByTransactionNumber(transactionNumber: string, options?: { relations: string[] }): Promise<Transaction | undefined> {
    return this.repository.findOne({ where: { transactionNumber }, relations: options?.relations || [] });
  }

  /**
   * Actualiza una transacción existente
   * @param transaction Transacción a actualizar
   * @returns Transacción actualizada
   */
  async update(transaction: Transaction): Promise<Transaction> {
    const updatedTransaction = await this.repository.save(transaction); // Guarda los cambios en la base de datos
    return updatedTransaction; // Retorna la transacción actualizada
  }

  /**
   * Crea una nueva transacción
   * @param transaction Datos parciales para crear la transacción
   * @returns Transacción creada
   */
  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.repository.create(transaction); // Crea una nueva instancia
    return this.repository.save(newTransaction); // Guarda la nueva transacción en la base de datos
  }

  // Guardar o actualizar una transacción
  async save(transaction: Partial<Transaction>): Promise<Transaction> {
    return this.repository.save(transaction);
  }
}
