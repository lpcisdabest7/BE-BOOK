import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/modules/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiException } from 'libs/utils/exception';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllReview() {
    return await this.prismaService.review.findMany();
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
