import { Controller, Get } from '@nestjs/common';
import { LoggerService } from 'libs/modules/global/logger/logger.service';

@Controller('/health')
export class HealthController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get()
  ok() {
    return 'ok';
  }
}
