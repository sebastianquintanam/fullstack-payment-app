// backend/src/modules/transactions/interfaces/dto/create-transaction.dto.ts

import { IsInt, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  // Validamos que productId sea un número entero positivo
  @IsInt({ message: 'The productId must be an integer.' })
  @IsPositive({ message: 'The productId must be a positive number.' })
  productId: number; // ID del producto

  // Validamos que quantity sea un número entero positivo
  @IsInt({ message: 'The quantity must be an integer.' })
  @IsPositive({ message: 'The quantity must be a positive number.' })
  quantity: number;  // Cantidad de productos
}
