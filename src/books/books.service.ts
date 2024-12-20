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
      return await this.prisma.book.create({
        data: { title, author, ISBN, availableCopies },
      });
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
    return this.prisma.book.findMany();
  }

  async getBookById(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException(
        `Unable to fetch. Book with ID ${id} not found.`,
      );
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
      return await this.prisma.book.update({
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
      throw new BadRequestException(`Failed to update book with ID ${id}`);
    }
  }

  async deleteBook(id: number) {
    try {
      return await this.prisma.book.delete({ where: { id } });
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
