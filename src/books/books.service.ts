import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async createBook(title: string, availableCopies: number) {
    return this.prisma.book.create({
      data: { title, availableCopies },
    });
  }

  async getAllBooks() {
    return this.prisma.book.findMany();
  }

  async getBookById(id: number) {
    return this.prisma.book.findUnique({ where: { id } });
  }

  async updateBook(id: number, data: Partial<{ title: string; availableCopies: number }>) {
    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  async deleteBook(id: number) {
    return this.prisma.book.delete({ where: { id } });
  }
}
