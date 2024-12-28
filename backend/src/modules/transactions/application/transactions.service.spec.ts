// Importaciones actualizadas
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './services/transactions.service';
import { TransactionRepository } from '../../transactions/infrastructure/persistence/transaction.repository';
import { ProductsService } from '../../products/application/services/products.service'; // Añadido

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: TransactionRepository;
  let productsService: ProductsService; // Añadido

  // Mock del TransactionRepository (mantenido)
  const mockTransactionRepository = {
    createTransaction: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(), // Añadido si lo necesitas
  };

  // Añadido: Mock de ProductsService
  const mockProductsService = {
    getProductById: jest.fn(),
    updateProductStock: jest.fn(),
    getAllProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionRepository,
          useValue: mockTransactionRepository,
        },
        // Añadido: Provider para ProductsService
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<TransactionRepository>(TransactionRepository);
    productsService = module.get<ProductsService>(ProductsService); // Añadido
  });

  // Tus tests actuales...

  // Añadir nuevos tests para métodos que usan ProductsService
  it('should create a transaction', async () => {
    const mockProduct = {
      id: 1,
      price: 100,
      stock: 5,
    };

    const mockTransaction = {
      id: 1,
      status: 'PENDING',
      amount: 100,
    };

    mockProductsService.getProductById.mockResolvedValue(mockProduct);
    mockTransactionRepository.createTransaction.mockResolvedValue(mockTransaction);

    const result = await service.createTransaction(1, 1);
    expect(result).toEqual(mockTransaction);
  });

  it('should update transaction status and stock', async () => {
    const mockTransaction = {
      id: 1,
      status: 'PENDING',
      productId: 1,
    };

    mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
    mockTransactionRepository.updateStatus.mockResolvedValue({
      ...mockTransaction,
      status: 'COMPLETED',
    });

    const result = await service.updateTransactionStatus('1', 'COMPLETED');
    expect(result.status).toBe('COMPLETED');
  });
});