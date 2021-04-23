import { ApiProperty } from '@nestjs/swagger';

export class CognitiveRequestDto {
  @ApiProperty()
  question: string;
}

export class CognitiveResponseDto {
  @ApiProperty()
  text: string[];

  @ApiProperty()
  images: string[];

  @ApiProperty()
  links: string[];

  @ApiProperty()
  search: string;

  @ApiProperty()
  suggestions: string[];
}
