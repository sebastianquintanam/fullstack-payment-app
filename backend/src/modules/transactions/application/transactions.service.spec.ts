// Importaciones necesarias para las pruebas
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService, TransactionStatus } from './services/transactions.service'; // Importamos TransactionStatus
import { TransactionRepository } from '../../transactions/infrastructure/persistence/transaction.repository';
import { ProductsService } from '../../products/application/services/products.service';
import { CreateTransactionDto } from '../../transactions/interfaces/dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../../transactions/interfaces/dto/update-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService; // Servicio que estamos probando
  let repository: TransactionRepository; // Repositorio de transacciones mockeado
  let productsService: ProductsService; // Servicio de productos mockeado

  // Mock de TransactionRepository con los métodos que utiliza el servicio
  const mockTransactionRepository = {
    create: jest.fn(), // Simula la creación de una transacción
    findAll: jest.fn(), // Simula la búsqueda de todas las transacciones
    findByTransactionNumber: jest.fn(), // Simula la búsqueda de una transacción por número
    updateStatus: jest.fn(), // Simula la actualización del estado de una transacción
    save: jest.fn(), // Simula el guardado del estado de una transacción
  };

  // Mock de ProductsService con los métodos que utiliza el servicio
  const mockProductsService = {
    getProductById: jest.fn(), // Simula la obtención de un producto por su ID
    updateProductStock: jest.fn(), // Simula la actualización del stock de un producto
  };

  // Antes de cada prueba, configuramos un módulo de pruebas
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService, // Proveedor del servicio que probamos
        {
          provide: TransactionRepository, // Simula el repositorio con el mock
          useValue: mockTransactionRepository,
        },
        {
          provide: ProductsService, // Simula el servicio de productos con el mock
          useValue: mockProductsService,
        },
      ],
    }).compile();

    // Obtenemos instancias del servicio y los mocks
    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<TransactionRepository>(TransactionRepository);
    productsService = module.get<ProductsService>(ProductsService);
  });

  /**
   * Prueba para crear una transacción
   */
  it('should create a transaction', async () => {
    // DTO de entrada para la transacción
    const createTransactionDto: CreateTransactionDto = {
      productId: 1,
      quantity: 2,
    };

    // Datos simulados del producto
    const mockProduct = {
      id: 1,
      price: 100,
      stock: 5,
    };

    // Datos simulados de la transacción creada
    const mockTransaction = {
      id: 1,
      status: TransactionStatus.PENDING, // Cambiado para usar la enumeración
      amount: 200, // 2 * 100
      product: mockProduct,
      transactionNumber: 'TRX-123',
    };

    // Configuración del mock para simular comportamientos
    mockProductsService.getProductById.mockResolvedValue(mockProduct);
    mockProductsService.updateProductStock.mockResolvedValue(undefined);
    mockTransactionRepository.create.mockResolvedValue(mockTransaction);

    // Llamada al método del servicio
    const result = await service.createTransaction(createTransactionDto);

    // Validaciones
    expect(result).toEqual(mockTransaction); // Verifica que el resultado sea correcto
    expect(mockProductsService.getProductById).toHaveBeenCalledWith(1); // Verifica que se llamó al servicio con el ID correcto
    expect(mockTransactionRepository.create).toHaveBeenCalledWith(expect.any(Object)); // Verifica que se creó la transacción
  });

  /**
   * Prueba para actualizar el estado de una transacción
   */
  it('should update transaction status and stock', async () => {
    // DTO de entrada para actualizar la transacción
    const updateTransactionDto: UpdateTransactionStatusDto = {
      transactionNumber: 'TRX-123',
      status: TransactionStatus.COMPLETED, // Cambiado para usar la enumeración
    };

    // Datos simulados de la transacción actual
    const mockTransaction = {
      id: 1,
      status: TransactionStatus.PENDING, // Cambiado para usar la enumeración
      product: {
        id: 1,
        stock: 10,
      },
    };

    // Configuración del mock para simular comportamientos
    mockTransactionRepository.findByTransactionNumber.mockResolvedValue(mockTransaction);
    mockTransactionRepository.save.mockResolvedValue({
      ...mockTransaction,
      status: TransactionStatus.COMPLETED, // Cambiado para usar la enumeración
    });

    // Llamada al método del servicio
    const result = await service.updateTransactionStatus(updateTransactionDto);

    // Validaciones
    expect(result.status).toBe(TransactionStatus.COMPLETED); // Verifica que el estado sea COMPLETED
    expect(mockTransactionRepository.findByTransactionNumber).toHaveBeenCalledWith('TRX-123'); // Verifica que se buscó por el número correcto
    expect(mockTransactionRepository.save).toHaveBeenCalledWith(expect.any(Object)); // Verifica que se guardó la transacción actualizada
  });

  // Pruebas adicionales
  it('addional testing', async () => {
    // DTO de entrada para actualizar la transacción
    const updateTransactionDto: UpdateTransactionStatusDto = {
      transactionNumber: 'TRX-123',
      status: TransactionStatus.COMPLETED, // Cambiado para usar la enumeración
    };

    // Datos simulados de la transacción actual
    const mockTransaction = {
      id: 1,
      status: TransactionStatus.PENDING, // Cambiado para usar la enumeración
      product: {
        id: 1,
        stock: 10,
      },
    };

    // Configuración del mock para simular comportamientos
    mockTransactionRepository.findByTransactionNumber.mockResolvedValue(null);
    
    // Validaciones
    try {
      await service.updateTransactionStatus(updateTransactionDto);
    } catch (error) { // Verifica que se lanzó una excepción
      expect(error.message).toBe('Transaction not found');
    }

    expect(mockTransactionRepository.findByTransactionNumber).toHaveBeenCalledWith('TRX-123'); // Verifica que se buscó por el número correcto
    
  });
});
