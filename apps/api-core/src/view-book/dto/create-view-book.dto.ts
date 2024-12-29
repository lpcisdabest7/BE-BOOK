import {
  NumberField,
  StringField,
  StringFieldOptional,
} from 'libs/utils/decorators/field.decorator';

export class CreateViewDto {
  @StringField({ default: 'string' })
  userId: string;

  @StringField({ default: 'string' })
  bookId: string;
}
