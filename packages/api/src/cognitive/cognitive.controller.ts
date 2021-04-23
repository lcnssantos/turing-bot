import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CognitiveRequestDto, CognitiveResponseDto } from './cognitive.dto';
import { CognitiveService } from './services/cognitive.service';

@ApiTags('Cognitive')
@Controller('cognitive')
export class CognitiveController {
  constructor(private cognitiveService: CognitiveService) {}

  @ApiOperation({ description: 'Fetch a question to the api' })
  @ApiOkResponse({ description: 'The response', type: CognitiveResponseDto })
  @ApiInternalServerErrorResponse({
    description: 'An Internal server error ocurred',
  })
  @HttpCode(200)
  @Get()
  async getAnswer(
    @Query() cognitiveRequest: CognitiveRequestDto,
  ): Promise<CognitiveResponseDto> {
    return this.cognitiveService.fetch(cognitiveRequest);
  }
}
