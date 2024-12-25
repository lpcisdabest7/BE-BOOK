import {
  HttpStatus,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  type NestExpressApplication,
} from '@nestjs/platform-express';
import helmet from 'helmet';
import { setupSwagger } from './setup-swagger';
import { bold } from 'colorette';
import * as compression from 'compression';
import { AppExceptionFilter } from './filters';
import {
  ExceptionInterceptor,
  HttpInterceptor,
  HttpLoggerInterceptor,
} from './interceptors';
import { LoggerService } from 'src/core/logger/logger.service';
import { ConfigService } from 'src/core/config/config.service';
import { json } from 'express';

export const setupApp = async (appName: string, MainModule: any) => {
  const app = await NestFactory.create<NestExpressApplication>(
    MainModule,
    new ExpressAdapter(),
    {
      bufferLogs: true,
      cors: true,
    },
  );

  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(helmet());
  app.use(compression());
  app.use(json()); // Parses application/json payloads

  const loggerService = app.get(LoggerService);
  const secretService = app.get(ConfigService);

  loggerService.setApplication(appName);
  app.useLogger(loggerService);

  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AppExceptionFilter(loggerService));

  app.useGlobalInterceptors(
    new ExceptionInterceptor(),
    new HttpLoggerInterceptor(loggerService),
    new HttpInterceptor(),
  );

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'metrics', method: RequestMethod.GET },
    ],
  });

  if (secretService.application.ENABLE_DOCS) {
    setupSwagger(app);
    loggerService.log(
      `Documentation: http://localhost:${secretService.application.PORT}/docs`,
    );
  }

  await app.listen(secretService.application.PORT);
  loggerService.log(
    `🟢 ${appName} listening at ${bold(secretService.application.PORT)} on ${bold(
      secretService.application.NODE_ENV,
    )} 🟢\n`,
  );
};
