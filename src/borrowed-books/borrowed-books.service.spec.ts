import { Test, TestingModule } from '@nestjs/testing';
import { BorrowedBooksService } from './borrowed-books.service';

describe('BorrowedBooksService', () => {
  let service: BorrowedBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowedBooksService],
    }).compile();

    service = module.get<BorrowedBooksService>(BorrowedBooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
