import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { StudentsModule } from './students/students.module';
import { BorrowedBooksModule } from './borrowed-books/borrowed-books.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [BooksModule, StudentsModule, BorrowedBooksModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
