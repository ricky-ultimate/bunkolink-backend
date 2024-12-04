import { Module } from '@nestjs/common';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowedBooksController } from './borrowed-books.controller';

@Module({
  providers: [BorrowedBooksService],
  controllers: [BorrowedBooksController],
})
export class BorrowedBooksModule {}
