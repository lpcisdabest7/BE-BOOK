import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, AuthRefreshToken, AuthIdentify } from 'src/utils';
import { AuthService } from './auth.service';
import { AccountSignInDto } from './dto/account-sign-in.dto';
import { UserSSODto } from './dto/user-sso.dto';
import { UserSignUpDto } from './dto/user-register.dto';
import { Identify } from 'src/utils/type';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @ApiOperation({ summary: 'account' })
  @HttpCode(HttpStatus.OK)
  async accountSignIn(@Body() accountSignInDto: AccountSignInDto) {
    return await this.authService.signInAccount(accountSignInDto);
  }

  @Post('/sso')
  @HttpCode(HttpStatus.OK)
  async sso(@Body() userSSODto: UserSSODto) {
    return await this.authService.signInUserBySSO(userSSODto);
  }

  @Post('/sign-up')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() userSignUpDto: UserSignUpDto) {
    return await this.authService.signUpUser(userSignUpDto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth()
  getCurrentUser(@AuthIdentify() identify: Identify) {
    return identify;
  }

  @Post('refresh')
  @AuthRefreshToken()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@AuthIdentify() identify: Identify) {
    return await this.authService.refreshToken(identify);
  }
}
