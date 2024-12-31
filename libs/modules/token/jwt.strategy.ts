import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SecretService } from '../global/secret/secret.service';
import { RoleType, TokenType } from './token.type';
import { PrismaService } from '../prisma/prisma.service';
import { ApiException } from 'libs/utils/exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly secretService: SecretService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretService.authentication.secret,
      ignoreExpiration: true,
    });
  }

  async validate(args: {
    userId: string;
    role: RoleType;
    type: TokenType;
    exp?: number;
  }) {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
    }

    if (args.exp < Date.now() / 1000) {
      throw new ApiException('Exp time', HttpStatus.UNAUTHORIZED);
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
