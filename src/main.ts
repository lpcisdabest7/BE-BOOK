import { AppModule } from './app.module';
import { setupApp } from './utils/setup-app';

async function bootstrap() {
  const name = 'apero-bot';
  await setupApp(name, AppModule);
}
bootstrap();
