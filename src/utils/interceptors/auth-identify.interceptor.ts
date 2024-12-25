import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { ContextProvider } from '../providers/context.provider';

@Injectable()
export class AuthIdentifyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const identify = request.user;
    ContextProvider.setAuthIdentify(identify);

    return next.handle();
  }
}
