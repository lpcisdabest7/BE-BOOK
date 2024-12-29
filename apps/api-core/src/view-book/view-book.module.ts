import { Module } from '@nestjs/common';
import { ViewService } from './view-book.service';
import { ViewController } from './view-book.controller';

@Module({
  controllers: [ViewController],
  providers: [ViewService],
  exports: [ViewService],
})
export class ViewModule {}
