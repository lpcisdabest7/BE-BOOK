import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/modules/prisma/prisma.service';
import { CreateViewDto } from './dto/create-view-book.dto';
import { ApiException } from 'libs/utils/exception';
import { PageOptionsDto } from 'libs/core/dto/page-options.dto';

@Injectable()
export class ViewService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllView(pageOptionsDto: PageOptionsDto) {
    const { skip, take, order, orderField, q } = pageOptionsDto;

    const whereCondition = q
      ? {
          [orderField]: {
            contains: q,
            mode: 'insensitive',
          },
        }
      : undefined;

    const [views, total] = await Promise.all([
      this.prismaService.view.findMany({
        skip,
        take,
        where: whereCondition,
        orderBy: {
          [orderField]: order.toLowerCase(),
        },
      }),
      this.prismaService.review.count({
        where: whereCondition,
      }),
    ]);

    return {
      data: views,
      total,
      page: pageOptionsDto.page,
      take: pageOptionsDto.take,
      totalPages: Math.ceil(total / pageOptionsDto.take),
    };
  }

  async createView(dto: CreateViewDto, userId: string) {
    const book = await this.prismaService.book.findFirstOrThrow({
      where: {
        id: dto.bookId,
      },
    });

    if (!book) {
      throw new ApiException('Book not found', HttpStatus.NOT_FOUND);
    }
    return await this.prismaService.view.create({
      data: {
        userId,
        bookId: book.id,
      },
    });
  }
}
