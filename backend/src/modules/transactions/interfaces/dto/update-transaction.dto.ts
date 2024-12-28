// backend/src/modules/transactions/interfaces/dto/update-transaction-status.dto.ts

export class UpdateTransactionStatusDto {
    transactionNumber: string; // Número único de la transacción
    status: string;            // Nuevo estado de la transacción (e.g., COMPLETED, FAILED)
  }
  