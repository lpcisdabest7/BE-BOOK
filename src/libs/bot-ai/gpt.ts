import OpenAI, { OpenAIError } from 'openai';
import { BotAIEventEmitter, BotCompetitions, IBotLib, Options } from './type';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionMessageParam,
} from 'openai/resources';
import { LoggerService } from 'src/core/logger/logger.service';
import { ApiException } from 'src/utils/exception';

@Injectable()
export class GPT implements IBotLib {
  constructor(private readonly loggerService: LoggerService) {}

  private async initClient(options: Options) {
    return new OpenAI({
      apiKey: options.apiKey, // This is the default and can be omitted
      maxRetries: 5,
    });
  }

  async ask(competitions: BotCompetitions, options: Options): Promise<string> {
    const client = await this.initClient(options);
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: options.instruction },
    ];
    competitions.forEach((competition) => {
      if (competition.imageUrl) {
        messages.push({
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: competition.imageUrl,
              },
            },
          ],
        });
      }
      messages.push({
        role: competition.from === 'USER' ? 'user' : 'assistant',
        content: [
          {
            type: 'text',
            text: competition.question!,
          },
        ],
      });
    });

    try {
      const params: ChatCompletionCreateParamsNonStreaming = {
        messages,
        model: options.model,
        response_format: options?.responseFormat || { type: 'text' },
      };
      this.loggerService.trace({
        message: 'Params send to OpenAI - NonStreaming',
        obj: params,
      });
      const chatCompletion = await client.chat.completions.create(params, {
        timeout: 10000, // timeout 10 seconds
      });
      return chatCompletion.choices[0].message.content!;
    } catch (error) {
      if (error instanceof OpenAIError) {
        this.loggerService.error(
          new InternalServerErrorException(error.message),
        );
        throw new ApiException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async askStreaming(
    competitions: BotCompetitions,
    options: Options,
  ): Promise<BotAIEventEmitter> {
    const event = new BotAIEventEmitter();
    const client = await this.initClient(options);
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: options.instruction },
    ];

    competitions.forEach((competition) => {
      if (competition.imageUrl) {
        messages.push({
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: competition.imageUrl,
              },
            },
          ],
        });
      }

      if (competition.question) {
        messages.push({
          role: competition.from === 'USER' ? 'user' : 'assistant',
          content: [
            {
              type: 'text',
              text: competition.question!,
            },
          ],
        });
      }
    });

    try {
      const params: ChatCompletionCreateParamsStreaming = {
        messages,
        model: options.model,
        response_format: options?.responseFormat || { type: 'text' },
        stream: true,
      };
      this.loggerService.trace({
        message: 'Params send to OpenAI - Streaming',
        obj: params,
      });
      const stream = await client.chat.completions.create(params, {
        timeout: 10000,
      });
      (async function () {
        let data = '';
        for await (const chunk of stream) {
          const content = chunk.choices[0].delta.content || '';
          data += content;
          for (const char of content) {
            event.emit('data', char);
          }
        }
        event.emit('finish', data);
      })();
      return event;
    } catch (error) {
      if (error instanceof OpenAIError) {
        this.loggerService.error(
          new InternalServerErrorException(error.message),
        );
      }
      event.emit('error', error.message);
      return event;
    }
  }
}
