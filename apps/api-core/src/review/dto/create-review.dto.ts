import {
  NumberField,
  StringField,
  StringFieldOptional,
} from 'libs/utils/decorators/field.decorator';

export class CreateReviewDto {
  @StringField({ default: 'string' })
  userId: string;

  @StringField({ default: 'string' })
  bookId: string;

  @NumberField({ default: 4.5 })
  rating: number;

  @StringFieldOptional({ default: 'good' })
  comment: string;
}
