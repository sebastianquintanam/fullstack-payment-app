// backend/src/modules/products/domain/entities/product.entity.ts

// Importamos los decoradores necesarios de TypeORM
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// Importamos la entidad Transaction para definir la relación
import { Transaction } from '../../../transactions/domain/entities/transactions.entity';

// @Entity() le dice a TypeORM que esta clase es una tabla en la base de datos
@Entity()
export class Product {
  // @PrimaryGeneratedColumn() crea una columna ID que se auto-incrementa
  @PrimaryGeneratedColumn()
  id: number;

  // @Column() define una columna simple en la tabla
  @Column()
  name: string;

  // Usamos decimal para el precio para manejar los centavos correctamente
  // precision: 10 significa que puede tener hasta 10 dígitos en total
  // scale: 2 significa que 2 de esos dígitos son decimales
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  // Columna para la descripción del producto
  @Column()
  description: string;

  // Columna para controlar el inventario disponible
  @Column()
  stock: number;

  // Relación inversa con Transaction: un producto puede estar en muchas transacciones
  // @OneToMany establece una relación uno-a-muchos
  // El primer argumento es la entidad relacionada (Transaction)
  // El segundo argumento es la propiedad en Transaction que apunta a Product
  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions: Transaction[];
}
