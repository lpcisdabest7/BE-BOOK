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
import { CreateBookDto } from './dto/create-book.dto';
import { BookService } from './book.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthUser } from 'libs/utils/decorators/auth-user.decorator';
import { User } from '@prisma/client';

@Controller({
  path: 'books',
  version: '1',
})
@ApiTags('Book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth()
  async getAllBook() {
    return await this.bookService.getAllBook();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth()
  async createBook(@Body() dto: CreateBookDto) {
    return await this.bookService.createBook(dto);
  }

  @Patch('/:bookId')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async updateBook(
    @Body() dto: UpdateBookDto,
    @Param('bookId') bookId: string,
  ) {
    return await this.bookService.updateBook(dto, bookId);
  }

  @Delete('/:bookId')
  @HttpCode(HttpStatus.OK)
  @Auth()
  deleteUser(@Param('bookId') bookId: string, @AuthUser() user: User) {
    return this.bookService.deleteBook(bookId, user);
  }
}
