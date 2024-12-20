import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';

@Injectable()
export class BorrowedBooksService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async borrowBook(bookId: number, studentId: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(
        `Unable to borrow. Book with ID ${bookId} not found.`,
      );
    }
    if (book.availableCopies < 1) {
      throw new BadRequestException(
        `Unable to borrow. Book with ID: ${bookId} has no available copies`,
      );
    }

    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(
        `Unable to borrow book with ID: ${bookId}. Student with ID ${studentId} not found.`,
      );
    }

    try {
      // Borrow book and decrement available copies
      const borrow = await this.prisma.$transaction([
        this.prisma.borrowedBook.create({
          data: { bookId, studentId },
        }),
        this.prisma.book.update({
          where: { id: bookId },
          data: { availableCopies: book.availableCopies - 1 },
        }),
      ]);

      await this.auditLogService.logAction(
        'BORROW',
        'BorrowedBook',
        bookId,
        `Student with ID ${studentId} borrowed book with ID ${bookId}`,
      );
      return borrow;
    } catch (error) {
      throw new BadRequestException(
        `Failed to borrow book with ID: ${bookId} for student ID: ${studentId}`,
      );
    }
  }

  async returnBook(borrowedBookId: number) {
    const borrowedBook = await this.prisma.borrowedBook.findUnique({
      where: { id: borrowedBookId },
      include: { book: true },
    });

    if (!borrowedBook) {
      throw new NotFoundException(
        `Borrowed record with ID ${borrowedBookId} not found.`,
      );
    }
    if (borrowedBook.returnDate) {
      throw new BadRequestException(
        `Borrowed book with ID ${borrowedBookId} already returned.`,
      );
    }

    try {
      const result = await this.prisma.$transaction([
        this.prisma.borrowedBook.update({
          where: { id: borrowedBookId },
          data: { returnDate: new Date() },
        }),
        this.prisma.book.update({
          where: { id: borrowedBook.bookId },
          data: { availableCopies: borrowedBook.book.availableCopies + 1 },
        }),
      ]);

      await this.auditLogService.logAction(
        'RETURN',
        'BorrowedBook',
        borrowedBookId,
        `Book with ID ${borrowedBook.bookId} returned by borrowed record ID ${borrowedBookId}`,
      );
      return result;
    } catch (error) {
      throw new BadRequestException(
        `Failed to return book with ID: ${borrowedBookId}`,
      );
    }
  }

  async getAllBorrowedBooks() {
    const borrowedBooks = await this.prisma.borrowedBook.findMany({
      include: {
        book: true,
        student: true,
      },
    });

    await this.auditLogService.logAction(
      'FETCH_ALL',
      'BorrowedBook',
      0,
      'Fetched all borrowed book records',
    );
    return borrowedBooks;
  }
}
