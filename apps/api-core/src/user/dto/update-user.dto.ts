import { Role } from '@prisma/client';
import {
  EmailFieldOptional,
  StringFieldOptional,
} from 'libs/utils/decorators/field.decorator';

export class UpdateUserDto {
  @EmailFieldOptional()
  readonly email!: string;

  @StringFieldOptional()
  readonly username: string;

  @StringFieldOptional()
  readonly role: Role;
}
