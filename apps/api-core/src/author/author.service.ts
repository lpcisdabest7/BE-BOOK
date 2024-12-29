import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/modules/prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { ApiException } from 'libs/utils/exception';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllAuthor() {
    return await this.prismaService.author.findMany();
  }

  async createAuthor(dto: CreateAuthorDto) {
    const birthDate = new Date(dto.birthday);

    if (isNaN(birthDate.getTime())) {
      throw new ApiException('Invalid date format', HttpStatus.BAD_REQUEST);
    }
    return await this.prismaService.author.create({
      data: {
        name: dto.name,
        bio: dto.bio,
        birthDate,
      },
    });
  }

  async updateAuthor(dto: UpdateAuthorDto, authorId: string) {
    return await this.prismaService.author.update({
      where: { id: authorId },
      data: {
        ...dto,
      },
    });
  }

  async deleteAuthor(authorId: string, user: User) {
    if (user.role === 'ROOT' || user.role === 'USER') {
      throw new ApiException('Unauthorize', HttpStatus.UNAUTHORIZED);
    }
    await this.prismaService.author.delete({ where: { id: authorId } });
  }
}
