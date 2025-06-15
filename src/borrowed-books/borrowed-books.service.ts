import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BorrowedBook } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { BorrowedBookFilter } from '../common/interfaces/filter.interface';

@Injectable()
export class BorrowedBooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async borrowBook(
    bookId: number,
    studentId: number,
    userId?: number,
  ): Promise<BorrowedBook> {
    return this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book) {
        throw new NotFoundException(`Book with ID ${bookId} not found`);
      }

      if (book.availableCopies < 1) {
        throw new BadRequestException(
          `Book "${book.title}" has no available copies`,
        );
      }

      const student = await tx.student.findUnique({ where: { id: studentId } });
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      const existingBorrow = await tx.borrowedBook.findFirst({
        where: {
          bookId,
          studentId,
          returnDate: null,
        },
      });

      if (existingBorrow) {
        throw new BadRequestException(`Student already has this book borrowed`);
      }

      const borrowedBook = await tx.borrowedBook.create({
        data: { bookId, studentId },
        include: {
          book: true,
          student: true,
        },
      });

      await tx.book.update({
        where: { id: bookId },
        data: { availableCopies: book.availableCopies - 1 },
      });

      await this.auditLogService.logAction(
        'BORROW',
        'BorrowedBook',
        borrowedBook.id,
        `Student ${student.name} (${student.matricNumber}) borrowed "${book.title}"`,
        userId,
      );

      return borrowedBook;
    });
  }

  async returnBook(
    borrowedBookId: number,
    userId?: number,
  ): Promise<BorrowedBook> {
    return this.prisma.$transaction(async (tx) => {
      const borrowedBook = await tx.borrowedBook.findUnique({
        where: { id: borrowedBookId },
        include: { book: true, student: true },
      });

      if (!borrowedBook) {
        throw new NotFoundException(
          `Borrowed book record with ID ${borrowedBookId} not found`,
        );
      }

      if (borrowedBook.returnDate) {
        throw new BadRequestException(`Book has already been returned`);
      }

      const updatedBorrow = await tx.borrowedBook.update({
        where: { id: borrowedBookId },
        data: { returnDate: new Date() },
        include: { book: true, student: true },
      });

      await tx.book.update({
        where: { id: borrowedBook.bookId },
        data: { availableCopies: borrowedBook.book.availableCopies + 1 },
      });

      await this.auditLogService.logAction(
        'RETURN',
        'BorrowedBook',
        borrowedBookId,
        `Student ${borrowedBook.student.name} returned "${borrowedBook.book.title}"`,
        userId,
      );

      return updatedBorrow;
    });
  }

  async findAll(filters: BorrowedBookFilter = {}) {
    const where = this.buildWhereClause(filters);

    const borrowedBooks = await this.prisma.borrowedBook.findMany({
      where,
      include: {
        book: true,
        student: true,
      },
      orderBy: { borrowDate: 'desc' },
    });

    await this.auditLogService.logAction(
      'FETCH_ALL',
      'BorrowedBook',
      0,
      `Fetched ${borrowedBooks.length} borrowed book records`,
    );

    return borrowedBooks;
  }

  async getOverdueBooks(dueDays: number = 14) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() - dueDays);

    return this.prisma.borrowedBook.findMany({
      where: {
        returnDate: null,
        borrowDate: { lt: dueDate },
      },
      include: {
        book: true,
        student: true,
      },
    });
  }

  private buildWhereClause(filters: BorrowedBookFilter): Record<string, any> {
    const where: Record<string, any> = {};

    if (filters.borrowDate) {
      const date = new Date(filters.borrowDate);
      where.borrowDate = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    if (filters.isReturned !== undefined) {
      where.returnDate = filters.isReturned ? { not: null } : null;
    }

    if (filters.studentName) {
      where.student = {
        name: { contains: filters.studentName, mode: 'insensitive' },
      };
    }

    if (filters.studentMatricNo) {
      where.student = {
        ...where.student,
        matricNumber: {
          contains: filters.studentMatricNo,
          mode: 'insensitive',
        },
      };
    }

    if (filters.title) {
      where.book = {
        title: { contains: filters.title, mode: 'insensitive' },
      };
    }

    if (filters.ISBN) {
      where.book = {
        ISBN: { contains: filters.ISBN },
      };
    }

    if (filters.author) {
      where.book = {
        author: { contains: filters.author, mode: 'insensitive' },
      };
    }

    return where;
  }
}
