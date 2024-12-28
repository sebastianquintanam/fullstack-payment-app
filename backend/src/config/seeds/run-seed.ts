// src/config/seeds/run-seed.ts

// Cargar variables de entorno
import 'dotenv/config';
// Importamos DataSource para interactuar con la base de datos
import { DataSource } from 'typeorm';
// Importamos los datos iniciales de productos
import { initialProducts } from './initial-products.seed';
// Importamos las entidades necesarias
import { Product } from '../../modules/products/domain/entities/products.entity';
import { Transaction } from '../../modules/transactions/domain/entities/transactions.entity';
import { User } from '../../entities/user.entity';

(async () => {
  console.log('🚀 Starting seed script...');
  
  // Configuración de la conexión a la base de datos
  const dataSource = new DataSource({
    type: 'postgres', // Tipo de base de datos
    host: process.env.DB_HOST, // Dirección de la base de datos
    port: Number(process.env.DB_PORT), // Puerto de la base de datos
    username: process.env.DB_USER, // Usuario de la base de datos
    password: process.env.DB_PASSWORD, // Contraseña de la base de datos
    database: process.env.DB_NAME, // Nombre de la base de datos
    entities: [Product, Transaction, User], // Entidades usadas en esta conexión
  });

  try {
    console.log('📦 Initializing database connection...');
    await dataSource.initialize(); // Inicializamos la conexión
    console.log('✅ Database connection established.');

    const productRepository = dataSource.getRepository(Product); // Obtenemos el repositorio para productos

    console.log('🛠️ Seeding initial products...');
    // Insertamos los productos iniciales
    await productRepository.save(initialProducts);

    console.log('✅ Products seeded successfully.');
  } catch (error) {
    console.error('❌ Error while seeding database:', error);

    // Verificar variables de entorno si ocurre un error
    console.log('🔍 Debugging environment variables:');
    console.log(`DB_HOST: ${process.env.DB_HOST}`);
    console.log(`DB_PORT: ${process.env.DB_PORT}`);
    console.log(`DB_USER: ${process.env.DB_USER}`);
    console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);
    console.log(`DB_NAME: ${process.env.DB_NAME}`);
  } finally {
    await dataSource.destroy(); // Cerramos la conexión a la base de datos
    console.log('🔒 Database connection closed.');
  }
})();
