import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let prisma: PrismaService;
  let auditLogService: AuditLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        PrismaService,
        {
          provide: AuditLogService,
          useValue: {
            logAction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    prisma = module.get<PrismaService>(PrismaService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book', async () => {
    const createBookSpy = jest.spyOn(prisma.book, 'create').mockResolvedValue({
      id: 1,
      title: 'NestJS Guide',
      author: 'John Doe',
      ISBN: '123456789',
      availableCopies: 5,
    });

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    const result = await service.createBook(
      'NestJS Guide',
      'John Doe',
      '123456789',
      5,
    );

    expect(createBookSpy).toHaveBeenCalledTimes(1);
    expect(createBookSpy).toHaveBeenCalledWith({
      data: {
        title: 'NestJS Guide',
        author: 'John Doe',
        ISBN: '123456789',
        availableCopies: 5,
      },
    });

    expect(auditLogSpy).toHaveBeenCalledWith(
      'CREATE',
      'Book',
      1,
      'Book created with title: NestJS Guide, ISBN: 123456789',
    );
    expect(result.title).toEqual('NestJS Guide');
  });

  it('should throw a conflict exception when creating a duplicate book', async () => {
    jest.spyOn(prisma.book, 'create').mockRejectedValue({ code: 'P2002' });

    await expect(
      service.createBook('NestJS Guide', 'John Doe', '123456789', 5),
    ).rejects.toThrow(
      new ConflictException(
        'Duplicate book creation attempted: ISBN 123456789',
      ),
    );
  });

  it('should fetch all books', async () => {
    const getAllBooksSpy = jest
      .spyOn(prisma.book, 'findMany')
      .mockResolvedValue([
        {
          id: 1,
          title: 'NestJS Guide',
          author: 'John Doe',
          ISBN: '123456789',
          availableCopies: 5,
        },
        {
          id: 2,
          title: 'React Basics',
          author: 'Jane Smith',
          ISBN: '987654321',
          availableCopies: 3,
        },
      ]);

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    const result = await service.getAllBooks();

    expect(getAllBooksSpy).toHaveBeenCalledTimes(1);
    expect(auditLogSpy).toHaveBeenCalledWith(
      'FETCH_ALL',
      'Book',
      0,
      'Fetched all books',
    );
    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('NestJS Guide');
    expect(result[1].author).toEqual('Jane Smith');
  });

  it('should fetch a book by ID', async () => {
    const getBookByIdSpy = jest
      .spyOn(prisma.book, 'findUnique')
      .mockResolvedValue({
        id: 1,
        title: 'NestJS Guide',
        author: 'John Doe',
        ISBN: '123456789',
        availableCopies: 5,
      });

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    const result = await service.getBookById(1);

    expect(getBookByIdSpy).toHaveBeenCalledTimes(1);
    expect(getBookByIdSpy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(auditLogSpy).toHaveBeenCalledWith(
      'FETCH',
      'Book',
      1,
      'Fetched book with ID: 1',
    );
    expect(result.title).toEqual('NestJS Guide');
  });

  it('should throw a not found exception when book is not found by ID', async () => {
    jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(null);

    await expect(service.getBookById(999)).rejects.toThrow(
      new NotFoundException('Unable to fetch. Book with ID 999 not found.'),
    );
  });

  it('should update a book', async () => {
    const updateBookSpy = jest.spyOn(prisma.book, 'update').mockResolvedValue({
      id: 1,
      title: 'Updated NestJS Guide',
      author: 'Jane Doe',
      ISBN: '987654321',
      availableCopies: 10,
    });

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    const result = await service.updateBook(1, {
      title: 'Updated NestJS Guide',
      author: 'Jane Doe',
      ISBN: '987654321',
      availableCopies: 10,
    });

    expect(updateBookSpy).toHaveBeenCalledTimes(1);
    expect(updateBookSpy).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        title: 'Updated NestJS Guide',
        author: 'Jane Doe',
        ISBN: '987654321',
        availableCopies: 10,
      },
    });

    expect(auditLogSpy).toHaveBeenCalledWith(
      'UPDATE',
      'Book',
      1,
      'Book with ID: 1 updated',
    );
    expect(result.title).toEqual('Updated NestJS Guide');
  });

  it('should throw a not found exception when updating a non-existent book', async () => {
    jest.spyOn(prisma.book, 'update').mockRejectedValue({ code: 'P2025' });

    await expect(
      service.updateBook(999, { title: 'Non-Existent Book' }),
    ).rejects.toThrow(
      new NotFoundException('Unable to update. Book with ID 999 not found.'),
    );
  });

  it('should delete a book', async () => {
    const deleteBookSpy = jest.spyOn(prisma.book, 'delete').mockResolvedValue({
      id: 1,
      title: 'NestJS Guide',
      author: 'John Doe',
      ISBN: '123456789',
      availableCopies: 5,
    });

    const auditLogSpy = jest
      .spyOn(auditLogService, 'logAction')
      .mockResolvedValue(undefined);

    const result = await service.deleteBook(1);

    expect(deleteBookSpy).toHaveBeenCalledTimes(1);
    expect(deleteBookSpy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(auditLogSpy).toHaveBeenCalledWith(
      'DELETE',
      'Book',
      1,
      'Book with ID: 1 deleted',
    );
    expect(result.title).toEqual('NestJS Guide');
  });

  it('should throw a not found exception when deleting a non-existent book', async () => {
    jest.spyOn(prisma.book, 'delete').mockRejectedValue({ code: 'P2025' });

    await expect(service.deleteBook(999)).rejects.toThrow(
      new NotFoundException('Unable to delete. Book with ID 999 not found.'),
    );
  });
});
