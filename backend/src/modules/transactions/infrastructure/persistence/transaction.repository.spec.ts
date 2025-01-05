import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from '../../domain/entities/transactions.entity';

describe('TransactionRepository', () => {
    let repository: Repository<Transaction>;
    let transactionRepository: TransactionRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionRepository,
                {
                    provide: getRepositoryToken(Transaction),
                    useClass: Repository,
                },
            ],
        }).compile();

        repository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
        transactionRepository = module.get<TransactionRepository>(TransactionRepository);
    });

    it('should be defined', () => {
        expect(transactionRepository).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of transactions', async () => {
            const transactions = [new Transaction(), new Transaction()];
            jest.spyOn(repository, 'find').mockResolvedValue(transactions);

            expect(await transactionRepository.findAll()).toBe(transactions);
        });
    });

    describe('findById', () => {
        it('should return a transaction by ID', async () => {
            const transaction = new Transaction();
            jest.spyOn(repository, 'findOne').mockResolvedValue(transaction);

            expect(await transactionRepository.findById(1)).toBe(transaction);
        });
    });

    describe('findByTransactionNumber', () => {
        it('should return a transaction by transaction number', async () => {
            const transaction = new Transaction();
            jest.spyOn(repository, 'findOne').mockResolvedValue(transaction);

            expect(await transactionRepository.findByTransactionNumber('123')).toBe(transaction);
        });
    });

    describe('update', () => {
        it('should update and return the transaction', async () => {
            const transaction = new Transaction();
            jest.spyOn(repository, 'save').mockResolvedValue(transaction);

            expect(await transactionRepository.update(transaction)).toBe(transaction);
        });
    });

    describe('create', () => {
        it('should create and return a new transaction', async () => {
            const transaction = new Transaction();
            jest.spyOn(repository, 'create').mockReturnValue(transaction);
            jest.spyOn(repository, 'save').mockResolvedValue(transaction);

            expect(await transactionRepository.create(transaction)).toBe(transaction);
        });
    });

    describe('save', () => {
        it('should save and return the transaction', async () => {
            const transaction = new Transaction();
            jest.spyOn(repository, 'save').mockResolvedValue(transaction);

            expect(await transactionRepository.save(transaction)).toBe(transaction);
        });
    });

    describe('findAll', () => {
        it('should return an empty array if no transactions exist', async () => {
          jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
          const result = await repository.find();
          expect(result).toEqual([]);
          expect(repository.find).toHaveBeenCalledTimes(1);
        });
      });
      
      describe('save', () => {
        it('should throw an error if save fails', async () => {
          jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error('Error saving transaction: Database error'));
          const transaction = { amount: 500 } as Partial<Transaction>;
          await expect(repository.save(transaction)).rejects.toThrow('Error saving transaction: Database error');
        });
      });
      
});