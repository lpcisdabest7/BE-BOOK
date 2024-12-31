import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/modules/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ApiException } from 'libs/utils/exception';
import { UpdateBookDto } from './dto/update-book.dto';
import { User } from '@prisma/client';

@Injectable()
export class BookService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllBook() {
    const books = await this.prismaService.book.findMany();
    const reviews = await this.prismaService.review.findMany({
      where: {
        bookId: {
          in: books.map((book) => book.id),
        },
      },
    });
    const booksWithStars = books.map((book) => {
      const bookReviews = reviews.filter((review) => review.bookId === book.id);
      const totalRatings = bookReviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const averageRating =
        bookReviews.length > 0 ? totalRatings / bookReviews.length : 0;
      return {
        ...book,
        star: averageRating,
      };
    });

    return booksWithStars;
  }

  async createBook(dto: CreateBookDto) {
    const publishDate = new Date(dto.publishDate);

    if (isNaN(publishDate.getTime())) {
      throw new ApiException('Invalid date format', HttpStatus.BAD_REQUEST);
    }
    return await this.prismaService.book.create({
      data: {
        title: dto.title,
        content: dto.content,
        description: dto.description,
        publishDate,
        isbn: dto.isbn,
        category: dto.category,
        language: dto.language,
        pageCount: dto.pageCount,
        totalChapters: dto.totalChapters,
        authorId: dto.authorId,
        price: dto.price,
        status: dto.status,
        star: dto.star,
        creating: dto.creating,
        chapters: dto.chapters,
      },
    });
  }

  async updateBook(dto: UpdateBookDto, bookId: string) {
    return await this.prismaService.book.update({
      where: { id: bookId },
      data: {
        ...dto,
      },
    });
  }

  async deleteBook(bookId: string, user: User) {
    if (user.role === 'ROOT' || user.role === 'USER') {
      throw new ApiException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    await this.prismaService.book.delete({ where: { id: bookId } });
  }
}
