import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/modules/prisma/prisma.service';
import { CreateViewDto } from './dto/create-view-book.dto';

@Injectable()
export class ViewService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllView() {
    return await this.prismaService.view.findMany();
  }

  async createView(dto: CreateViewDto, userId: string) {
    const book = await this.prismaService.book.findFirstOrThrow({
      where: {
        id: dto.bookId,
      },
    });
    return await this.prismaService.view.create({
      data: {
        userId,
        bookId: book.id,
      },
    });
  }
}
