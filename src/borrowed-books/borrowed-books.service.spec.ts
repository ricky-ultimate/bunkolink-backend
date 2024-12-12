import { Test, TestingModule } from '@nestjs/testing';
import { BorrowedBooksService } from './borrowed-books.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BorrowedBooksService', () => {
  let service: BorrowedBooksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowedBooksService, PrismaService],
    }).compile();

    service = module.get<BorrowedBooksService>(BorrowedBooksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should borrow a book successfully', async () => {
    const book = { id: 1, title: 'NestJS Handbook', availableCopies: 5 };
    const student = { id: 1, name: 'John Doe', metricNumber: 'MT20231001' };

    // Mock `findUnique` to return a book
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(book as any);

    // Mock `create` for borrowedBook and `update` for book availability
    jest
      .spyOn(prisma.borrowedBook, 'create')
      .mockResolvedValue({ id: 1, bookId: 1, studentId: 1 } as any);
    jest
      .spyOn(prisma.book, 'update')
      .mockResolvedValue({ ...book, availableCopies: 4 } as any);

    // Mock $transaction to resolve the entire transaction
    jest.spyOn(prisma, '$transaction').mockResolvedValue([{}, {}]);

    await service.borrowBook(1, 1);

    expect(prisma.book.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.borrowedBook.create).toHaveBeenCalledTimes(1);
    expect(prisma.book.update).toHaveBeenCalledTimes(1);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if book is unavailable', async () => {
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValue({
      id: 1,
      title: 'Unavailable Book',
      availableCopies: 0,
    } as any);

    await expect(service.borrowBook(1, 1)).rejects.toThrow(
      'No copies of this book are currently available.',
    );
  });

  it('should return a book successfully', async () => {
    const book = { id: 1, title: 'NestJS Handbook', availableCopies: 5 };
    const borrowedBook = {
      id: 1,
      bookId: 1,
      studentId: 1,
      returnDate: null,
      book: book,
    };

    jest
      .spyOn(prisma.borrowedBook, 'findUnique')
      .mockResolvedValue(borrowedBook as any);
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(book as any);
    jest
      .spyOn(prisma.borrowedBook, 'update')
      .mockResolvedValue({ ...borrowedBook, returnDate: new Date() } as any);
    jest
      .spyOn(prisma.book, 'update')
      .mockResolvedValue({ ...book, availableCopies: 6 } as any);

    // Mocking $transaction to resolve the entire transaction as an array of promises
    jest.spyOn(prisma, '$transaction').mockResolvedValue([{}, {}]);

    await service.returnBook(1);

    expect(prisma.borrowedBook.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.borrowedBook.update).toHaveBeenCalledTimes(1);
    expect(prisma.book.update).toHaveBeenCalledTimes(1);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if borrowed book not found or already returned', async () => {
    jest.spyOn(prisma.borrowedBook, 'findUnique').mockResolvedValue(null);

    await expect(service.returnBook(1)).rejects.toThrow(
      'Borrowed record with ID 1 not found.',
    );
  });

  it('should list all borrowed books', async () => {
    const borrowedBooks = [
      { id: 1, bookId: 1, studentId: 1, returnDate: null },
      { id: 2, bookId: 2, studentId: 2, returnDate: null },
    ];

    jest
      .spyOn(prisma.borrowedBook, 'findMany')
      .mockResolvedValue(borrowedBooks as any);

    const result = await service.getAllBorrowedBooks();
    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual(1);
  });
});
