import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, ArrayNotEmpty } from 'class-validator';
import {
  NumberField,
  StringField,
} from 'libs/utils/decorators/field.decorator';

export class CreateBookDto {
  @StringField({ default: 'Liễu Chu Ký' })
  title: string;

  @StringField({ default: 'Tiểu thuyết cổ điển Trung Quốc' })
  content: string;

  @StringField({
    default:
      '"Liễu Chu Ký" là một tác phẩm văn học nổi tiếng thuộc thể loại tiểu thuyết cổ điển Trung Quốc. Tác phẩm này thường được biết đến với chủ đề tình yêu, bi kịch và những xung đột xã hội. Nội dung của "Liễu Chu Ký" xoay quanh cuộc sống của các nhân vật chính, khám phá những mối quan hệ phức tạp, sự đau khổ và khát vọng của họ.',
  })
  description?: string;

  @StringField({ default: new Date().toISOString() })
  publishDate: Date;

  @StringField({ default: '45456464654' })
  isbn: string;

  @StringField({ default: 'tiểu thuyết' })
  category: string;

  @StringField({ default: 'CN' })
  language: string;

  @NumberField({ default: 25 })
  pageCount: number;

  @ApiProperty({
    type: [Object], // Đảm bảo Swagger hiểu đây là mảng đối tượng
    default: [
      {
        title: 'Tiêu đề chương 1',
        content: 'Nội dung chương 1...',
      },
    ],
  })
  chapters?: { title: string; content: string }[]; // Đảm bảo kiểu dữ liệu là mảng các đối tượng

  @NumberField({ default: 0 })
  totalChapters: number;

  @StringField({ default: 'd63d12cc-b485-4580-981b-276e4ab818ce' })
  authorId: string;

  @NumberField({ default: 2305 })
  price: number;

  @StringField({ default: 'loading' })
  status: string;

  @StringField({ default: 'hot' })
  creating: string;

  @NumberField({ default: 4.5 })
  star: number;
}
