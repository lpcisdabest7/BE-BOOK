import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SecretService } from '../global/secret/secret.service';
import { TokenService } from './token.service';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (secretService: SecretService) => ({
        secret: secretService.authentication.secret,
      }),
      inject: [SecretService],
    }),
  ],
  providers: [JwtStrategy, JwtRefreshStrategy, TokenService],
  exports: [TokenService, JwtStrategy, JwtRefreshStrategy],
})
export class TokenModule {}
