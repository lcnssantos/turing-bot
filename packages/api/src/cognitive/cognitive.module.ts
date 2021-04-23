import { CacheModule, Module } from '@nestjs/common';
import { CognitiveController } from './cognitive.controller';
import { CognitiveService } from './services/cognitive.service';
import { WatsonService } from './services/watson.service';
import * as mongoStore from 'cache-manager-mongodb';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from './services/cache.service';
import { WikipediaService } from './services/wikipedia.service';
import { GoogleService } from './services/google.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      store: mongoStore,
      uri: process.env.MONGO_URL,
      options: {
        collection: 'cache',
        compression: false,
        poolSize: 5,
      },
    }),
  ],
  providers: [
    CognitiveService,
    WatsonService,
    CacheService,
    WikipediaService,
    GoogleService,
  ],
  controllers: [CognitiveController],
})
export class CognitiveModule {}
