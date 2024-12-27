// backend/src/modules/transactions/domain/entities/transaction.entity.ts

// Importamos todo lo necesario de TypeORM
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// Importamos Product porque una transacción siempre tiene un producto asociado
import { Product } from '../../../products/domain/entities/products.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  // Número único para identificar la transacción
  // unique: true significa que no puede repetirse
  @Column({ unique: true })
  transactionNumber: string;

  // Relación con Product: una transacción tiene un producto
  // pero un producto puede estar en muchas transacciones
  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  // Monto total de la transacción
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  // Estado de la transacción (PENDING, COMPLETED, FAILED)
  @Column()
  status: string; 

  // Método de pago usado
  @Column()
  paymentMethod: string;

  // Detalles adicionales del pago
  // jsonb permite guardar objetos JSON
  // nullable: true significa que puede ser null
  @Column({ type: 'jsonb', nullable: true })
  paymentDetails: any;

  // Fecha de creación - se llena automáticamente
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Fecha de última actualización
  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}