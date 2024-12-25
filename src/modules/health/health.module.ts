import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';

@Module({
  providers: [HealthService],
  controllers: [HealthController],
  imports: [TerminusModule, RedisHealthModule],
})
export class HealthModule {}
