import { HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from 'libs/modules/token/token.service';
import { PrismaService } from 'libs/modules/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { UserRegisterDto } from './dto/user-register.dto';
import { ApiException } from 'libs/utils/exception';
import { generateHash, validateHash } from 'libs/utils/util';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(dto: UserLoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ApiException('Not found user.', HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid = await validateHash(dto.password, user?.password);

    if (!isPasswordValid) {
      throw new ApiException('Not found account.', HttpStatus.BAD_REQUEST);
    }

    const token = await this.pairToken(user);

    return {
      token,
      user: user,
    };
  }

  async signUp(dto: UserRegisterDto) {
    let user = await this.prismaService.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          password: generateHash(dto.password),
          username: 'Guest',
          isActive: true,
          role: Role.USER,
        },
      });
    }

    const token = await this.pairToken(user);

    return {
      token,
      user,
    };
  }
  async pairToken(user: User) {
    const accessToken = await this.tokenService.createAccessToken({
      userId: user.id,
    });

    const refreshToken = await this.tokenService.createRefreshToken({
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
