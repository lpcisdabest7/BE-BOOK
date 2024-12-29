import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsJSON } from 'class-validator';
import {
  NumberFieldOptional,
  StringFieldOptional,
} from 'libs/utils/decorators/field.decorator';

export class UpdateBookDto {
  @StringFieldOptional({ default: '' })
  title: string;

  @StringFieldOptional({ default: '' })
  content: string;

  @StringFieldOptional({ default: '' })
  description?: string;

  @StringFieldOptional({ default: new Date().toISOString() })
  publishDate: Date;

  @StringFieldOptional({ default: '' })
  isbn: string;

  @StringFieldOptional({ default: '' })
  category: string;

  @StringFieldOptional({ default: '' })
  language: string;

  @NumberFieldOptional({ default: 0 })
  pageCount: number;

  @IsJSON()
  @Optional()
  @Transform(({ value }) =>
    value
      ? value
      : JSON.stringify([
          {
            title: 'Tiêu đề chương 1',
            content: 'Nội dung chương 1...',
          },
        ]),
  )
  chapters?: string[];

  @NumberFieldOptional({ default: 0 })
  totalChapters: number;

  @StringFieldOptional({ default: '' })
  authorId: string;

  @NumberFieldOptional({ default: '' })
  price: number;

  @StringFieldOptional({ default: 'loading' })
  status: string;

  @StringFieldOptional({ default: 'hot' })
  creating: string;

  @NumberFieldOptional({ default: 0 })
  star: number;
}
