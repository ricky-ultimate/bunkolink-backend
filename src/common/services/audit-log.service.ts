import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async logAction(
    action: string,
    entityType: string,
    entityId: number,
    message: string,
  ) {
    await this.prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        message,
      },
    });
  }
}
