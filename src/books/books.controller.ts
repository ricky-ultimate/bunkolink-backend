import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  ApiCreateBook,
  ApiGetBooks,
  ApiGetBookById,
  ApiUpdateBook,
  ApiDeleteBook,
} from './decorators/books.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BookFilter } from '../common/interfaces/filter.interface';
import { PaginationOptions } from '../common/interfaces/base.interface';

@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('v1/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiCreateBook()
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto, @Request() req: any) {
    return this.booksService.create(createBookDto, req.user.userId);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiGetBooks()
  @Get()
  async getAllBooks(
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('ISBN') ISBN?: string,
    @Query('isAvailable') isAvailable?: boolean,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const filters: BookFilter = { title, author, ISBN, isAvailable };
    const pagination: PaginationOptions = page ? { page, limit } : undefined;

    return this.booksService.findAll(filters, pagination);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiOperation({ summary: 'Get available books only' })
  @Get('available')
  async getAvailableBooks(@Query() filters: BookFilter) {
    return this.booksService.findAvailableBooks(filters);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiGetBookById()
  @Get(':id')
  async getBookById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.booksService.findById(id, req.user.userId);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiUpdateBook()
  @Patch(':id')
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
    @Request() req: any,
  ) {
    return this.booksService.update(id, updateBookDto, req.user.userId);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiDeleteBook()
  @Delete(':id')
  async deleteBook(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.booksService.delete(id, req.user.userId);
  }
}
