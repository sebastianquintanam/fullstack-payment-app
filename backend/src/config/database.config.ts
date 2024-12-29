// backend/src/config/database.config.ts

// Configuración para conectar nuestra aplicación con PostgreSQL
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Product } from '../modules/products/domain/entities/products.entity';
import { Transaction } from '../modules/transactions/domain/entities/transactions.entity';

// Esta configuración le dice a TypeORM cómo conectarse a nuestra base de datos
export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  // Configuración para PostgreSQL
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get('DB_USER', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_NAME', 'payment_app_db'),
  entities: [Product, Transaction],
  synchronize: true, 
  logging: true // Para ver las consultas SQL en consola
});