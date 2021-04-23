import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CognitiveModule } from './cognitive/cognitive.module';

@Module({
  imports: [ConfigModule.forRoot(), CognitiveModule],
})
export class AppModule {}
