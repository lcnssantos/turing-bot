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
    const googleData = await this.googleService.fetch(question);
    console.log(googleData);
    const firstLink = googleData.response[0].url;
    const {
      result: { concepts, ...data },
    } = await this.watsonService.analizeUrl(firstLink);

    console.log(data);

    return {
      images: [],
      text: [],
      links: googleData.response.slice(0, 2).map((google) => google.url),
      search: question,
      suggestions: concepts.slice(0, 2).map((concept) => concept.text),
    };
  }
}
