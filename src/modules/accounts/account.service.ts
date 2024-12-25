import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AccountRegisterDto } from './dto/account-register.dto';
import { ConfigService } from 'src/core/config/config.service';
import { ApiException } from 'src/utils/exception';
import { v4 as uuid } from 'uuid';
import { AccountUpdateDto } from './dto/account-update.dto';
import { isUndefined, omitBy } from 'lodash';

@Injectable()
export class AccountService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async listAccount() {
    return await this.prismaService.account.findMany({
      select: {
        password: false,
      },
    });
  }

  async updateAccount(accountId: string, dto: AccountUpdateDto) {
    return await this.prismaService.account.update({
      where: {
        id: accountId,
      },
      data: omitBy(dto, isUndefined),
    });
  }

  async registerAccount(dto: AccountRegisterDto) {
    if (dto.secret !== this.configService.secret.key) {
      throw new ApiException('Invalid secret.', HttpStatus.FORBIDDEN);
    }

    const isExist = await this.prismaService.account.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (isExist) {
      throw new ApiException('Already exist username.', HttpStatus.BAD_REQUEST);
    }

    const account = await this.prismaService.account.create({
      data: {
        id: 'acc_' + uuid(),
        username: dto.username,
        password: dto.password,
        isActive: true,
        role: dto.role,
      },
    });

    return account;
  }
}
