// backend/src/modules/transactions/interfaces/http/transactions.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importamos TypeOrm para la interacción con la base de datos
import { TransactionsController } from './transactions.controller'; // Controlador para manejar las rutas de transacciones
import { TransactionsService } from '../../application/services/transactions.service'; // Servicio de lógica de transacciones
import { TransactionRepository } from '../../infrastructure/persistence/transaction.repository'; // Repositorio de transacciones
import { Transaction } from '../../domain/entities/transactions.entity'; // Entidad Transaction
import { ProductsModule } from '../../../products/interfaces/http/products.module'; // Módulo de productos para manejar dependencias

@Module({
  // Importamos los módulos necesarios
  imports: [
    TypeOrmModule.forFeature([Transaction]), // Habilitamos la entidad Transaction para TypeORM
    ProductsModule, // Importamos el módulo de productos para usar sus servicios
  ],
  // Declaramos los controladores que manejarán las rutas
  controllers: [TransactionsController],
  // Proveedores del módulo
  providers: [
    TransactionsService, // Servicio que contiene la lógica de las transacciones
    TransactionRepository, // Repositorio para interactuar con la base de datos
  ],
  // Exportamos el servicio para que otros módulos puedan usarlo si es necesario
  exports: [TransactionsService],
})
export class TransactionsModule {}