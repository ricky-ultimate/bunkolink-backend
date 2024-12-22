import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Borrowed Books')
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
  async getAllBorrowedBooks(
    @Query('borrowDate') borrowDate?: string,
    @Query('studentName') studentName?: string,
    @Query('studentMatricNo') studentMatricNo?: string,
  ) {
    return this.borrowedBooksService.getAllBorrowedBooks({
      borrowDate,
      studentName,
      studentMatricNo,
    });
  }
}
