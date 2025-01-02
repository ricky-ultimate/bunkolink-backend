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
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('v1/books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiOperation({ summary: 'Create a new book', description: 'Adds a new book to the database.' })
  @ApiResponse({ status: 201, description: 'The book has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.createBook(
      createBookDto.title,
      createBookDto.author,
      createBookDto.ISBN,
      createBookDto.availableCopies,
    );
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiOperation({ summary: 'Get all books', description: 'Fetches a list of all books in the library.' })
  @ApiQuery({ name: 'title', required: false, description: 'Filter books by title' })
  @ApiQuery({ name: 'author', required: false, description: 'Filter books by author' })
  @ApiQuery({ name: 'ISBN', required: false, description: 'Filter books by ISBN' })
  @ApiResponse({ status: 200, description: 'List of books.' })
  @Get()
  async getAllBooks(
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('ISBN') ISBN?: string,
  ) {
    return this.booksService.getAllBooks({ title, author, ISBN });
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN', 'USER')
  @ApiOperation({ summary: 'Get a book by ID', description: 'Fetches a single book by its ID.' })
  @ApiResponse({ status: 200, description: 'Book details.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @Get(':id')
  async getBookById(@Param('id') id: string) {
    return this.booksService.getBookById(+id);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiOperation({ summary: 'Update a book', description: 'Updates the details of an existing book.' })
  @ApiResponse({ status: 200, description: 'The book has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Patch(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.updateBook(+id, updateBookDto);
  }

  @Roles('ADMIN', 'STUDENT_LIBRARIAN')
  @ApiOperation({ summary: 'Delete a book', description: 'Deletes a book by its ID.' })
  @ApiResponse({ status: 200, description: 'The book has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return this.booksService.deleteBook(+id);
  }
}
