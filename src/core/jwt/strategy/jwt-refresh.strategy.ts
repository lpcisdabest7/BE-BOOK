import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { TokenPayload, TokenType } from '../type';
import { Request } from 'express';
import { ConfigService } from '../../config/config.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiException } from 'src/utils/exception';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const refreshToken = req.body.refreshToken;
        return refreshToken;
      },
      secretOrKey: configService.authentication.secret,
    });
  }

  async validate(args: TokenPayload) {
    if (args.type !== TokenType.REFRESH_TOKEN) {
      throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
    }

    let identify;
    if (args.refer === 'user') {
      identify = await this.prismaService.user.findFirst({
        where: {
          id: args.id,
        },
      });
    }

    if (args.refer === 'account') {
      identify = await this.prismaService.account.findFirst({
        where: {
          id: args.id,
          isActive: true,
        },
        select: {
          id: true,
          isActive: true,
          username: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    if (!identify) {
      throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
    }

    return identify;
  }
}
