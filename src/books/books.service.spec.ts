import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BooksService', () => {
  let service: BooksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService, PrismaService],
    }).compile();

    service = module.get<BooksService>(BooksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book', async () => {
    const createBookSpy = jest.spyOn(prisma.book, 'create').mockResolvedValue({
      id: 1,
      title: 'NestJS Guide',
      availableCopies: 5,
    });

    const result = await service.createBook('NestJS Guide', 5);
    expect(createBookSpy).toHaveBeenCalledTimes(1);
    expect(result.title).toEqual('NestJS Guide');
  });

  it('should update a book', async () => {
    const updateBookSpy = jest.spyOn(prisma.book, 'update').mockResolvedValue({
      id: 1,
      title: 'Updated NestJS Guide',
      availableCopies: 10,
    });

    const result = await service.updateBook(1, {
      title: 'Updated NestJS Guide',
      availableCopies: 10,
    });
    expect(updateBookSpy).toHaveBeenCalledTimes(1);
    expect(result.title).toEqual('Updated NestJS Guide');
  });

  it('should fetch all books', async () => {
    const getAllBooksSpy = jest
      .spyOn(prisma.book, 'findMany')
      .mockResolvedValue([
        { id: 1, title: 'NestJS Guide', availableCopies: 5 },
        { id: 2, title: 'React Basics', availableCopies: 3 },
      ]);

    const result = await service.getAllBooks();
    expect(getAllBooksSpy).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('NestJS Guide');
    expect(result[1].title).toEqual('React Basics');
  });

  it('should fetch a book by ID', async () => {
    const getBookByIdSpy = jest
      .spyOn(prisma.book, 'findUnique')
      .mockResolvedValue({
        id: 1,
        title: 'NestJS Guide',
        availableCopies: 5,
      });

    const result = await service.getBookById(1);
    expect(getBookByIdSpy).toHaveBeenCalledTimes(1);
    expect(result.title).toEqual('NestJS Guide');
  });

  it('should return null when book is not found by ID', async () => {
    const getBookByIdSpy = jest
      .spyOn(prisma.book, 'findUnique')
      .mockResolvedValue(null);

    const result = await service.getBookById(999); // Non-existing ID
    expect(getBookByIdSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it('should delete a book', async () => {
    const deleteBookSpy = jest.spyOn(prisma.book, 'delete').mockResolvedValue({
      id: 1,
      title: 'NestJS Guide',
      availableCopies: 5,
    });

    const result = await service.deleteBook(1);
    expect(deleteBookSpy).toHaveBeenCalledTimes(1);
    expect(result.id).toEqual(1);
    expect(result.title).toEqual('NestJS Guide');
  });

  it('should return null when deleting a non-existing book', async () => {
    const deleteBookSpy = jest
      .spyOn(prisma.book, 'delete')
      .mockResolvedValue(null);

    const result = await service.deleteBook(999); // Non-existing ID
    expect(deleteBookSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });
});
