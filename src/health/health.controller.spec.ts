import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            book: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return Healthy status when DB is reachable', async () => {
      jest.spyOn(prisma.book, 'findMany').mockResolvedValueOnce([]);

      const result = await controller.getHealth();

      expect(result.status).toBe('Healthy');
      expect(result.dbStatus).toBe('Healthy');
      expect(result.uptime).toBeGreaterThan(0);
      expect(result.requestCount).toBe(1); // This is the first request handled
    });

    it('should return Unhealthy status when DB is unreachable', async () => {
      jest
        .spyOn(prisma.book, 'findMany')
        .mockRejectedValueOnce(new Error('DB Error'));

      const result = await controller.getHealth();

      expect(result.status).toBe('Unhealthy');
      expect(result.dbStatus).toBe('Unhealthy');
      expect(result.uptime).toBeGreaterThan(0);
      expect(result.requestCount).toBe(1); // This is the first request handled
    });

    it('should increment request count on every call', async () => {
      jest.spyOn(prisma.book, 'findMany').mockResolvedValueOnce([]);

      await controller.getHealth(); // First request
      const result = await controller.getHealth(); // Second request

      expect(result.requestCount).toBe(2); // Request count should increment
    });
  });
});
