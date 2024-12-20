import { Module } from '@nestjs/common';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowedBooksController } from './borrowed-books.controller';
import { AuditLogService } from '../common/services/audit-log.service';

@Module({
  providers: [BorrowedBooksService, AuditLogService],
  controllers: [BorrowedBooksController],
})
export class BorrowedBooksModule {}
