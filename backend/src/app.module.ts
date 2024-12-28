// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { ProductsModule } from './modules/products/interfaces/http/products.module';
import { TransactionsModule } from './modules/transactions/interfaces/http/transactions.module';

@Module({
  imports: [
    // Configuramos las variables de entorno primero
    ConfigModule.forRoot({
      isGlobal: true, // Para usar en toda la app
    }),

    // Configuramos TypeORM usando nuestras variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Importamos nuestros módulos
    ProductsModule,
    TransactionsModule,
  ],
})
export class AppModule {}