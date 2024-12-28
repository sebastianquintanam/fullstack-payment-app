// backend/src/modules/transactions/domain/entities/transaction.entity.ts

// Importamos todo lo necesario de TypeORM
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// Importamos Product porque una transacción siempre tiene un producto asociado
import { Product } from '../../../products/domain/entities/products.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  // Número único para identificar la transacción
  @Column({ unique: true })
  transactionNumber: string;

  // Relación con Product: una transacción tiene un producto
  @ManyToOne(() => Product, (product) => product.transactions, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Monto total de la transacción
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  // Estado de la transacción (PENDING, COMPLETED, FAILED)
  @Column({ length: 20 })
  status: string; 

  // Método de pago usado
  @Column({ length: 30 })
  paymentMethod: string;

  // Detalles adicionales del pago (JSON)
  @Column({ type: 'jsonb', nullable: true })
  paymentDetails: any;

  // Fecha de creación - se llena automáticamente
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Fecha de última actualización
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
