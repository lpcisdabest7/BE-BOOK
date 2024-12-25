import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { TokenPayload, TokenType } from './type';
import { ConfigService } from '../config/config.service';
import { PrismaService } from '../prisma/prisma.service';
import { ApiException } from 'src/utils/exception';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async createPairToken(data: Omit<TokenPayload, 'type'>) {
    const accessToken = await this.createAccessToken(data);
    const refreshToken = await this.createRefreshToken(data);
    return { accessToken, refreshToken };
  }

  async createAccessToken(data: Omit<TokenPayload, 'type'>) {
    return await this.jwtService.signAsync(
      {
        id: data.id,
        type: TokenType.ACCESS_TOKEN,
        refer: data.refer,
      },
      { expiresIn: this.configService.authentication.accessExpireTime },
    );
  }

  async verifyAccessToken(authorization: string) {
    const accessToken = authorization.split('Bearer ')?.at(1);

    if (!accessToken) {
      throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded =
        await this.jwtService.verify<Promise<TokenPayload>>(accessToken);

      if (decoded.type !== TokenType.ACCESS_TOKEN) {
        throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
      }

      let identify;
      if (decoded.refer === 'user') {
        identify = await this.prismaService.user.findFirst({
          where: {
            id: decoded.id,
          },
        });
      }

      if (decoded.refer === 'account') {
        identify = await this.prismaService.account.findFirst({
          where: {
            id: decoded.id,
            isActive: true,
          },
        });
      }

      if (!identify) {
        throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
      }

      return decoded;
    } catch (error) {
      throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
    }
  }

  async createRefreshToken(data: Omit<TokenPayload, 'type'>) {
    return await this.jwtService.signAsync(
      {
        id: data.id,
        type: TokenType.REFRESH_TOKEN,
        refer: data.refer,
      },
      { expiresIn: this.configService.authentication.refreshExpireTime },
    );
  }
}
