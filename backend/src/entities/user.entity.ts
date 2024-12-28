import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Nombre de la tabla en la base de datos
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;
}
