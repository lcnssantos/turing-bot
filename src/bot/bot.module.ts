import { Module } from '@nestjs/common';
import { CognitiveModule } from 'src/cognitive/cognitive.module';
import { BotService } from './bot.service';
import { BotTelegram } from './telegram/bot.telegram';

@Module({ imports: [CognitiveModule], providers: [BotService, BotTelegram] })
export class BotModule {}
