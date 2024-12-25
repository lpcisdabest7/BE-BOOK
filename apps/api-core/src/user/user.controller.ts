import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Version,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Auth } from 'libs/utils/decorators/http.decorator';
import { AuthUser } from 'libs/utils/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Post('de-active')
  @HttpCode(HttpStatus.OK)
  @Auth()
  getCurrentUser(@AuthUser() user: User) {
    return this.userService.deActiveUser(user);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @Auth()
  updateUser(@Body() dto: UpdateUserDto, @AuthUser() user: User) {
    return this.userService.updateUser(dto, user);
  }

  @Delete('/:userId')
  @HttpCode(HttpStatus.OK)
  @Auth()
  deleteUser(@Param('userId') userId: string, @AuthUser() user: User) {
    return this.userService.deleteUser(userId, user);
  }
}
