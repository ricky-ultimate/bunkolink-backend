import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('v1/books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.createBook(
      createBookDto.title,
      createBookDto.author,
      createBookDto.ISBN,
      createBookDto.availableCopies,
    );
  }

  @Get()
  async getAllBooks(
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('ISBN') ISBN?: string,
  ) {
    return this.booksService.getAllBooks({ title, author, ISBN });
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    return this.booksService.getBookById(+id);
  }

  @Patch(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.updateBook(+id, updateBookDto);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return this.booksService.deleteBook(+id);
  }
}
