import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BotService } from './bot/bot.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.getHttpAdapter();

  const botService = await app.get(BotService);

  await botService.start(httpAdapter);

  await app.listen(process.env.PORT);
}
bootstrap();
