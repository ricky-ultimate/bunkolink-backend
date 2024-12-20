import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { AuditLogService } from '../common/services/audit-log.service';

@Module({
  providers: [BooksService, AuditLogService],
  controllers: [BooksController],
})
export class BooksModule {}
