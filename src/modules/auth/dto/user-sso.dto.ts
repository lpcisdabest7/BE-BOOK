import { StringField, StringFieldOptional } from 'src/utils';

export class UserSSODto {
  @StringField()
  idToken: string;

  @StringFieldOptional()
  referId?: string;

  @StringField()
  applicationCode: string;
}
