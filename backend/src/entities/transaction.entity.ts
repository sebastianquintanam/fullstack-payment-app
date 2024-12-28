import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: string;

  @Column()
  paymentMethod: string;

  @ManyToOne(() => Product, (product) => product.transactions, { eager: true })
  product: Product;
}
