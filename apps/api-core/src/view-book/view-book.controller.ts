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
import { CreateViewDto } from './dto/create-view-book.dto';
import { ViewService } from './view-book.service';
import { AuthUser } from 'libs/utils/decorators/auth-user.decorator';
import { User } from '@prisma/client';

@Controller({
  path: 'views',
  version: '1',
})
@ApiTags('View')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth()
  async getAllView() {
    return await this.viewService.getAllView();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth()
  async createView(@Body() dto: CreateViewDto, @AuthUser() user: User) {
    return await this.viewService.createView(dto, user.id);
  }
}
