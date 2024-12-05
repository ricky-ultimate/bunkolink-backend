import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Controller('v1/borrowed-books')
export class BorrowedBooksController {
  constructor(private borrowedBooksService: BorrowedBooksService) {}

  @Post('borrow')
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowedBooksService.borrowBook(
      borrowBookDto.bookId,
      borrowBookDto.studentId,
    );
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
