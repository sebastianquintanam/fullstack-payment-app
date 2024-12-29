// src/modules/transactions/interfaces/dto/update-transaction.dto.ts

import { IsNotEmpty, IsEnum } from 'class-validator';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum.ts';

export class UpdateTransactionStatusDto {
    @IsNotEmpty()
    status: TransactionStatus;

    // Removemos la validación de transactionNumber porque viene por params
    transactionNumber?: string;
}