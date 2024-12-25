import { Injectable } from '@nestjs/common';
import { PrismaHealthIndicator } from 'src/core/prisma/prisma-health.indicator';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { HealthCheckService } from '@nestjs/terminus';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class HealthService {
  private redis: Redis | null;

  constructor(
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async check() {
    return await this.health.check([
      () => this.prismaIndicator.isHealthy('database'),
      () =>
        this.redisIndicator.checkHealth('redis', {
          client: this.redis!,
          type: 'redis',
        }),
    ]);
  }
}
