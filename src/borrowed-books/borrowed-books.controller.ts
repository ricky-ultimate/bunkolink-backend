import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  ApiBorrowBook,
  ApiReturnBook,
  ApiGetBorrowedBooks,
} from './decorators/borrowed-books.decorator';
import { BorrowedBookFilter } from '../common/interfaces/filter.interface';

@ApiTags('Borrowed Books')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('v1/borrowed-books')
export class BorrowedBooksController {
  constructor(private borrowedBooksService: BorrowedBooksService) {}

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiBorrowBook()
  @Post('borrow')
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowedBooksService.borrowBook(
      borrowBookDto.bookId,
      borrowBookDto.studentId,
    );
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiReturnBook()
  @Post('return/:id')
  async returnBook(@Param('id', ParseIntPipe) id: number,) {
    return this.borrowedBooksService.returnBook(id);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiGetBorrowedBooks()
  @Get()
  async getAllBorrowedBooks(
    @Query('borrowDate') borrowDate?: string,
    @Query('studentName') studentName?: string,
    @Query('studentMatricNo') studentMatricNo?: string,
    @Query('ISBN') ISBN?: string,
    @Query('author') author?: string,
  ) {
    const filters: BorrowedBookFilter = {
      borrowDate,
      studentName,
      studentMatricNo,
      ISBN,
      author,
    };

    return this.borrowedBooksService.findAll(filters)
  }
}
