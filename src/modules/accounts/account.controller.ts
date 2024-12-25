import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountRegisterDto } from './dto/account-register.dto';
import { AccountService } from './account.service';
import { AccountUpdateDto } from './dto/account-update.dto';
import { Auth } from 'src/utils';
import { Role } from '@prisma/client';

@Controller({
  path: 'account',
  version: '1',
})
@ApiTags('Account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'root' })
  @Auth([Role.ROOT])
  async listAccount() {
    return await this.accountService.listAccount();
  }

  @Patch(':accountId')
  @Auth([Role.ROOT])
  @ApiOperation({ summary: 'root' })
  @HttpCode(HttpStatus.OK)
  async updateAccount(
    @Param('accountId') accountId: string,
    @Body() accountUpdateDto: AccountUpdateDto,
  ) {
    return await this.accountService.updateAccount(accountId, accountUpdateDto);
  }

  @Post('')
  @ApiOperation({ summary: 'account' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() accountRegisterDto: AccountRegisterDto) {
    return await this.accountService.registerAccount(accountRegisterDto);
  }
}
