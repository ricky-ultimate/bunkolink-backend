import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { BorrowedBooksService } from './borrowed-books.service';

@Controller('v1/borrowed-books')
export class BorrowedBooksController {
  constructor(private borrowedBooksService: BorrowedBooksService) {}

  @Post('borrow')
  async borrowBook(@Body() body: { bookId: number; studentId: number }) {
    return this.borrowedBooksService.borrowBook(body.bookId, body.studentId);
  }

  @Post('return/:id')
  async returnBook(@Param('id') id: string) {
    return this.borrowedBooksService.returnBook(+id);
  }

  @Get()
  async getAllBorrowedBooks() {
    return this.borrowedBooksService.getAllBorrowedBooks();
  }
}
