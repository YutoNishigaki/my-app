import { Controller, Get } from '@nestjs/common';

export type HealthCheck = {
  status: 'ok';
  timestamp: string;
};

@Controller('health')
export class HealthCheckController {
  @Get()
  getHealth(): HealthCheck {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
