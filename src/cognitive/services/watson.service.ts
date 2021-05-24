import { Injectable, Logger } from '@nestjs/common';
import * as NLU from 'ibm-watson/natural-language-understanding/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import { CacheService } from './cache.service';

interface TextResult {
  text: string;
  result: NLU.AnalysisResults;
}

interface HtmlResult {
  url: string;
  result: NLU.AnalysisResults;
}

@Injectable()
export class WatsonService {
  private client: NLU;
  private logger = new Logger(WatsonService.name);

  constructor(private cache: CacheService) {
    this.client = new NLU({
      authenticator: new IamAuthenticator({ apikey: process.env.IBM_API_KEY }),
      version: '2018-04-05',
      serviceUrl: process.env.IBM_API_URL,
    });
  }

  async analizeText(text: string) {
    this.logger.log(
      JSON.stringify({ type: 'watson.analyze.text', data: { text } }),
    );

    const data = await this.cache.get<TextResult>(text);

    if (data) {
      return data;
    }

    const { result } = await this.client.analyze({
      text,
      features: {
        keywords: {},
        concepts: {},
        entities: {},
        categories: {},
        emotion: {},
        relations: {},
        semantic_roles: {},
        sentiment: {},
        syntax: { sentences: true },
      },
    });

    await this.cache.save<TextResult>(
      text,
      { result, text },
      365 * 24 * 60 * 60,
    );

    return {
      result,
      text,
    };
  }

  async analizeUrl(url: string) {
    this.logger.log(
      JSON.stringify({ type: 'watson.analyze.url', data: { url } }),
    );

    const data = await this.cache.get<HtmlResult>(url);

    if (data) {
      return data;
    }

    const { result } = await this.client.analyze({
      url,
      returnAnalyzedText: true,
      features: {
        keywords: {},
        concepts: {},
        entities: {},
        metadata: {},
        categories: {},
        emotion: {},
        relations: {},
        semantic_roles: {},
        sentiment: {},
        syntax: { sentences: true },
      },
    });

    await this.cache.save<HtmlResult>(url, { result, url }, 365 * 24 * 60 * 60);

    return {
      result,
      url,
    };
  }
}
