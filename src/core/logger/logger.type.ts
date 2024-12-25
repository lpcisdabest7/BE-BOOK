import { HttpException } from '@nestjs/common';
import { ApiException } from 'src/utils/exception';

export type MessageType = {
  /**
   * message to be logged
   */
  message: string;
  /**
   * method or class that accour message
   */
  context?: string;
  /**
   * addtional object to log
   */
  obj?: object;
};

export type ErrorType = HttpException | ApiException;
