import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { CognitiveModule } from './cognitive/cognitive.module';

@Module({
  imports: [ConfigModule.forRoot(), CognitiveModule, BotModule],
})
export class AppModule {}
