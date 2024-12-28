// backend/src/entities/transaction.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity() // Indica que esta clase es una entidad de la base de datos
export class Transaction {
  @PrimaryGeneratedColumn() // Genera automáticamente un identificador único para cada registro
  id: number;

  @Column() // Almacena el número único de la transacción
  transactionNumber: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Almacena el monto total con precisión decimal
  amount: number;

  @Column() // Almacena el estado de la transacción (PENDING, COMPLETED, FAILED)
  status: string;

  @Column() // Método de pago asociado a la transacción (por ejemplo, CREDIT_CARD)
  paymentMethod: string;

  @Column({ nullable: true }) // Campo opcional para detalles del pago (puede ser null)
  paymentDetails: string;

  @ManyToOne(() => Product, (product) => product.transactions, { eager: true }) 
  // Relación con la entidad Producto. Cada transacción está asociada a un producto.
  product: Product;
}
