import { ApiProperty } from '@nestjs/swagger';

export class CognitiveRequestDto {
  @ApiProperty()
  question: string;
}

export class CognitiveResponseDto {
  @ApiProperty()
  text: string[];

  @ApiProperty()
  links: string[];

  @ApiProperty()
  search: string;

  @ApiProperty()
  suggestions: string[];

  @ApiProperty()
  link: string
}
