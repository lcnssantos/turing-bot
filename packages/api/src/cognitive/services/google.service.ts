import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';
const serp = require('serp');

interface GoogleLink {
  title: string;
  url: string;
}

interface SerpResponse {
  url: string;
  title: string;
}

interface GoogleResponse {
  response: Array<GoogleLink>;
  searchTerm: string;
}

const allowedSites = [
  'wikipedia',
  'devmedia',
  'medium',
  'imasters',
  'edu',
  'developer.mozilla',
  'alura.com.br/artigos',
];

@Injectable()
export class GoogleService {
  constructor(private cacheService: CacheService) {}

  async fetch(searchTerm: string): Promise<GoogleResponse> {
    if (searchTerm === '') {
      throw new Error('No search');
    }

    const cacheKey = `google-${searchTerm}`;
    let cacheData = await this.cacheService.get<GoogleResponse>(cacheKey);

    if (!cacheData) {
      const options = {
        qs: {
          q: searchTerm,
          filter: 0,
          pws: 0,
        },
        num: 100,
      };

      const response = ((await serp.search(
        options,
      )) as Array<SerpResponse>).map((data) => {
        data.url = data.url
          .replace('/url?esrc=s&q=&rct=j&sa=U&url=', '')
          .split('&ved=')[0];
        return data;
      });

      await this.cacheService.save<GoogleResponse>(cacheKey, {
        response,
        searchTerm,
      });

      cacheData = {
        response,
        searchTerm,
      };
    }

    cacheData.response = cacheData.response.filter((data) =>
      allowedSites.some((site) => data.url.indexOf(site) > -1),
    );

    return cacheData;
  }
}
