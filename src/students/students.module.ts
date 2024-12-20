import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { AuditLogService } from '../common/services/audit-log.service';

@Module({
  providers: [StudentsService, AuditLogService],
  controllers: [StudentsController],
})
export class StudentsModule {}
