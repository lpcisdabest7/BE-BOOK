import { $Enums } from '@prisma/client';
import { EventEmitter } from 'events';

// Define the event names and their corresponding argument types
type MyEvents = {
  data: string;
  finish: string;
  error: string;
};

// Extend the EventEmitter with typed events
export class BotAIEventEmitter extends EventEmitter {
  // Override emit with typed event names and arguments
  emit<K extends keyof MyEvents>(
    eventName: K,
    ...args: [MyEvents[K]]
  ): boolean {
    return super.emit(eventName, ...args);
  }

  // Override on with typed event names and callback arguments
  on<K extends keyof MyEvents>(
    eventName: K,
    listener: (arg: MyEvents[K]) => void,
  ): this {
    return super.on(eventName, listener);
  }
}

export type Options = {
  model: string;
  instruction: string;
  apiKey: string;
  responseFormat?: any;
};

export type BotCompetitions = Array<{
  from: $Enums.SendFrom;
  question?: string;
  imageUrl?: string;
}>;

export interface IBotLib {
  ask(competitions: BotCompetitions, options: Options): Promise<string>;
  askStreaming(
    competitions: BotCompetitions,
    options: Options,
  ): Promise<BotAIEventEmitter>;
}
