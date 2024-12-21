import { Test, TestingModule } from '@nestjs/testing';
import { BorrowedBooksService } from './borrowed-books.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BorrowedBooksService', () => {
  let service: BorrowedBooksService;
  let prisma: PrismaService;
  let auditLogService: AuditLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowedBooksService,
        PrismaService,
        {
          provide: AuditLogService,
          useValue: {
            logAction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BorrowedBooksService>(BorrowedBooksService);
    prisma = module.get<PrismaService>(PrismaService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should borrow a book successfully', async () => {
    const book = { id: 1, title: 'NestJS Handbook', availableCopies: 5 };
    const student = { id: 1, name: 'John Doe', matricNumber: 'MT20231001' };

    // Mock book and student queries
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValueOnce(book as any);
    jest
      .spyOn(prisma.student, 'findUnique')
      .mockResolvedValueOnce(student as any);

    // Mock $transaction for borrowing book
    jest.spyOn(prisma, '$transaction').mockResolvedValueOnce([{}, {}]);

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    await service.borrowBook(1, 1);

    expect(prisma.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.student.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(auditLogSpy).toHaveBeenCalledWith(
      'BORROW',
      'BorrowedBook',
      1,
      'Student with ID 1 borrowed book with ID 1',
    );
  });

  it('should throw an error if book is not found', async () => {
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValueOnce(null);

    await expect(service.borrowBook(1, 1)).rejects.toThrow(
      new NotFoundException('Unable to borrow. Book with ID 1 not found.'),
    );
  });

  it('should throw an error if no copies are available', async () => {
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValueOnce({
      id: 1,
      title: 'NestJS Handbook',
      availableCopies: 0,
    } as any);

    await expect(service.borrowBook(1, 1)).rejects.toThrow(
      new BadRequestException(
        'Unable to borrow. Book with ID: 1 has no available copies',
      ),
    );
  });

  it('should throw an error if student is not found', async () => {
    const book = { id: 1, title: 'NestJS Handbook', availableCopies: 5 };
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValueOnce(book as any);
    jest.spyOn(prisma.student, 'findUnique').mockResolvedValueOnce(null);

    await expect(service.borrowBook(1, 1)).rejects.toThrow(
      new NotFoundException(
        'Unable to borrow book with ID: 1. Student with ID 1 not found.',
      ),
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
      .mockResolvedValueOnce(borrowedBook as any);

    // Mock $transaction for returning book
    jest.spyOn(prisma, '$transaction').mockResolvedValueOnce([{}, {}]);

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    await service.returnBook(1);

    expect(prisma.borrowedBook.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { book: true },
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(auditLogSpy).toHaveBeenCalledWith(
      'RETURN',
      'BorrowedBook',
      1,
      'Book with ID 1 returned by borrowed record ID 1',
    );
  });

  it('should throw an error if borrowed book record is not found', async () => {
    jest.spyOn(prisma.borrowedBook, 'findUnique').mockResolvedValueOnce(null);

    await expect(service.returnBook(1)).rejects.toThrow(
      new NotFoundException('Borrowed record with ID 1 not found.'),
    );
  });

  it('should throw an error if book is already returned', async () => {
    jest.spyOn(prisma.borrowedBook, 'findUnique').mockResolvedValueOnce({
      id: 1,
      returnDate: new Date(), // Book already returned
    } as any);

    await expect(service.returnBook(1)).rejects.toThrow(
      new BadRequestException('Borrowed book with ID 1 already returned.'),
    );
  });

  it('should list all borrowed books', async () => {
    const borrowedBooks = [
      { id: 1, bookId: 1, studentId: 1, returnDate: null },
      { id: 2, bookId: 2, studentId: 2, returnDate: null },
    ];

    jest
      .spyOn(prisma.borrowedBook, 'findMany')
      .mockResolvedValueOnce(borrowedBooks as any);

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    const result = await service.getAllBorrowedBooks();

    expect(prisma.borrowedBook.findMany).toHaveBeenCalledTimes(1);
    expect(auditLogSpy).toHaveBeenCalledWith(
      'FETCH_ALL',
      'BorrowedBook',
      0,
      'Fetched all borrowed book records',
    );
    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual(1);
  });
});
