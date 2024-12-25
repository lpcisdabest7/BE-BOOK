import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NestJwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.authentication.secret,
        global: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, JwtRefreshStrategy, JwtService],
  exports: [JwtService, JwtStrategy, JwtRefreshStrategy],
})
export class JwtModule {}
