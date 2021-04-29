export class CognitiveRequestDto {
  question: string;
}

export class CognitiveResponseDto {
  text: string[];
  links: string[];
  search: string;
  suggestions: string[];
  link: string;
}
