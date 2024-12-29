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
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorService } from './author.service';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthUser } from 'libs/utils/decorators/auth-user.decorator';
import { User } from '@prisma/client';

@Controller({
  path: 'authors',
  version: '1',
})
@ApiTags('Author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth()
  async getAllAuthor() {
    return await this.authorService.getAllAuthor();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth()
  async createAuthor(@Body() dto: CreateAuthorDto) {
    return await this.authorService.createAuthor(dto);
  }

  @Patch('/:authorId')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async updateAuthor(
    @Body() dto: UpdateAuthorDto,
    @Param('authorId') authorId: string,
  ) {
    return await this.authorService.updateAuthor(dto, authorId);
  }

  @Delete('/:authorId')
  @HttpCode(HttpStatus.OK)
  @Auth()
  deleteUser(@Param('authorId') authorId: string, @AuthUser() user: User) {
    return this.authorService.deleteAuthor(authorId, user);
  }
}
