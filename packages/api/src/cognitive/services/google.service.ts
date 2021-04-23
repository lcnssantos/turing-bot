import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';
import * as algorithmia from 'algorithmia';

interface GoogleResponse {
  response: Array<{
    position: number;
    snippet: string;
    title: string;
    url: string;
  }>;
  searchTerm: string;
}

@Injectable()
export class GoogleService {
  private client: any;
  constructor(private cacheService: CacheService) {
    this.client = new algorithmia.client(process.env.ALGORITHMIA_KEY);
  }

  async fetch(searchTerm: string): Promise<GoogleResponse> {
    if (searchTerm === '') {
      throw new Error('No search');
    }

    const cacheKey = `google-${searchTerm}`;
    const cacheData = await this.cacheService.get<GoogleResponse>(cacheKey);

    if (cacheData) {
      return cacheData;
    }

    const data = await this.client
      .algo('specrom/Google_scraper/0.1.4?timeout=300')
      .pipe({ query: searchTerm });

    const response = data.get();

    await this.cacheService.save<GoogleResponse>(cacheKey, {
      response,
      searchTerm,
    });

    return {
      response,
      searchTerm,
    };
  }
}
