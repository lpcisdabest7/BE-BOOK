import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SecretService } from '../global/secret/secret.service';
import { TokenType } from './token.type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly secretService: SecretService,
  ) {}

  async createAccessToken(data: { userId: string }) {
    return await this.jwtService.signAsync(
      {
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
      },
      { expiresIn: this.secretService.authentication.accessExpireTime },
    );
  }

  async createRefreshToken(data: { userId: string }) {
    return await this.jwtService.signAsync(
      {
        userId: data.userId,
        type: TokenType.REFRESH_TOKEN,
      },
      { expiresIn: this.secretService.authentication.refreshExpireTime },
    );
  }
}
