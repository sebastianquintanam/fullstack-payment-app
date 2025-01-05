// backend/src/modules/products/infrastructure/persistence/product.repository.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from './product.repository';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/products.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let mockRepository: Repository<Product>;

  const mockProduct = {
    id: 1,
    name: 'Product A',
    price: 100,
    stock: 50,
  } as Product;

  const mockProducts = [
    { id: 1, name: 'Product A', price: 100, stock: 50 },
    { id: 2, name: 'Product B', price: 200, stock: 30 },
  ] as Product[];

  beforeEach(async () => {
    const mockRepositoryProvider = {
      provide: getRepositoryToken(Product),
      useValue: {
        find: jest.fn().mockResolvedValue(mockProducts),
        findOne: jest.fn().mockResolvedValue(mockProduct),
        create: jest.fn().mockImplementation((product) => product),
        save: jest.fn().mockResolvedValue(mockProduct),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRepository, mockRepositoryProvider],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
    mockRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const result = await repository.findAll();
      expect(result).toEqual(mockProducts);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if findAll fails', async () => {
      jest.spyOn(mockRepository, 'find').mockRejectedValueOnce(new Error('Database error'));
      await expect(repository.findAll()).rejects.toThrowError('Database error');
    });
  });

  describe('findById', () => {
    it('should return a product by ID', async () => {
      const result = await repository.findById(1);
      expect(result).toEqual(mockProduct);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if no product is found', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(null);
      const result = await repository.findById(999);
      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should throw an error if findById fails', async () => {
      jest.spyOn(mockRepository, 'findOne').mockRejectedValueOnce(new Error('Database error'));
      await expect(repository.findById(1)).rejects.toThrowError('Database error');
    });
  });

  describe('save', () => {
    it('should save a new product', async () => {
      const newProduct = { name: 'Product C', price: 150, stock: 20 } as Partial<Product>;
      const result = await repository.save(newProduct);
      expect(result).toEqual(mockProduct);
      expect(mockRepository.create).toHaveBeenCalledWith(newProduct);
      expect(mockRepository.save).toHaveBeenCalledWith(newProduct);
    });

    it('should throw an error if save fails', async () => {
      const newProduct = { name: 'Product C', price: 150, stock: 20 } as Partial<Product>;
      jest.spyOn(mockRepository, 'save').mockRejectedValueOnce(new Error('Save error'));
      await expect(repository.save(newProduct)).rejects.toThrowError('Save error');
    });
  });

  describe('updateStock', () => {
    it('should update the stock of a product', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(mockProduct);
      await repository.updateStock(1, 40);
      expect(mockRepository.update).toHaveBeenCalledWith(1, { stock: 40 });
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if product not found in updateStock', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      await expect(repository.updateStock(1, 40)).rejects.toThrowError('Product not found');
    });

    it('should throw an error if update fails', async () => {
        jest.spyOn(repository, 'findById').mockResolvedValue(mockProduct);
        jest.spyOn(mockRepository, 'update').mockRejectedValueOnce(new Error('Update error'));
        await expect(repository.updateStock(1, 40)).rejects.toThrowError('Update error');
      });
  });
});