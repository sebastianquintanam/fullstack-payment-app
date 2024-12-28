import { IsNotEmpty, IsEnum } from 'class-validator';
import { TransactionStatus } from '../../application/services/transactions.service'; // Asegúrate de tener este import

export class UpdateTransactionStatusDto {
  @IsNotEmpty() // Valida que el campo no esté vacío
  transactionNumber: string; // Número único de la transacción

  @IsNotEmpty() // Valida que el campo no esté vacío
  @IsEnum(TransactionStatus, { message: 'Invalid status value' }) // Valida que sea uno de los valores permitidos en TransactionStatus
  status: TransactionStatus; // Nuevo estado de la transacción (e.g., COMPLETED, FAILED)
}
