import { StringField } from 'src/utils';

export class UserSignUpDto {
  @StringField()
  referId: string;

  @StringField()
  applicationCode: string;
}
