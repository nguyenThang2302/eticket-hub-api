import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('health-check')
export class HealthCheckController {
  @ApiOperation({ summary: 'Check the health of the application' })
  @Get()
  checkHealth() {
    return { status: 'ok' };
  }
}
