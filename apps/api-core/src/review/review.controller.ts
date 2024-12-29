import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'libs/utils/decorators/http.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { AuthUser } from 'libs/utils/decorators/auth-user.decorator';
import { User } from '@prisma/client';

@Controller({
  path: 'reviews',
  version: '1',
})
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth()
  async getAllReview() {
    return await this.reviewService.getAllReview();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth()
  async createReview(@Body() dto: CreateReviewDto, @AuthUser() user: User) {
    return await this.reviewService.createReview(dto, user.id);
  }
}
