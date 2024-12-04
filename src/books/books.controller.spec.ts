import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            createBook: jest
              .fn()
              .mockResolvedValue({
                id: 1,
                title: 'NestJS Guide',
                availableCopies: 5,
              }),
            getAllBooks: jest
              .fn()
              .mockResolvedValue([
                { id: 1, title: 'NestJS Guide', availableCopies: 5 },
              ]),
            getBookById: jest
              .fn()
              .mockResolvedValue({
                id: 1,
                title: 'NestJS Guide',
                availableCopies: 5,
              }),
            updateBook: jest
              .fn()
              .mockResolvedValue({
                id: 1,
                title: 'Updated NestJS Guide',
                availableCopies: 10,
              }),
            deleteBook: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a book', async () => {
    const result = await controller.createBook({
      title: 'NestJS Guide',
      availableCopies: 5,
    });
    expect(result.title).toEqual('NestJS Guide');
    expect(result.availableCopies).toEqual(5);
  });

  it('should fetch all books', async () => {
    const result = await controller.getAllBooks();
    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('NestJS Guide');
  });

  it('should fetch a book by ID', async () => {
    const result = await controller.getBookById('1');
    expect(result.title).toEqual('NestJS Guide');
    expect(result.availableCopies).toEqual(5);
  });

  it('should update a book', async () => {
    const result = await controller.updateBook('1', {
      title: 'Updated NestJS Guide',
      availableCopies: 10,
    });
    expect(result.title).toEqual('Updated NestJS Guide');
    expect(result.availableCopies).toEqual(10);
  });

  it('should delete a book', async () => {
    const result = await controller.deleteBook('1');
    expect(result.id).toEqual(1);
  });

  it('should handle non-existent book for getBookById', async () => {
    jest.spyOn(service, 'getBookById').mockResolvedValue(null);

    const result = await controller.getBookById('999'); // Non-existent ID
    expect(result).toBeNull();
  });

  it('should handle non-existent book for deleteBook', async () => {
    jest.spyOn(service, 'deleteBook').mockResolvedValue(null);

    const result = await controller.deleteBook('999'); // Non-existent ID
    expect(result).toBeNull();
  });

  it('should handle empty database for getAllBooks', async () => {
    jest.spyOn(service, 'getAllBooks').mockResolvedValue([]);

    const result = await controller.getAllBooks();
    expect(result).toHaveLength(0); // Empty array expected
  });
});
