import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { SecretService } from '../global/secret/secret.service';
import { RoleType, TokenType } from './token.type';
import { ApiException } from 'libs/utils/exception';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly secretService: SecretService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const refreshToken = req.headers['x-refresh-token'];
        return refreshToken;
      },
      secretOrKey: secretService.authentication.secret,
    });
  }

  async validate(args: { userId: string; role: RoleType; type: TokenType }) {
    if (args.type !== TokenType.REFRESH_TOKEN) {
      throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.prismaService.user.findFirst({
      where: { id: args.userId, isActive: true },
    });

    if (!user) {
      throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
