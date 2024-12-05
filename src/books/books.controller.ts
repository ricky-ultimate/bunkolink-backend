import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('v1/books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  async createBook(
    @Body()
    body: {
      title: string;
      author: string;
      ISBN: string;
      availableCopies: number;
    },
  ) {
    return this.booksService.createBook(
      body.title,
      body.author,
      body.ISBN,
      body.availableCopies,
    );
  }

  @Get()
  async getAllBooks() {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    return this.booksService.getBookById(+id);
  }

  @Patch(':id')
  async updateBook(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      title: string;
      author: string;
      ISBN: string;
      availableCopies: number;
    }>,
  ) {
    return this.booksService.updateBook(+id, body);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return this.booksService.deleteBook(+id);
  }
}
