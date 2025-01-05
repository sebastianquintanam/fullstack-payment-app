// Importaciones necesarias para las pruebas
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService, TransactionStatus } from './services/transactions.service'; 
import { TransactionRepository } from '../infrastructure/persistence/transaction.repository';
import { ProductsService } from '../../products/application/services/products.service';
import { CreateTransactionDto } from '../interfaces/dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../interfaces/dto/update-transaction.dto';

// Describe el grupo de pruebas
describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: TransactionRepository;
  let productsService: ProductsService;

  // Mock de TransactionRepository
  const mockTransactionRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByTransactionNumber: jest.fn(),
    updateStatus: jest.fn(),
    save: jest.fn(),
  };

  // Mock de ProductsService
  const mockProductsService = {
    getProductById: jest.fn(),
    updateProductStock: jest.fn(),
  };

  // Configuración del módulo de pruebas
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: TransactionRepository, useValue: mockTransactionRepository },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<TransactionRepository>(TransactionRepository);
    productsService = module.get<ProductsService>(ProductsService);
  });

  // Verifica que el servicio esté definido
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Prueba para crear una transacción
  it('should create a transaction', async () => {
    const createTransactionDto: CreateTransactionDto = { productId: 1, quantity: 2 };
    const mockProduct = { id: 1, price: 100, stock: 5 };
    const mockTransaction = {
      id: 1,
      status: TransactionStatus.PENDING,
      amount: 200,
      product: mockProduct,
      transactionNumber: 'TRX-123',
    };

    mockProductsService.getProductById.mockResolvedValue(mockProduct);
    mockProductsService.updateProductStock.mockResolvedValue(undefined);
    mockTransactionRepository.create.mockResolvedValue(mockTransaction);

    const result = await service.createTransaction(createTransactionDto);

    expect(result).toEqual(mockTransaction);
    expect(mockProductsService.getProductById).toHaveBeenCalledWith(1);
    expect(mockProductsService.updateProductStock).toHaveBeenCalledWith(1, -2);
    expect(mockTransactionRepository.create).toHaveBeenCalledWith(expect.any(Object));
  });

  // Prueba para actualizar el estado de una transacción
  it('should update transaction status and stock', async () => {
    const updateTransactionDto: UpdateTransactionStatusDto = {
      transactionNumber: 'TRX-123',
      status: TransactionStatus.COMPLETED,
    };

    const mockTransaction = {
      id: 1,
      status: TransactionStatus.PENDING,
      product: { id: 1, stock: 10 },
    };

    mockTransactionRepository.findByTransactionNumber.mockResolvedValue(mockTransaction);
    mockTransactionRepository.save.mockResolvedValue({
      ...mockTransaction,
      status: TransactionStatus.COMPLETED,
    });

    const result = await service.updateTransactionStatus(updateTransactionDto);

    expect(result.status).toBe(TransactionStatus.COMPLETED);
    expect(mockTransactionRepository.findByTransactionNumber).toHaveBeenCalledWith('TRX-123');
    expect(mockTransactionRepository.save).toHaveBeenCalledWith({
      ...mockTransaction,
      status: TransactionStatus.COMPLETED,
    });
  });

  // Prueba para error al buscar una transacción
  it('should throw an error if transaction is not found', async () => {
    const updateTransactionDto: UpdateTransactionStatusDto = {
      transactionNumber: 'TRX-999',
      status: TransactionStatus.COMPLETED,
    };

    mockTransactionRepository.findByTransactionNumber.mockResolvedValue(null);

    await expect(service.updateTransactionStatus(updateTransactionDto)).rejects.toThrowError(
      'Transaction not found'
    );

    expect(mockTransactionRepository.findByTransactionNumber).toHaveBeenCalledWith('TRX-999');
  });

  // Prueba para listar todas las transacciones
  it('should return all transactions', async () => {
    const mockTransactions = [
      { id: 1, status: TransactionStatus.PENDING, transactionNumber: 'TRX-123' },
      { id: 2, status: TransactionStatus.COMPLETED, transactionNumber: 'TRX-456' },
    ];

    mockTransactionRepository.findAll.mockResolvedValue(mockTransactions);

    const result = await service.getAllTransactions();

    expect(result).toEqual(mockTransactions);
    expect(mockTransactionRepository.findAll).toHaveBeenCalledTimes(1);
  });

  // Prueba para error al listar transacciones
  it('should throw an error if findAll fails', async () => {
    mockTransactionRepository.findAll.mockClear();
    mockTransactionRepository.findAll.mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    await expect(service.getAllTransactions()).rejects.toThrowError('Database error');
    expect(mockTransactionRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
