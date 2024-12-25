import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthCheck } from '@nestjs/terminus';

@ApiTags('Heath')
@Controller('/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HealthCheck()
  health() {
    return this.healthService.check();
  }
}
