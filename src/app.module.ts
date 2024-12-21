import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { StudentsModule } from './students/students.module';
import { BorrowedBooksModule } from './borrowed-books/borrowed-books.module';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AppLoggerService } from './common/services/logger.service';
import { AuditLogService } from './common/services/audit-log.service';

@Module({
  imports: [BooksModule, StudentsModule, BorrowedBooksModule, PrismaModule],
  controllers: [AppController, HealthController],
  providers: [AppService, AppLoggerService, AuditLogService],
})
export class AppModule {}
