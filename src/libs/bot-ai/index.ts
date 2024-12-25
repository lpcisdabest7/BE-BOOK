import { Bot, BotMessage } from '@prisma/client';
import { BotCompetitions, IBotLib } from './type';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Module,
  Scope,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { LoggerService } from 'src/core/logger/logger.service';
import { ApiException } from 'src/utils/exception';
import { GPT } from './gpt';
import { isURL } from 'src/utils/util';

@Injectable({ scope: Scope.REQUEST })
export class BotProvider {
  private bot: Bot;
  private redis: Redis | null;
  private botLib: IBotLib;
  private serviceName: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
    private readonly redisService: RedisService,
    @Inject('GPT')
    private readonly gpt: IBotLib,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  setBot(bot: Bot) {
    this.bot = bot;
    this.checkBot();
    return this;
  }

  private checkBot() {
    if (!this.bot) {
      throw new ApiException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!this.bot.isActive) {
      this.logger.error(
        new BadRequestException(`Bot is not active. Bot id: ${this.bot.id}`),
      );
      throw new ApiException('This bot is not active.', HttpStatus.BAD_REQUEST);
    }

    this.detectBot();
  }

  private detectBot() {
    if (this.bot.model.startsWith('gpt')) {
      this.botLib = this.gpt;
      this.serviceName = 'chatgpt';
    } else {
      throw new Error('Not support bot with model: ' + this.bot.model);
    }
  }

  private async getApiKey() {
    const redisKey = `api-key:${this.bot.applicationId}:${this.serviceName}`;
    const apiKeyLength = await this.redis?.llen(redisKey);

    if (apiKeyLength === 0) {
      const apiKeys = await this.prismaService.apiKey.findMany({
        where: {
          isActive: true,
          applicationId: this.bot.applicationId,
          serviceName: this.serviceName,
        },
        orderBy: {
          priority: 'asc',
        },
      });

      if (apiKeys.length === 0) {
        this.logger.fatal(
          new InternalServerErrorException(
            `Missing setup api key ${this.serviceName} for application: ${this.bot.applicationId}`,
          ),
        );

        throw new Error('Api Key is not setup.');
      }

      const redisPipeline = this.redis?.pipeline();
      apiKeys.forEach((item) => {
        let priority = item.priority;
        while (priority > 0) {
          redisPipeline?.rpush(redisKey, item.secretKey);
          priority -= 1;
        }
      });
      await redisPipeline?.exec();
    }

    const apiKey = await this.redis?.lpop(redisKey);

    if (!apiKey) {
      this.logger.fatal(
        new InternalServerErrorException(
          `Not found api key in redis. Key ${redisKey}`,
        ),
      );
      throw new ApiException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.redis?.rpush(redisKey, apiKey);

    return apiKey;
  }

  private prepareInput(
    botMessage: string | string[] | BotMessage | BotMessage[],
  ) {
    if (!Array.isArray(botMessage)) {
      botMessage = [botMessage as any];
    }

    const data: BotCompetitions = [];

    for (const item of botMessage) {
      if (!item) {
        continue;
      }
      if (typeof item === 'string') {
        if (isURL(item)) {
          data.push({ from: 'USER', imageUrl: item });
        } else {
          data.push({ from: 'USER', question: item });
        }
      } else {
        data.push({
          from: item.sendFrom,
          question: item.content,
          imageUrl: item.attachment ?? undefined,
        });
      }
    }

    return data;
  }

  async ask(botMessage: string | string[] | BotMessage | BotMessage[]) {
    const data = this.prepareInput(botMessage);
    const result = await this.botLib.ask(<any>data, {
      model: this.bot.model,
      instruction: this.bot.instruction,
      apiKey: await this.getApiKey(),
      responseFormat: this.bot.responseFormat,
    });

    return result;
  }

  async askStreaming(
    botMessage: string | string[] | BotMessage | BotMessage[],
  ) {
    const data = this.prepareInput(botMessage);
    try {
      const result = await this.botLib.askStreaming(<any>data, {
        model: this.bot.model,
        instruction: this.bot.instruction,
        apiKey: await this.getApiKey(),
        responseFormat: this.bot.responseFormat,
      });
      return result;
    } catch (error) {
      throw new ApiException(error);
    }
  }
}

@Module({
  providers: [
    BotProvider,
    {
      provide: 'GPT',
      useClass: GPT,
    },
  ],
  exports: [BotProvider],
})
export class BotAIModule {}
