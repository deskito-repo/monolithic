import { Controller, Get, Param } from '@nestjs/common';
import { SuggestService } from './suggestion.service';

@Controller('suggestion')
export class SuggestController {
  constructor(private readonly suggestService: SuggestService) { /** */ }

  @Get('/:searchText')
  async getAll(@Param('searchText') searchText: string) {
    return this.suggestService.getGoogleSuggestion(searchText);
  }
}
