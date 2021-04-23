import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';
import * as algorithmia from 'algorithmia';

interface WikipediaResponse {
  summary: string;
  url: string;
  images: string[];
  searchTerm: string;
}

@Injectable()
export class WikipediaService {
  private client: any;
  constructor(private cacheService: CacheService) {
    this.client = new algorithmia.client(process.env.ALGORITHMIA_KEY);
  }

  async fetch(searchTerm: string): Promise<WikipediaResponse> {
    if (searchTerm === '') {
      throw new Error('No search');
    }

    const cacheKey = `wikipedia-${searchTerm}`;

    const cacheData = await this.cacheService.get<WikipediaResponse>(cacheKey);

    if (cacheData) {
      return cacheData;
    }

    const data = await this.client
      .algo('web/WikipediaParser/0.1.2?timeout=300')
      .pipe({
        articleName: searchTerm,
        lang: 'pt',
      });

    const { summary, url, images } = data.get();

    await this.cacheService.save<WikipediaResponse>(cacheKey, {
      summary,
      url,
      images,
      searchTerm,
    });

    return { summary, url, images, searchTerm };
  }
}
