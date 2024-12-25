import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/modules/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiException } from 'libs/utils/exception';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async deActiveUser(user: User) {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async updateUser(dto: UpdateUserDto, user: User) {
    return await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        ...dto,
      },
    });
  }
  async deleteUser(userId: string, user: User) {
    if (user.role === 'ROOT' || user.role === 'USER') {
      if (userId !== user.id) {
        throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
      }
      await this.deActiveUser(user);
    }
    await this.prismaService.user.delete({ where: { id: userId } });
  }
}
