import { Controller, Get } from '@nestjs/common';

@Controller('v1/health')
export class HealthController {
  @Get()
  getHealth() {
    return { status: 'Healthy', uptime: process.uptime() };
  }
}
