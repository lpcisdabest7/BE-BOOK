import { Module } from '@nestjs/common';
import { GlobalModule } from '../../../libs/modules/global/global.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'libs/modules/prisma/prisma.module';
import { CacheModule } from 'libs/modules/cache/cache.module';
import { AuthorModule } from './author/author.module';
import { ReviewModule } from './review/review.module';
import { ViewModule } from './view-book/view-book.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    GlobalModule,
    HealthModule,
    AuthModule,
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          prismaOptions: {
            log: ['error', 'query'],
          },
        };
      },
    }),
    CacheModule,
    AuthorModule,
    ReviewModule,
    ViewModule,
    BookModule,
  ],
})
export class AppModule {}
