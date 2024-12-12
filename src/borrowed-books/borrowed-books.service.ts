import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BorrowedBooksService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(bookId: number, studentId: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found.`);
    }
    if (book.availableCopies < 1) {
      throw new BadRequestException(
        'No copies of this book are currently available.',
      );
    }

    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    try {
      // Borrow book and decrement available copies
      await this.prisma.$transaction([
        this.prisma.borrowedBook.create({
          data: { bookId, studentId },
        }),
        this.prisma.book.update({
          where: { id: bookId },
          data: { availableCopies: book.availableCopies - 1 },
        }),
      ]);
    } catch (error) {
      throw new BadRequestException('Error borrowing the book.');
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
      throw new BadRequestException('This book has already been returned.');
    }

    try {
      await this.prisma.$transaction([
        this.prisma.borrowedBook.update({
          where: { id: borrowedBookId },
          data: { returnDate: new Date() },
        }),
        this.prisma.book.update({
          where: { id: borrowedBook.bookId },
          data: { availableCopies: borrowedBook.book.availableCopies + 1 },
        }),
      ]);
    } catch (error) {
      throw new BadRequestException('Error returning the book.');
    }
  }

  async getAllBorrowedBooks() {
    return this.prisma.borrowedBook.findMany({
      include: {
        book: true,
        student: true,
      },
    });
  }
}
