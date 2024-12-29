import { 
    Controller, 
    Post, 
    Get,  
    Body, 
    Param, 
    Put, 
    BadRequestException, 
    InternalServerErrorException,
    NotFoundException  
} from '@nestjs/common';
import { TransactionsService } from '../../application/services/transactions.service';


@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    // Tus endpoints actuales...

    /**
     * GET /transactions - Get all transactions
     * @returns List of all transactions
     * @throws InternalServerErrorException If transactions cannot be retrieved
     */
    @Get()
    async getAllTransactions() {
        try {
            return await this.transactionsService.getAllTransactions();
        } catch (error) {
            console.error('Error while getting transactions:', error.message);
            throw new InternalServerErrorException('Failed to retrieve transactions.');
        }
    }

    /**
     * GET /transactions/:id - Get a specific transaction
     * @param id Transaction ID
     * @returns The requested transaction
     * @throws NotFoundException If the transaction is not found
     * @throws InternalServerErrorException If the transaction cannot be retrieved
     */
    @Get(':id')
    async getTransactionById(@Param('id') id: string) {
        try {
            const transaction = await this.transactionsService.getTransactionById(Number(id));
            if (!transaction) {
                throw new NotFoundException(`Transaction with ID ${id} not found.`);
            }
            return transaction;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error while getting transaction:', error.message);
            throw new InternalServerErrorException('Failed to retrieve transaction.');
        }
    }
}