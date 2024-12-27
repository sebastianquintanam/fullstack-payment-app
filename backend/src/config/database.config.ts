// database.config.ts
// Configuración para conectar nuestra aplicación con PostgreSQL
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../modules/products/domain/entities/products.entity';
import { Transaction } from '../modules/transactions/domain/entities/transactions.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  // Configuración para PostgreSQL
  type: 'postgres',
  host: 'localhost',    // Servidor de la base de datos
  port: 5432,          // Puerto por defecto de PostgreSQL
  username: 'postgres', // Usuario de la base de datos
  password: 'postgres', // Contraseña
  database: 'payment_app_db', // Nombre de la base de datos

  // Lista de entidades que usaremos
  entities: [Product, Transaction],

  // Actualiza automáticamente la base de datos
  // Nota: Solo para desarrollo
  synchronize: true,
};