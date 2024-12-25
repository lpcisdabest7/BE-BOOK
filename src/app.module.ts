import { Module } from '@nestjs/common';
import { LoggerModule } from './core/logger/logger.module';
import { ConfigModule } from './core/config/config.module';
import { ClsModule } from './core/cls/cls.module';
import { CacheModule } from './core/cache/cache.module';
import { RedlockModule } from './core/redlock/redlock.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.register({
      envFilePath: './apps/core/.env',
    }),
    ClsModule,
    CacheModule,
    RedlockModule,
    HealthModule,
    AuthModule,
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          prismaOptions: {
            log: ['error'],
          },
        };
      },
    }),
  ],
})
export class AppModule {}
