import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth, AuthRefreshToken } from 'libs/utils/decorators/http.decorator';
import { AuthUser } from 'libs/utils/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: UserLoginDto) {
    return await this.authService.signIn(dto);
  }

  @Version('1')
  @Post('signUp')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() dto: UserRegisterDto) {
    return await this.authService.signUp(dto);
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth()
  getCurrentUser(@AuthUser() user: User) {
    return user;
  }

  @Version('1')
  @Post('refresh')
  @AuthRefreshToken()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@AuthUser() user: User) {
    return await this.authService.pairToken(user);
  }
}
