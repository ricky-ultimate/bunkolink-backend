import { Test, TestingModule } from '@nestjs/testing';
import { BorrowedBooksController } from './borrowed-books.controller';
import { BorrowedBooksService } from './borrowed-books.service';

describe('BorrowedBooksController', () => {
  let controller: BorrowedBooksController;
  let service: BorrowedBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowedBooksController],
      providers: [
        {
          provide: BorrowedBooksService,
          useValue: {
            borrowBook: jest.fn().mockResolvedValue({ success: true }),
            returnBook: jest.fn().mockResolvedValue({ success: true }),
            getAllBorrowedBooks: jest
              .fn()
              .mockResolvedValue([
                { id: 1, bookId: 1, studentId: 1, returnDate: null },
                { id: 2, bookId: 2, studentId: 2, returnDate: null },
              ]),
          },
        },
      ],
    }).compile();

    controller = module.get<BorrowedBooksController>(BorrowedBooksController);
    service = module.get<BorrowedBooksService>(BorrowedBooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('borrowBook', () => {
    it('should borrow a book successfully', async () => {
      const body = { bookId: 1, studentId: 1 };
      const result = await controller.borrowBook(body);

      expect(service.borrowBook).toHaveBeenCalledWith(1, 1);
      expect(service.borrowBook).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: true });
    });
  });

  describe('returnBook', () => {
    it('should return a book successfully', async () => {
      const result = await controller.returnBook('1');

      expect(service.returnBook).toHaveBeenCalledWith(1);
      expect(service.returnBook).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: true });
    });
  });

  describe('getAllBorrowedBooks', () => {
    it('should list all borrowed books', async () => {
      const result = await controller.getAllBorrowedBooks();

      expect(service.getAllBorrowedBooks).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0].id).toEqual(1);
      expect(result[1].id).toEqual(2);
    });
  });
});
