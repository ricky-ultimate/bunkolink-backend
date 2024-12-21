import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from './audit-log.service';

describe('AuditLogService', () => {
  let service: AuditLogService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditLogService, PrismaService],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should log an action', async () => {
    const logSpy = jest.spyOn(prisma.auditLog, 'create').mockResolvedValueOnce({
      id: 1,
      action: 'CREATE',
      entityType: 'Book',
      entityId: 1,
      message: 'Created a book',
      timestamp: new Date(),
    });

    await service.logAction('CREATE', 'Book', 1, 'Created a book');
    expect(logSpy).toHaveBeenCalledWith({
      data: {
        action: 'CREATE',
        entityType: 'Book',
        entityId: 1,
        message: 'Created a book',
      },
    });
  });
});
