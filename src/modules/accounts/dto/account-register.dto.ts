import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { StringField } from 'src/utils';
import { generateHash } from 'src/utils/util';

export class AccountRegisterDto {
  @StringField()
  username: string;

  @StringField()
  @Transform(({ value }) => (value ? generateHash(value) : value))
  password: string;

  @StringField()
  secret: string;

  @StringField()
  role: Role;
}
