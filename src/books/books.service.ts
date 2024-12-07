import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
      throw new NotFoundException(
        `Unable to update. Book with ID ${id} not found.`,
      );
    }
  }

  async deleteBook(id: number) {
    try {
      return this.prisma.book.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(
        `Unable to delete. Book with ID ${id} not found.`,
      );
    }
  }
}
