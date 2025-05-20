import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  // Runs before each test in this describe block
  beforeEach(async () => {
    // Create a testing module and compile it
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService], // Provide the ProductsService for testing
    }).compile();

    // Get an instance of ProductsService from the testing module
    service = module.get<ProductsService>(ProductsService);
  });

  // Test case: service should be defined after module compilation
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
