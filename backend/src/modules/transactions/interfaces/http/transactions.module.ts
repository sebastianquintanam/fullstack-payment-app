// backend/src/modules/transactions/interfaces/http/transactions.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../../application/services/transactions.service';
import { TransactionRepository } from '../../infrastructure/persistence/transaction.repository';
import { Transaction } from '../../domain/entities/transactions.entity';
import { ProductsModule } from '../../../products/interfaces/http/products.module';

@Module({
  // Importamos TypeOrmModule y ProductsModule porque lo necesitamos
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ProductsModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionRepository],
  exports: [TransactionsService]
})
export class TransactionsModule {}