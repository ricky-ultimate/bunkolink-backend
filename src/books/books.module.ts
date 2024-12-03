import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';

@Module({
  providers: [BooksService],
  controllers: [BooksController]
})
export class BooksModule {}
