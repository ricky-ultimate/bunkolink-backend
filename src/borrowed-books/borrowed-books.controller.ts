import { Controller, Post, Body, Param, Get, Query, UseGuards } from '@nestjs/common';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Borrowed Books')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('v1/borrowed-books')
export class BorrowedBooksController {
  constructor(private borrowedBooksService: BorrowedBooksService) {}

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiOperation({ summary: 'Borrow a book', description: 'Records the borrowing of a book by a student.' })
  @ApiResponse({ status: 201, description: 'The book has been successfully borrowed.' })
  @ApiResponse({ status: 400, description: 'Invalid input or no copies available.' })
  @ApiResponse({ status: 404, description: 'Book or student not found.' })
  @Post('borrow')
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowedBooksService.borrowBook(
      borrowBookDto.bookId,
      borrowBookDto.studentId,
    );
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiOperation({ summary: 'Return a borrowed book', description: 'Records the return of a borrowed book.' })
  @ApiResponse({ status: 200, description: 'The book has been successfully returned.' })
  @ApiResponse({ status: 404, description: 'Borrow record not found.' })
  @ApiResponse({ status: 400, description: 'Book already returned.' })
  @Post('return/:id')
  async returnBook(@Param('id') id: string) {
    return this.borrowedBooksService.returnBook(+id);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiOperation({ summary: 'Get all borrowed book records', description: 'Fetches all borrowed book records.' })
  @ApiQuery({ name: 'borrowDate', required: false, description: 'Filter records by borrow date' })
  @ApiQuery({ name: 'studentName', required: false, description: 'Filter records by student name' })
  @ApiQuery({ name: 'studentMatricNo', required: false, description: 'Filter records by student matriculation number' })
  @ApiResponse({ status: 200, description: 'List of borrowed book records.' })
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
