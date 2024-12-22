import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health') // Tag to group endpoints in Swagger
@Controller('v1/health')
export class HealthController {
  private requestCount = 0;

  constructor(private prisma: PrismaService) {}

  @ApiOperation({
    summary: 'Check service health',
    description:
      'Provides information about service uptime, request count, and database connectivity status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is running and database is connected.',
  })
  @ApiResponse({
    status: 500,
    description: 'Service is unhealthy or cannot connect to the database.',
  })
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
