import { StringField } from 'libs/utils/decorators/field.decorator';

export class CreateAuthorDto {
  @StringField({ default: 'Le Ceng' })
  name: string;

  @StringField({ default: 'An example Author' })
  bio: string;

  @StringField({ default: '2003-08-07T00:00:00.000z' })
  birthday: string;
}
