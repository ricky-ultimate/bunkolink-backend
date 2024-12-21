import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async createBook(
    title: string,
    author: string,
    ISBN: string,
    availableCopies: number,
  ) {
    try {
      const book = await this.prisma.book.create({
        data: { title, author, ISBN, availableCopies },
      });
      await this.auditLogService.logAction(
        'CREATE',
        'Book',
        book.id,
        `Book created with title: ${title}, ISBN: ${ISBN}`,
      );
      return book;
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        throw new ConflictException(
          `Duplicate book creation attempted: ISBN ${ISBN}`,
        );
      }
      throw new BadRequestException(`Failed to create book with ISBN ${ISBN}`);
    }
  }

  async getAllBooks() {
    const books = await this.prisma.book.findMany();
    await this.auditLogService.logAction(
      'FETCH_ALL',
      'Book',
      0,
      'Fetched all books',
    );
    return books;
  }

  async getBookById(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException(
        `Unable to fetch. Book with ID ${id} not found.`,
      );
    }
    await this.auditLogService.logAction(
      'FETCH',
      'Book',
      id,
      `Fetched book with ID: ${id}`,
    );
    return book;
  }

  async updateBook(
    id: number,
    data: Partial<{
      title: string;
      author: string;
      ISBN: string;
      availableCopies: number;
    }>,
  ) {
    try {
      const updatedBook = await this.prisma.book.update({
        where: { id },
        data,
      });
      await this.auditLogService.logAction(
        'UPDATE',
        'Book',
        id,
        `Book with ID: ${id} updated`,
      );
      return updatedBook;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Unable to update. Book with ID ${id} not found.`,
        );
      }
      throw new BadRequestException(`Failed to update book with ID ${id}`);
    }
  }

  async deleteBook(id: number) {
    try {
      const deletedBook = await this.prisma.book.delete({ where: { id } });
      await this.auditLogService.logAction(
        'DELETE',
        'Book',
        id,
        `Book with ID: ${id} deleted`,
      );
      return deletedBook;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Unable to delete. Book with ID ${id} not found.`,
        );
      }
      throw new BadRequestException(`Failed to delete book with ID ${id}`);
    }
  }
}
