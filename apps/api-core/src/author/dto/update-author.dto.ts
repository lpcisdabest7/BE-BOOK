import {
  StringField,
  StringFieldOptional,
} from 'libs/utils/decorators/field.decorator';

export class UpdateAuthorDto {
  @StringFieldOptional({ default: 'Le Ceng' })
  name: string;

  @StringFieldOptional({ default: 'An example Author' })
  bio: string;

  @StringFieldOptional({ default: '2003-08-07T00:00:00.000z' })
  birthday: string;
}
