import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export function AuthIdentify() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const identify = request.user;

    if (identify?.[Symbol.for('isPublic')]) {
      return;
    }

    return identify;
  })();
}
