import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class ConfigService extends NestConfigService {
  constructor() {
    super();
  }

  application = {
    NODE_ENV: this.getOrThrow('NODE_ENV'),
    PORT: +this.getOrThrow<number>('PORT'),
    ENABLE_DOCS: ['1', 'yes', 'true'].includes(this.getOrThrow('ENABLE_DOCS')),
  };

  secret = {
    key: this.get('SECRET_KEY') || 'very_secret',
  };

  authentication = {
    secret: this.get('AUTH_SECRET_KEY') || 'very_secret',
    accessExpireTime: +this.get('AUTH_ACCESS_EXP_TIME') || 86400,
    refreshExpireTime: +this.get('AUTH_REFRESH_EXP_TIME') || 86400,
  };

  redis = {
    host: this.getOrThrow('REDIS_HOST'),
    port: +this.getOrThrow('REDIS_PORT'),
    db: this.get<number>('REDIS_DB') ? Number(this.get<number>('REDIS_DB')) : 0,
    username: this.get('REDIS_USERNAME'),
    password: this.get('REDIS_PASSWORD'),
  };

  aws = {
    accessKey: this.getOrThrow('AWS_ACCESS_KEY'),
    secretKey: this.getOrThrow('AWS_SECRET_KEY'),
    region: this.getOrThrow('AWS_REGION'),
    cdn: this.getOrThrow('AWS_CDN'),
  };

  s3 = {
    bucket: this.getOrThrow('S3_BUCKET'),
  };

  apiKey = {
    domain:
      this.application.NODE_ENV === 'production'
        ? 'https://api-apikey.apero.vn'
        : 'https://api-apikey.dev.apero.vn',
  };

  validateConfig<T extends object>(cls: ClassConstructor<T>, config: T): T {
    const configInstance = plainToInstance(cls, config, {});
    const errors = validateSync(configInstance);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(!err.constraints))
        .join(', ');
      throw new Error(`Invalid configuration: ${errorMessages}`);
    }

    return configInstance;
  }
}
