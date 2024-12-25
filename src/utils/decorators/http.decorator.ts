import {
  applyDecorators,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  type PipeTransform,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type Type } from '@nestjs/common/interfaces';
import {
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from './role.decorator';
import { AuthIdentifyInterceptor } from '../interceptors';
import { AuthGuard, RolesGuard } from '../guards';
import { Role } from '@prisma/client';

export function Auth(roles: Role[] = []): MethodDecorator {
  return applyDecorators(
    Roles(roles),
    UseGuards(AuthGuard(), RolesGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthIdentifyInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function AuthRefreshToken(): MethodDecorator {
  return applyDecorators(
    UseGuards(AuthGuard({ refreshToken: true })),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string' },
        },
        required: ['refreshToken'],
      },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}

export function IntParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseIntPipe(), ...pipes);
}

export function ObjectIdParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
