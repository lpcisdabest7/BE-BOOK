import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { BooleanFieldOptional, StringFieldOptional } from 'src/utils';
import { generateHash } from 'src/utils/util';

export class AccountUpdateDto {
  @StringFieldOptional()
  username?: string;

  @StringFieldOptional()
  @Transform(({ value }) => (value ? generateHash(value) : value))
  password?: string;

  @BooleanFieldOptional()
  isActive?: boolean;

  @StringFieldOptional()
  role?: Role;
}
