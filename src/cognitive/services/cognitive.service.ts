import { Injectable } from '@nestjs/common';
import { CognitiveResponseDto } from '../cognitive.dto';
import { GoogleService } from './google.service';
import { WatsonService } from './watson.service';

@Injectable()
export class CognitiveService {
  constructor(
    private watsonService: WatsonService,
    private googleService: GoogleService,
  ) {}

  async fetch(question: string): Promise<CognitiveResponseDto> {
    const googleData = await this.googleService.fetch(
      'Programação: ' + question,
    );

    if (googleData.response.length === 0) {
      throw new Error('NOTFOUND');
    }

    const firstLink = googleData.response[0]?.url;
    const secondLink = googleData.response[1]?.url;
    let usedLink: string;

    try {
      var {
        result: { concepts, analyzed_text },
      } = await this.watsonService.analizeUrl(firstLink);
      usedLink = firstLink;
    } catch {
      var {
        result: { concepts, analyzed_text },
      } = await this.watsonService.analizeUrl(secondLink);
      usedLink = secondLink;
    }

    return {
      link: usedLink,
      text: analyzed_text
        .split('\n')
        .slice(0, 5)
        .map((text) => text.trim())
        .map((text) => text.trimEnd())
        .filter((item) => item.length > 0),
      links: googleData.response
        .slice(0, 3)
        .filter((response) => response.url !== usedLink)
        .map((google) => google.url),
      search: question,
      suggestions: concepts.slice(0, 3).map((concept) => concept.text),
    };
  }
}
