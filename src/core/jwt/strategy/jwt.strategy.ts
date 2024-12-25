import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload, TokenType } from '../type';
import { ConfigService } from '../../config/config.service';
import { ApiException } from 'src/utils/exception';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authentication.secret,
    });
  }

  async validate(args: TokenPayload) {
    if (args.type !== TokenType.ACCESS_TOKEN) {
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
