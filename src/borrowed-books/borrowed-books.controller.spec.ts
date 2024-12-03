import { Test, TestingModule } from '@nestjs/testing';
import { BorrowedBooksController } from './borrowed-books.controller';

describe('BorrowedBooksController', () => {
  let controller: BorrowedBooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowedBooksController],
    }).compile();

    controller = module.get<BorrowedBooksController>(BorrowedBooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
