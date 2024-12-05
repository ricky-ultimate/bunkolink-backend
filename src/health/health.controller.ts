import { Controller, Get, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('v1/health')
export class HealthController {
  private requestCount = 0;

  constructor(private prisma: PrismaService) {}

  @Get()
  async getHealth() {
    this.requestCount += 1;

    let dbStatus = 'Healthy';
    try {
      // Check DB connectivity by running a simple query
      await this.prisma.book.findMany({ take: 1 });
    } catch (error) {
      dbStatus = 'Unhealthy';
    }

    // Return health check information along with app uptime and database connectivity status
    return {
      status: dbStatus === 'Healthy' ? 'Healthy' : 'Unhealthy',
      uptime: process.uptime(),
      dbStatus: dbStatus,
      requestCount: this.requestCount, // Number of requests handled since the app started
    };
  }
}
