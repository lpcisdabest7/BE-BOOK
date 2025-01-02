import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/modules/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiException } from 'libs/utils/exception';
import { PageOptionsDto } from 'libs/core/dto/page-options.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllReview(pageOptionsDto: PageOptionsDto) {
    const { skip, take, order, orderField, q } = pageOptionsDto;

    const whereCondition = q
      ? {
          [orderField]: {
            contains: q,
            mode: 'insensitive',
          },
        }
      : undefined;

    const [reviews, total] = await Promise.all([
      this.prismaService.review.findMany({
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
      data: reviews,
      total,
      page: pageOptionsDto.page,
      take: pageOptionsDto.take,
      totalPages: Math.ceil(total / pageOptionsDto.take),
    };
  }

  async createReview(dto: CreateReviewDto, userId: string) {
    const book = await this.prismaService.book.findFirstOrThrow({
      where: {
        id: dto.bookId,
      },
    });

    if (!book) {
      throw new ApiException('Book not found', HttpStatus.NOT_FOUND);
    }
    return await this.prismaService.review.create({
      data: {
        userId,
        bookId: book.id,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }
}
