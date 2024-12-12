import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async createBook(
    title: string,
    author: string,
    ISBN: string,
    availableCopies: number,
  ) {
    try {
      return this.prisma.book.create({
        data: { title, author, ISBN, availableCopies },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        throw new ConflictException('A book with this ISBN already exists.');
      }
      throw new BadRequestException('Error creating the book.');
    }
  }

  async getAllBooks() {
    return this.prisma.book.findMany();
  }

  async getBookById(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found.`);
    }
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
      return this.prisma.book.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma "Record to update not found"
        throw new NotFoundException(
          `Unable to update. Book with ID ${id} not found.`,
        );
      }
      throw new BadRequestException('Error updating the book.');
    }
  }

  async deleteBook(id: number) {
    try {
      return this.prisma.book.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Unable to delete. Book with ID ${id} not found.`,
        );
      }
      throw new BadRequestException('Error deleting the book.');
    }
  }
}
