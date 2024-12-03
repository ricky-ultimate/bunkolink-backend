import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BorrowedBooksService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(bookId: number, studentId: number) {
    // Check book availability
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.availableCopies < 1) {
      throw new Error('Book not available');
    }

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
  }

  async returnBook(borrowedBookId: number) {
    const borrowedBook = await this.prisma.borrowedBook.findUnique({
      where: { id: borrowedBookId },
      include: { book: true },
    });

    if (!borrowedBook || borrowedBook.returnDate) {
      throw new Error('Borrowed book not found or already returned');
    }

    // Return book and increment available copies
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
