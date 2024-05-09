import { Injectable } from '@nestjs/common';

@Injectable()
export class SuggestService {
  async getGoogleSuggestion(text: string) {
    const req = await fetch(`http://google.com/complete/search?output=toolbar&client=chrome&q=${text}`);
    const res = await req.json();
    const keywords = res[1];
    return keywords;
  }
}
