import { StringField } from 'src/utils';

export class AccountSignInDto {
  @StringField()
  username: string;

  @StringField()
  password: string;
}
