import { Module } from '@nestjs/common';
import { SuggestController } from './suggestion.controller';
import { SuggestService } from './suggestion.service';

@Module({
  controllers: [SuggestController],
  providers: [SuggestService],
})
export class SuggestModule {}
