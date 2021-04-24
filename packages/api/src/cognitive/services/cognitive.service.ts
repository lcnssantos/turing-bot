import { Injectable } from '@nestjs/common';
import { CognitiveRequestDto, CognitiveResponseDto } from '../cognitive.dto';
import { GoogleService } from './google.service';
import { WatsonService } from './watson.service';
import { WikipediaService } from './wikipedia.service';

@Injectable()
export class CognitiveService {
  constructor(
    private watsonService: WatsonService,
    private wikipediaService: WikipediaService,
    private googleService: GoogleService,
  ) {}

  async fetch({
    question,
  }: CognitiveRequestDto): Promise<CognitiveResponseDto> {
    const googleData = await this.googleService.fetch(
      'Programação: ' + question.replace('?', ''),
    );
    const firstLink = googleData.response[0].url;
    const secondLink = googleData.response[1].url;
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
        .map((text) => text.trim())
        .map((text) => text.trimEnd())
        .filter((item) => item.length > 0)
        .slice(0, 5),
      links: googleData.response
        .filter((response) => response.url !== usedLink)
        .slice(0, 3)
        .map((google) => google.url),
      search: question,
      suggestions: concepts.slice(0, 2).map((concept) => concept.text),
    };
  }
}
