import { Injectable, BadRequestException } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { BaseService } from '../common/services/base.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookFilter } from '../common/interfaces/filter.interface';

@Injectable()
export class BooksService extends BaseService<
  Book,
  CreateBookDto,
  UpdateBookDto
> {
  protected entityName = 'Book';
  protected prismaDelegate = this.prisma.book;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly auditLogService: AuditLogService,
  ) {
    super(prisma, auditLogService);
  }

  async findAvailableBooks(filters: BookFilter = {}) {
    const enhancedFilters = {
      ...filters,
      availableCopies: { gt: 0 },
    };

    return this.findAll(enhancedFilters);
  }

  async updateStock(
    bookId: number,
    increment: number,
    userId?: number,
  ): Promise<Book> {
    const book = await this.findById(bookId);

    const newStock = book.availableCopies + increment;
    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock available');
    }

    return this.update(
      bookId,
      { availableCopies: newStock } as Partial<UpdateBookDto>,
      userId,
    );
  }

  protected buildWhereClause(filters: BookFilter): Record<string, any> {
    const where: Record<string, any> = {};

    if (filters.title) {
      where.title = { contains: filters.title, mode: 'insensitive' };
    }

    if (filters.author) {
      where.author = { contains: filters.author, mode: 'insensitive' };
    }

    if (filters.ISBN) {
      where.ISBN = filters.ISBN;
    }

    if (filters.isAvailable !== undefined) {
      where.availableCopies = filters.isAvailable ? { gt: 0 } : { equals: 0 };
    }

    return where;
  }
}
