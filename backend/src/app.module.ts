// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/interfaces/http/products.module';
import { TransactionsModule } from './modules/transactions/interfaces/http/transactions.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    // Configuramos la conexión a la base de datos
    TypeOrmModule.forRoot(databaseConfig),
    // Importamos nuestros módulos de la aplicación
    ProductsModule,
    TransactionsModule
  ]
})
export class AppModule {}