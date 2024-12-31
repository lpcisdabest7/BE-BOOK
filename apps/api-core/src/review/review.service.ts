import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/modules/prisma/prisma.service';
import { ApiException } from 'libs/utils/exception';
import { User } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllReview() {
    return await this.prismaService.review.findMany();
  }

  async createReview(dto: CreateReviewDto, userId: string) {
    console.log(dto);
    const book = await this.prismaService.book.findFirstOrThrow({
      where: {
        id: dto.bookId,
      },
    });
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
