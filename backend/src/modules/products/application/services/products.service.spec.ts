// Importamos las herramientas necesarias para pruebas unitarias en NestJS
import { Test, TestingModule } from '@nestjs/testing'; // Proporciona utilidades para crear módulos de prueba
import { ProductsService } from './products.service'; // Servicio que estamos probando
import { ProductRepository } from '../../infrastructure/persistence/product.repository'; // Repositorio simulado (mock)
import { Product } from '../../domain/entities/products.entity'; // Entidad Product

// Describe el grupo de pruebas para el servicio ProductsService
describe('ProductsService', () => {
  let service: ProductsService; // Instancia del servicio a probar
  let mockProductRepository: Partial<ProductRepository>; // Repositorio simulado (mock)

  /**
   * Configuración inicial para cada test.
   * Utilizamos `beforeEach` para crear un nuevo módulo de prueba antes de cada caso de prueba.
   */
  beforeEach(async () => {
    // Creamos un mock del ProductRepository con funciones simuladas
    mockProductRepository = {
      findAll: jest.fn(), // Simula el método findAll
      findById: jest.fn(), // Simula el método findById
      updateStock: jest.fn(), // Simula el método updateStock
      save: jest.fn(), // Simula el método save
    };

    // Creamos un módulo de prueba para inyectar dependencias
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService, // Proveedor del servicio que estamos probando
        { provide: ProductRepository, useValue: mockProductRepository }, // Proveemos el mock en lugar del repositorio real
      ],
    }).compile(); // Compilamos el módulo de prueba

    // Obtenemos una instancia del servicio desde el módulo
    service = module.get<ProductsService>(ProductsService);
  });

  /**
   * Prueba básica para verificar que el servicio se ha creado correctamente.
   */
  it('should be defined', () => {
    expect(service).toBeDefined(); // Verificamos que el servicio no sea undefined
  });

  /**
   * Prueba para verificar que getAllProducts retorne todos los productos.
   */
  it('should return all products', async () => {
    // Creamos un mock de productos simulados
    const mockProducts: Product[] = [
      { id: 1, name: 'Product A', price: 100, stock: 50 } as Product,
      { id: 2, name: 'Product B', price: 200, stock: 30 } as Product,
    ];

    // Configuramos el mock del método findAll para que retorne los productos simulados
    jest.spyOn(mockProductRepository, 'findAll').mockResolvedValue(mockProducts);

    // Llamamos al método del servicio
    const result = await service.getAllProducts();

    // Verificamos que el resultado sea igual a los productos simulados
    expect(result).toEqual(mockProducts);
    // Verificamos que el método findAll fue llamado exactamente una vez
    expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
  });

  /**
   * Prueba para verificar que getProductById retorne un producto específico.
   */
  it('should return a product by ID', async () => {
    // Creamos un producto simulado
    const mockProduct: Product = { id: 1, name: 'Product A', price: 100, stock: 50 } as Product;

    // Configuramos el mock del método findById para que retorne el producto simulado
    jest.spyOn(mockProductRepository, 'findById').mockResolvedValue(mockProduct);

    // Llamamos al método del servicio con el ID del producto
    const result = await service.getProductById(1);

    // Verificamos que el resultado sea igual al producto simulado
    expect(result).toEqual(mockProduct);
    // Verificamos que el método findById fue llamado con el ID correcto
    expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
  });

  /**
   * Prueba para verificar que getProductById arroje un error si el producto no existe.
   */
  it('should throw an error if product not found', async () => {
    // Configuramos el mock del método findById para que retorne null (producto no encontrado)
    jest.spyOn(mockProductRepository, 'findById').mockResolvedValue(null);

    // Verificamos que el método arroje un error con el mensaje esperado
    await expect(service.getProductById(999)).rejects.toThrowError('Producto no encontrado');
  });

  /**
   * Prueba para verificar que updateProductStock actualice correctamente el stock.
   */
  it('should update product stock if enough stock exists', async () => {
    // Creamos un producto simulado
    const mockProduct: Product = { id: 1, name: 'Product A', price: 100, stock: 50 } as Product;

    // Configuramos el mock de findById y updateStock
    jest.spyOn(mockProductRepository, 'findById').mockResolvedValue(mockProduct);
    jest.spyOn(mockProductRepository, 'updateStock').mockResolvedValue({ ...mockProduct, stock: 45 });

    // Llamamos al método del servicio para actualizar el stock
    const result = await service.updateProductStock(1, 5);

    // Verificamos que el stock se actualizó correctamente
    expect(result.stock).toBe(45);
    // Verificamos que updateStock fue llamado con los valores correctos
    expect(mockProductRepository.updateStock).toHaveBeenCalledWith(1, 45);
  });

  /**
   * Prueba para verificar que updateProductStock arroje un error si no hay suficiente stock.
   */
  it('should throw an error if stock is insufficient', async () => {
    // Creamos un producto simulado con stock insuficiente
    const mockProduct: Product = { id: 1, name: 'Product A', price: 100, stock: 3 } as Product;

    // Configuramos el mock de findById
    jest.spyOn(mockProductRepository, 'findById').mockResolvedValue(mockProduct);

    // Verificamos que el método arroje un error con el mensaje esperado
    await expect(service.updateProductStock(1, 5)).rejects.toThrowError('No hay suficiente stock');
  });
});
